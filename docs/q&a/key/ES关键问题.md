1.0. ES架构
- master node：负责 es 集群的节点发现和元数据管理
- master-eligible node：有资格竞选 Master 的节点，一般奇数个
- data node：存储数据
- coordinating node：复制处理客户端请求的协调节点
- ingest node：对索引文档做预处理工作的节点
- shard：数据以shard为单位保存到data node中
- primary/replica shard：每个shard可配置一个或多个replica 副本，primary shard会把请求复制到replica shard上。

1.1. Elasticsearch 是如何实现 Master 选举的？
- Elasticsearch 的选主是 ZenDiscovery 模块负责的，主要包含 Ping（节点之间通过这个 RPC 来发现彼此）和 Unicast（单播模块包含一个主机列表以控制哪些节点需要 ping 通）这两部分；
  对所有可以成为 master 的节点（node.master: true）根据 nodeId 字典排序，每次选举每个节点都把自己所知道节点排一次序，然后选出第一个（第 0 位）节点，暂且认为它是 master 节点。
- 如果对某个节点的投票数达到一定的值（可以成为 master 节点数 n/2+1）并且该节点自己也选举自己，那这个节点就是 master。否则重新选举一直到满足上述条件。
- 补充：master 节点的职责主要包括集群、节点和索引的管理，不负责文档级别的管理；data 节点可以关闭 http 功能*。

1.2. Elasticsearch 中的节点（比如共 20 个），其中的 10 个，选了一个 master，另外 10 个选了另一个 master，怎么办？
- 当集群 master 候选数量不小于 3 个时，可以通过设置最少投票通过数量（discovery.zen.minimum_master_nodes）超过所有候选节点一半以上来解决脑裂问题；
- 当候选数量为两个时，只能修改为唯一的一个 master 候选，其他作为 data节点，避免脑裂问题。


2. ES使用场景
- 搜索引擎：电商网站的商品搜索、站内搜索、模糊查询、全文检索服务
- 非关系型数据库：业务宽表（数据库字段太多，查询太慢，索引没有办法再做优化）
- 数据库做统计查询，大数据近实时分析引擎
- 日志分析

3.0. 写入流程：
- 客户端向ES集群发起写入请求，这个时候呢，会和一个node节点进行连接，那么这个节点就称为协调节点(coordinating node)
- 当协调节点接收到请求后，会根据document对应的ID进行路由计算，然后将请求转发到对应的节点上。
- 当节点收到协调节点发来的写入通知后，就会将该document写入到本地，那么该document在写入节点对应的shard分片就是主分片(primary shard)
- 当主分片写入完成之后呢，会随机找一台机器进行副本复制，写入replica shard。
- 当主备分片都写入完成之后，协调节点就会将结果返回给客户端。

3.1. 读取流程。
- 客户端向集群发起读取请求，举例来说只是简单查询，然后就会和连接的节点进行通信，那么该节点就是协调节点。
- 协调节点根据查询的条件进行hash路由，按照轮询的方式来查找符合条件的主分片。
- 然后存储真正数据的节点将数据返回给协调节点进行汇总后再返回给客户端，至此简单的读取流程就结束了。当然如果主分片所在的节点发生了读取失败，那么就会从副本分片中进行拉取。


3.2. 搜索数据过程
- 客户端发送请求到一个 coordinate node。
- 协调节点将搜索请求转发到所有的 shard 对应的 primary shard 或 replica shard，都可以。
- query phase：每个 shard 将自己的搜索结果（其实就是一些 doc id）返回给协调节点，由协调节点进行数据的合并、排序、分页等操作，产出最终结果。
- fetch phase：接着由协调节点根据 doc id 去各个节点上拉取实际的 document 数据，最终返回给客户端。
- 写请求是写入 primary shard，然后同步给所有的 replica shard；读请求可以从 primary shard 或 replica shard 读取，采用的是随机轮询算法。

3.3 删除/更新数据底层原理
- 如果是删除操作，commit 的时候会生成一个 .del 文件，里面将某个 doc 标识为 deleted 状态，那么搜索的时候根据 .del 文件就知道这个 doc 是否被删除了。
- 如果是更新操作，就是将原来的 doc 标识为 deleted 状态，然后新写入一条数据。
- buffer 每 refresh 一次，就会产生一个 segment file，所以默认情况下是 1 秒钟一个 segment file，这样下来 segment file 会越来越多，此时会定期执行 merge。每次 merge 的时候，会将多个 segment file 合并成一个，同时这里会将标识为 deleted 的 doc 给物理删除掉，然后将新的 segment file 写入磁盘，这里会写一个 commit point，标识所有新的 segment file，然后打开 segment file 供搜索使用，同时删除旧的 segment file。


4.0. 倒排索引
- 倒排索引（Inverted Index）也叫反向索引，有反向索引必有正向索引。通俗地来讲，正向索引是通过key找value，反向索引则是通过value找key。
- Term（单词）：一段文本经过分析器分析以后就会输出一串单词，这一个一个的就叫做Term（直译为：单词）
- Term Dictionary（单词字典）：顾名思义，它里面维护的是Term，可以理解为Term的集合
- Term Index（单词索引）：为了更快的找到某个单词，我们为单词建立索引
- Posting List（倒排列表）：倒排列表记录了出现过某个单词的所有文档的文档列表及单词在该文档中出现的位置信息，每条记录称为一个倒排项(Posting)。根据倒排列表，即可获知哪些文档包含某个单词。（PS：实际的倒排列表中并不只是存了文档ID这么简单，还有一些其它的信息，比如：词频（Term出现的次数）、偏移量（offset）等，可以想象成是Python中的元组，或者Java中的对象）

4.1. ES正排索引
- 倒排索引也是有缺陷的，假如我们需要对数据做一些聚合操作，比如排序/分组时，lucene内部会遍历提取所有出现在文档集合的排序字段，然后再次构建一个最终的排好序的文档集合list，这个步骤的过程全部维持在内存中操作，而且如果排序数据量巨大的话，非常容易就造成solr内存溢出和性能缓慢。
- DocValues 就是 es 在构建倒排索引的同时，构建了正排索引，保存了docId到各个字段值的映射，可以看作是以文档为维度，从而实现根据指定字段进行排序和聚合的功能。另外doc Values 保存在操作系统的磁盘中，当docValues大于节点的可用内存，ES可以从操作系统页缓存中加载或弹出，从而避免发生内存溢出的异常，docValues远小于节点的可用内存，操作系统自然将所有Doc Values存于内存中（堆外内存），有助于快速访问。

5.0. 深分页问题
- 服务端缓存 Scan and scroll API。scroll调用本质上是实时创建了一个快照(snapshot)，然后保持这个快照一个指定的时间，这样，下次请求的时候就不需要重新排序了。从这个方面上来说，scroll就是一个服务端的缓存。既然是缓存，就会有下面两个问题：
- Search After：Scroll API相对于from+size方式当然是性能好很多，但是也有如下问题：Search context开销不小。 是一个临时快照，并不是实时的分页结果。 针对这些问题，ES 5.0 开始推出了Search After机制可以提供了更实时的游标(live cursor)。它的思想是利用上一页的分页结果来提高下一页的分页请求。

5.1. ES数据近实时问题
- ES数据写入之后，要经过一个refresh操作之后，才能够创建索引，进行查询。但是get查询很特殊，数据实时可查。
- ES5.0之前translog可以提供实时的CRUD，get查询会首先检查translog中有没有最新的修改，然后再尝试去segment中对id进行查找。5.0之后，为了减少translog设计的负责性以便于再其他更重要的方面对translog进行优化，所以取消了translog的实时查询功能。get查询的实时性，通过每次get查询的时候，如果发现该id还在内存中没有创建索引，那么首先会触发refresh操作，来让id可查。

5.2. 在海量数据中怎样提高效率
- filesystem cache：ES的搜索引擎是严重的依赖底层的filesystem cache，如果给filesystem cache更多的内存，尽量让内存可以容纳所有的index segment file 索引数据文件。
- 数据预热：对于那些你觉得比较热的数据，经常会有人访问的数据，最好做一个专门的缓存预热子系统，就是对热数据，每隔一段时间，你就提前访问以下，让数据进入filesystem cache里面去，这样期待下次访问的时候，性能会更好一些。
- 冷热分离：关于ES的性能优化，数据拆分，将大量的搜索不到的字段，拆分到别的存储中去，这个类似于MySQL的分库分表的垂直才分。
- document的模型设计：不要在搜索的时候去执行各种复杂的操作，尽量在document模型设计的时候，写入的时候就完成了，另外对于一些复杂的操作，尽量要避免
- 分页性能优化：翻页的时候，翻得越深，每个shard返回的数据越多，而且协调节点处理的时间越长，当然是用scroll，scroll会一次性的生成所有数据的一个快照，然后每次翻页都是通过移动游标完成的。 api 只是在一页一页的往后翻;不允许深度分页（默认深度分页性能很差）:跟产品经理说，你系统不允许翻那么深的页，默认翻的越深，性能就越差；类似于 app 里的推荐商品不断下拉出来一页一页的，类似于微博中，下拉刷微博，刷出来一页一页的，你可以用 scroll api。scroll 会一次性给你生成所有数据的一个快照，然后每次滑动向后翻页就是通过游标 scroll_id 移动，获取下一页下一页这样子，性能会比上面说的那种分页性能要高很多很多，基本上都是毫秒级的

5.3. 如何可以做到快速检索：（这里更详细：https://txxs.github.io/mark/db/es/es%E5%9C%A8%E6%95%B0%E6%8D%AE%E9%87%8F%E5%BE%88%E5%A4%A7%E7%9A%84%E6%83%85%E5%86%B5%E4%B8%8B%E6%95%B0%E5%8D%81%E4%BA%BF%E7%BA%A7%E5%88%AB%E5%A6%82%E4%BD%95%E6%8F%90%E9%AB%98%E6%9F%A5%E8%AF%A2%E6%95%88%E7%8E%87%E5%95%8A.html#%E9%9D%A2%E8%AF%95%E9%A2%98）
- 为了能够在数量巨大的 terms 中快速定位到某一个 term，同时节约对内存的使用和减少磁盘 io 的读取，lucene 使用 "term index -> term dictionary -> postings list" 的倒排索引结构，通过 FST 压缩放入内存，进一步提高搜索效率。
- 为了减少 postings list 的磁盘消耗，lucene 使用了 FOR（Frame of Reference）技术压缩(压缩Frame of Reference：在 lucene 中，要求 postings lists 都要是有序的整形数组。这样就带来了一个很好的好处，可以通过 增量编码（delta-encode）这种方式进行压缩。比如现在有 id 列表 [73, 300, 302, 332, 343, 372]，转化成每一个 id 相对于前一个 id 的增量值（第一个 id 的前一个 id 默认是 0，增量就是它自己）列表是[73, 227, 2, 30, 11, 29]。在这个新的列表里面，所有的 id 都是小于 255 的，所以每个 id 只需要一个字节存储。)，带来的压缩效果十分明显。
- ES 的 filter 语句采用了 Roaring Bitmap 技术来缓存搜索结果，保证高频 filter 查询速度的同时降低存储空间消耗。
- 在联合查询时，在有 filter cache 的情况下，会直接利用位图的原生特性快速求交并集得到联合查询结果，否则使用 skip list 对多个 postings list 求交并集，跳过遍历成本并且节省部分数据的解压缩 cpu 成本

5.4. Elasticsearch对于大数据量（上亿量级）的聚合如何实现？
- Elasticsearch 提供的首个近似聚合是cardinality 度量。它提供一个字段的基数，即该字段的distinct或者unique值的数目。它是基于HLL算法的。HLL 会先对我们的输入作哈希运算，然后根据哈希运算的结果中的 bits 做概率估算从而得到基数。其特点是：可配置的精度，用来控制内存的使用（更精确 ＝ 更多内存）；小的数据集精度是非常高的；我们可以通过配置参数，来设置去重需要的固定内存使用量。无论数千还是数十亿的唯一值，内存使用量只与你配置的精确度相关。

5.5. ElasticSearch中的分片
- 索引是文档的集合；分片 -因为Elasticsearch是一个分布式搜索引擎，所以索引通常被分割成分布在多个节点上的被称为分片的元素。
- ElasticSearch主分片数量可以在后期更改吗？为什么？不可以，因为根据路由算法shard = hash(document_id) % (num_of_primary_shards)，当主分片数量变化时会影响数据被路由到哪个分片上。
- 实验中更多的shards会带来额外的IO压力.Elastic 官方文档建议：一个 Node 最好不要多于三个 shards。

5.6. 在并发情况下，Elasticsearch 如果保证读写一致？
- 可以通过版本号使用乐观并发控制，以确保新版本不会被旧版本覆盖，由应用层来处理具体的冲突；
- 另外对于写操作，一致性级别支持 quorum/one/all，默认为 quorum，即只有当大多数分片可用时才允许写操作。但即使大多数可用，也可能存在因为网络等原因导致写入副本失败，这样该副本被认为故障，分片将会在一个不同的节点上重建。
- 对于读操作，可以设置 replication 为 sync(默认)，这使得操作在主分片和副本分片都完成后才会返回；如果设置 replication 为 async 时，也可以通过设置搜索请求参数_preference 为 primary 来查询主分片，确保文档是最新版本。

5.7 怎么快速找到目标Term的位置？
- Term Index：是Term Dictionary的索引，存Term的前缀，和与该前缀对应的Term Dictionary中的第一个Term的block的位置，找到这个第一个Term后会再往后顺序查找，直到找到目标Term。（存在内存）（理论上Term Index的数据结构就是：Map<Term的前缀, 对应的block的位置>但是Term量大的情况下同样会把内存撑爆。所以有了基于FST的压缩技术。Finite State Transducers（FST）：有穷状态转换器，Term Index采用的压缩技术。举个例子：Map[“cat”  - > 5, “deep” - > 10, “do” - > 15, “dog” - > 2, “dogs” - > 8 ]）
- Term Dictionary：把Term按字典序排列，然后用二分法查找Term （存在磁盘）


6.0. ES的heap被什么占用?
- Segment不是file吗？segment memory又是什么？前面提到过，一个segment是一个完备的lucene倒排索引，而倒排索引是通过词典 (Term Dictionary)到文档列表(Postings List)的映射关系，快速做查询的。 由于词典的size会很大，全部装载到heap里不现实，因此Lucene为词典做了一层前缀索引(Term Index)，这个索引在Lucene4.0以后采用的数据结构是FST (Finite State Transducer)。 这种数据结构占用空间很小，Lucene打开索引的时候将其全量装载到内存中，加快磁盘上词典查询速度的同时减少随机磁盘访问次数。
- 说白了,ES的data node存储数据并非只是耗费磁盘空间的，为了加速数据的访问，每个segment都有会一些索引数据驻留在heap里。因此segment越多，瓜分掉的heap也越多，并且这部分heap是无法被GC掉的！ 理解这点对于监控和管理集群容量很重要，当一个node的segment memory占用过多的时候，就需要考虑删除、归档数据，或者扩容了。

6.1. ES分配多少内存?VM参数如何优化?
- Lucene的倒排索引(Inverted Index)是先在内存里生成，然后定期以段文件(segment file)的形式刷到磁盘的。每个段实际就是一个完整的倒排索引，并且一旦写到磁盘上就不会做修改。 API层面的文档更新和删除实际上是增量写入的一种特殊文档，会保存在新的段里。不变的段文件易于被操作系统cache，热数据几乎等效于内存访问。
- Heap分配多少合适？遵从官方建议就没错。不要超过系统可用内存的一半，并且不要超过32GB。JVM参数呢？对于初级用户来说，并不需要做特别调整，仍然遵从官方的建议，将xms和xmx设置成和heap一样大小，避免动态分配heap size就好了。虽然有针对性的调整JVM参数可以带来些许GC效率的提升，当有一些“坏”用例的时候，这些调整并不会有什么魔法效果帮你减轻heap压力，甚至可能让问题更糟糕。

6.2. GC 方面，在使用 Elasticsearch 时要注意什么？
- 倒排词典的索引需要常驻内存，无法 GC，需要监控 data node 上 segmentmemory 增长趋势。
- 各类缓存，field cache, filter cache, indexing cache, bulk queue 等等，要设置合理的大小，并且要应该根据最坏的情况来看 heap 是否够用，也就是各类缓存全部占满的时候，还有 heap 空间可以分配给其他任务吗？避免采用 clear cache等“自欺欺人”的方式来释放内存。
- 避免返回大量结果集的搜索与聚合。确实需要大量拉取数据的场景，可以采用scan & scroll api 来实现。
- cluster stats 驻留内存并无法水平扩展，超大规模集群可以考虑分拆成多个集群通过 tribe node 连接。
- 想知道 heap 够不够，必须结合实际应用场景，并对集群的 heap 使用情况做持续的监控。


7. 几个用法区别
- text 和 keyword类型的区别：两个的区别主要分词的区别：keyword 类型是不会分词的，直接根据字符串内容建立倒排索引，keyword类型的字段只能通过精确值搜索到；Text 类型在存入 Elasticsearch 的时候，会先分词，然后根据分词后的内容建立倒排索引
- query 和 filter 的区别？query：查询操作不仅仅会进行查询，还会计算分值，用于确定相关度；filter：查询操作仅判断是否满足查询条件，不会计算任何分值，也不会关心返回的排序问题，同时，filter 查询的结果可以被缓存，提高性能。
- term、match、match_phrase三者对比：term:该类关键词用于精准匹配，不会对指定的搜索值进行分词处理。也就是说该类关键词不会进行分词处理，属于词项搜索，例如如果要搜索“china”词，那么就会返回china，而不是返回chain这类的词；match:该类关键词用于模糊匹配，会对查询值进行分词处理，返回的结果值会根据TF/IDF进行打分并按照分值降序输出。match_phrase：该类用于短语搜索，要求所有的分词必须同时出现在文档中，而且位置必须紧邻一致。也就是说该关键词会进行分词，属于全文搜索，但分词位置必须相邻


