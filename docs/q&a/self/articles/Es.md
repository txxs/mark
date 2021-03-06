# ES

------------

> 引用自：https://www.jianshu.com/p/52b92f1a9c47

Elasticsearch设计的理念就是分布式搜索引擎，底层其实还是基于lucene的。核心思想就是在多台机器上启动多个es进程实例，组成了一个es集群。如果使用ES集群，会将单台服务器节点的索引文件使用分片技术，分布式的存放在多个不同的物理机器上，从而可以实现高可用、容错性等。

> 引用自：https://www.cnblogs.com/GO-NO-1/p/13353993.html

### 1. ES架构

![图片](https://txxs.github.io/pic/q&a/WX20210921-154317@2-1x.png)

- master node：负责 es 集群的节点发现和元数据管理
- master-eligible node：有资格竞选 Master 的节点，一般奇数个
- data node：存储数据
- coordinating node：复制处理客户端请求的协调节点
- ingest node：对索引文档做预处理工作的节点
- shard：数据以shard为单位保存到data node中
- primary/replica shard：每个shard可配置一个或多个replica 副本，primary shard会把请求复制到replica shard上。

#### 1.1 主要过程

**es写入数据的过程**：客户端选择一个node发送请求过去，这个node就是coordinating node (协调节点)；coordinating node，对document进行路由，将请求转发给对应的node；实际上的node上的primary shard处理请求，然后将数据同步到replica node；coordinating node，如果发现primary node和所有的replica node都搞定之后，就会返回请求到客户端。基本是四个过程：

- refresh：每隔1s进行一次refresh操作，buffer已满，则进行一次refresh操作，清空buffer。
- commit：每隔30分钟执行一次translog，translog日志已满，生成一个 commit point 文件标识此次操作一件把buffer数据执行到了哪一个segment文件，执行flush操作。
- flush：commit操作中。
- merge：后台检查。


**写入底层原理**：

- 数据先写入到buffer里面，在buffer里面的数据时搜索不到的，同时将数据写入到translog日志文件之中
- 如果buffer快满了，或是一段时间之后，就会将buffer数据refresh到一个新的OS cache之中，然后每隔1秒，就会将OS cache的数据写入到segment file之中，但是如果每一秒钟没有新的数据到buffer之中，就会创建一个新的空的segment file，只要buffer中的数据被refresh到OS cache之中，就代表这个数据可以被搜索到了。当然可以通过restful api 和Java api，手动的执行一次refresh操作，就是手动的将buffer中的数据刷入到OS cache之中，让数据立马搜索到，只要数据被输入到OS cache之中，buffer的内容就会被清空了。同时进行的是，数据到shard之后，就会将数据写入到translog之中，每隔5秒将translog之中的数据持久化到磁盘之中
- 重复以上的操作，每次一条数据写入buffer，同时会写入一条日志到translog日志文件之中去，这个translog文件会不断的变大，当达到一定的程度之后，就会触发commit操作。
- 将一个commit point写入到磁盘文件，里面标识着这个commit point 对应的所有segment file
- 强行将OS cache 之中的数据都fsync到磁盘文件中去。
  解释：translog的作用：在执行commit之前，所有的而数据都是停留在buffer或OS cache之中，无论buffer或OS cache都是内存，一旦这台机器死了，内存的数据就会丢失，所以需要将数据对应的操作写入一个专门的日志问价之中，一旦机器出现宕机，再次重启的时候，es会主动的读取translog之中的日志文件的数据，恢复到内存buffer和OS cache之中。
- 将现有的translog文件进行清空，然后在重新启动一个translog，此时commit就算是成功了，默认的是每隔30分钟进行一次commit，但是如果translog的文件过大，也会触发commit，整个commit过程就叫做一个flush操作，我们也可以通过ES API,手动执行flush操作，手动将OS cache 的数据fsync到磁盘上面去，记录一个commit point，清空translog文件
  补充：其实translog的数据也是先写入到OS cache之中的，默认每隔5秒之中将数据刷新到硬盘中去，也就是说，可能有5秒的数据仅仅停留在buffer或者translog文件的OS cache中，如果此时机器挂了，会丢失5秒的数据，但是这样的性能比较好，我们也可以将每次的操作都必须是直接fsync到磁盘，但是性能会比较差。
- 如果时删除操作，commit的时候会产生一个.del文件，里面讲某个doc标记为delete状态，那么搜索的时候，会根据.del文件的状态，就知道那个文件被删除了。
- 如果时更新操作，就是讲原来的doc标识为delete状态，然后重新写入一条数据即可。
- buffer每次更新一次，就会产生一个segment file 文件，所以在默认情况之下，就会产生很多的segment file 文件，将会定期执行merge操作
- 每次merge的时候，就会将多个segment file 文件进行合并为一个，同时将标记为delete的文件进行删除，然后将新的segment file 文件写入到磁盘，这里会写一个commit point，标识所有的新的segment file，然后打开新的segment file供搜索使用。

简化写入过程：

- 不断将 Document 写入到 In-memory buffer （内存缓冲区）。
- 当满足一定条件后内存缓冲区中的 Documents 刷新到 高速缓存（cache）。
- 生成新的 segment ，这个 segment 还在 cache 中。
- 这时候还没有 commit ，但是已经可以被读取了。

数据从buffer到cache的过程是定期每秒刷新一次。所以新写入的Document最慢1秒就可以在cache中被搜索到。而Document从buffer到cache的过程叫做?refresh。一般是1秒刷新一次，不需要进行额外修改。当然，如果有修改的需要，可以参考文末的相关资料。这也就是为什么说 Elasticsearch 是准实时的。

> 引用自：https://liuzhihang.com/2020/08/29/technology-sharing-es-5

**Translog 事务日志**

此处可以联想 Mysql 的 binlog， ES 中也存在一个 translog 用来失败恢复。

- Document 不断写入到 In-memory buffer，此时也会追加 translog。
- 当 buffer 中的数据每秒 refresh 到 cache 中时，translog 并没有进入到刷新到磁盘，是持续追加的。
- translog 每隔 5s 会 fsync 到磁盘。
- translog 会继续累加变得越来越大，当 translog 大到一定程度或者每隔一段时间，会执行 flush。

**删除和更新**

- segment 不可改变，所以 docment 并不能从之前的 segment 中移除或更新。
- 所以每次 commit， 生成 commit point 时，会有一个 .del 文件，里面会列出被删除的 document（逻辑删除）。
- 而查询时，获取到的结果在返回前会经过 .del 过滤。
- 更新时，也会标记旧的 docment 被删除，写入到 .del 文件，同时会写入一个新的文件。此时查询会查询到两个版本的数据，但在返回前会被移除掉一个。

删除的其他解释：

- 删除和更新也都是写操作，但是 Elasticsearch 中的文档是不可变的，因此不能被删除或者改动以展示其变更；
- 磁盘上的每个段都有一个相应的.del 文件。当删除请求发送后，文档并没有真的被删除，而是在.del 文件中被标记为删除。该文档依然能匹配查询，但是会在结果中被过滤掉。当段合并时，在.del 文件中被标记为删除的文档将不会被写入新段。
- 在新的文档被创建时，Elasticsearch 会为该文档指定一个版本号，当执行更新时，旧版本的文档在.del 文件中被标记为删除，新版本的文档被索引到一个新段。旧版本的文档依然能匹配查询，但是会在结果中被过滤掉。


**es读数据过程**：查询，GET某一条的数据，写入某个document，这个document会自动给你分配一个全局的唯一ID，同时跟住这个ID进行hash路由到对应的primary shard上面去，当然也可以手动的设置ID；客户端发送任何一个请求到任意一个node，成为coordinate node；coordinate node 对document进行路由，将请求转发到对应的node，此时会使用round-robin随机轮训算法，在primary shard 以及所有的replica中随机选择一个，让读请求负载均衡；接受请求的node，返回document给coordinate note；coordinate node返回给客户端

**es搜索数据过程**：客户端发送一个请求给coordinate node；协调节点将搜索的请求转发给所有的shard对应的primary shard或replicashard；query phase：每一个shard将自己搜索的结果（其实也就是一些唯一标识），返回给协调节点，有协调节点进行数据的合并，排序，分页等操作，产出最后的结果；fetch phase ，接着由协调节点，根据唯一标识去各个节点进行拉去数据，最总返回给客户端

**搜索的底层原理**

查询过程大体上分为查询和取回这两个阶段，广播查询请求到所有相关分片，并将它们的响应整合成全局排序后的结果集合，这个结果集合会返回给客户端。

1. 查询阶段：当一个节点接收到一个搜索请求，这这个节点就会变成协调节点，第一步就是将广播请求到搜索的每一个节点的分片拷贝，查询请求可以被某一个主分片或某一个副分片处理，协调节点将在之后的请求中轮训所有的分片拷贝来分摊负载。
2. 查询阶段：每一个分片将会在本地构建一个优先级队列，如果客户端要求返回结果排序中从from名开始的数量为size的结果集，每一个节点都会产生一个from+size大小的结果集，因此优先级队列的大小也就是from+size，分片仅仅是返回一个轻量级的结果给协调节点，包括结果级中的每一个文档的ID和进行排序所需要的信息。
3. 查询阶段：协调节点将会将所有的结果进行汇总，并进行全局排序，最总得到排序结果。
4. 取值阶段：查询过程得到的排序结果，标记处哪些文档是符合要求的，此时仍然需要获取这些文档返回给客户端。
5. 取值阶段：协调节点会确定实际需要的返回的文档，并向含有该文档的分片发送get请求，分片获取的文档返回给协调节点，协调节点将结果返回给客户端。


**ES集群一致性**：在一致性的条件下，系统在执行数据更新操作之后能够从一致性状态转移到另一个一致性状态。对系统的一个数据更新成功之后，如果所有用户都能够读取到最新的值，该系统就被认为具有强一致性。ES数据并发冲突控制是基于的乐观锁和版本号的机制。一个document第一次创建的时候，它的_version内部版本号就是1；以后，每次对这个document执行修改或者删除操作，都会对这个_version版本号自动加1；哪怕是删除，也会对这条数据的版本号加1(假删除)。客户端对es数据做更新的时候，如果带上了版本号，那带的版本号与es中文档的版本号一致才能修改成功，否则抛出异常。如果客户端没有带上版本号，首先会读取最新版本号才做更新尝试，这个尝试类似于CAS操作，可能需要尝试很多次才能成功。乐观锁的好处是不需要互斥锁的参与。es节点更新之后会向副本节点同步更新数据(同步写入)，直到所有副本都更新了才返回成功。

> 引用自：https://zhuanlan.zhihu.com/p/110015509

#### 1.2 选举过程

Elasticsearch采用了master-slave模式， ES会在集群中选取一个节点成为主节点，只有Master节点有资格维护全局的集群状态，在有节点加入或者退出集群的时候，它会重新分配分片，并将集群最新状态发送给集群中其它节点，主节点会以周期性ping的方式以验证其它节点是否存活。Elasticsearch的选举算法基于Bully选举算法，简单的说，在bully算法中，每个节点都有一个编号，只有编号最大的存活节点才能成为master节点。两个前提：

- 只有候选主节点（master：true）的节点才能成为主节点。
- 最小主节点数（min_master_nodes）的目的是防止脑裂。


1. 选举时间点，选举的时间点有两个：某个新节点加入了集群或者某个节点从宕机中恢复；集群中的某个节点检测到leader崩溃
2. 选举流程，选举的流程说明如下：节点node向所有比自己大的节点发送选举消息(选举为election消息)；如果节点node得不到任何回复(回复为alive消息)，那么节点node成为master，并向所有的其它节点宣布自己是master(宣布为Victory消息)；如果node得到了任何回复，node节点就一定不是master，同时等待Victory消息，如果等待Victory超时那么重新发起选举

Elasticsearch编号比较：Elasticsearch编号比较的判断依据有两个，首先是ClusterState版本号的比较，版本号越大优先级越高，然后是节点id的比较，id越小优先级越高。ClusterState是Master向集群中各个节点发送的集群状态，这个状态有一个版本号码，如果集群状态发生了变化，比如集群新增了节点成员或者有节点成员退出了，那么这个版本号就会加一，比对这个版本号的目的是让拥有最新状态的节点成为Master的优先级最高。

#### 1.3 脑裂问题

脑裂问题指的是一个集群中出现了两个及以上的Master节点。


Elasticsearch脑裂解决方案

- Quorum算法：脑裂问题是所有集群选举算法都要面对的一个问题，Elasticsearch集群机制采用了最小参与节点的方案解决的。假设elasticsearch集群中有资格投票的实例个数是n，节点想要成为master必须要得到n/2 +1票数(在本示例中是4)。上图中的分区一P6和分区二中的P4，任何一个master节点所在的分区集群的候选节点数目都小于4，更不可能得到4个选票，所以整个Elasticsearch集群处于瘫痪状态。我们也可以强制指定elasticsearch节点在有M个候选节点的情况下能选举出一个主节点，但是如果配置数小于上文提到的 n/2 +1 那么会出现脑裂的情况，如果产生了脑裂情况，为了避免脑裂的Master生成错误数据对整个集群产生影响。Master更新集群状态时还作出了如下防护，Master有两种指令，一种是send指令，另一种是commit指令，Master将最新集群状态推送给其它节点的时候(这是send指令)，Master节点进入等待响应状态，其它节点并不会立刻应用该集群状态，而是首先会响应Master节点表示它已经收到集群状态更新，同时等待Master节点的commit指令。Master节点如果在discovery.zen.commit_timeout配置时间内都没有收到discovery.zen.minimum_master_nodes个数的节点响应，那么Master节点就不会向其它节点发送commit指令。如果Master收到了足够数量的响应，那么Master会向集群发出提交状态的指令，此时其它节点应用集群最新状态，Master节点再次等待所有节点响应，等待时间为discovery.zen.publish_timeout，如果任何一个节点没有发出提交响应，Master再次更新整个集群状态更新。

- Master降级：Master主动降级发生在两种情况。第一种是master发现自己能连接到的其它节点数目小于n/2+1，那么master自动降级为candidate；第二种是Master在ping其它节点时候，如果发现了其它master，那么当前的master会比较cluster_state的version，如果当前master的version小，那么主动降级为candidate并主动加入另外一个master节点


### 2. ElasticSearch概念、原理与实现

Elasticsearch 的基本概念：

- index 索引：索引类似于mysql 中的数据库，Elasticesearch 中的索引是存在数据的地方，包含了一堆有相似结构的文档数据。
- type 类型：类型是用来定义数据结构，可以认为是 mysql 中的一张表，type 是 index 中的一个逻辑数据分类
- document 文档：类似于 MySQL 中的一行，不同之处在于 ES 中的每个文档可以有不同的字段，但是对于通用字段应该具有相同的数据类型，文档是es中的最小数据单元，可以认为一个文档就是一条记录。
- Field 字段：Field是Elasticsearch的最小单位，一个document里面有多个field
- shard 分片：单台机器无法存储大量数据，es可以将一个索引中的数据切分为多个shard，分布在多台服务器上存储。有了shard就可以横向扩展，存储更多数据，让搜索和分析等操作分布到多台服务器上去执行，提升吞吐量和性能。
- replica 副本：任何一个服务器随时可能故障或宕机，此时 shard 可能会丢失，因此可以为每个 shard 创建多个 replica 副本。replica可以在shard故障时提供备用服务，保证数据不丢失，多个replica还可以提升搜索操作的吞吐量和性能。primary shard（建立索引时一次设置，不能修改，默认5个），replica shard（随时修改数量，默认1个），默认每个索引10个 shard，5个primary shard，5个replica shard，最小的高可用配置，是2台服务器。


一次完整的搜索从用户输入要查询的关键词开始，比如想查找 Lucene 的相关学习资料，我们都会在 Google 或百度等搜索引擎中输入关键词，比如输入“Lucene ，全文检索框架”，之后系统根据用户输入的关键词返回相关信息。一次检索大致可分为四步：

第一步：查询分析：正常情况下用户输入正确的查询，比如搜索“里约奥运会”这个关键词，用户输入正确完成一次搜索，但是搜索通常都是全开放的，任何的用户输入都是有可能的，很大一部分还是非常口语化和个性化的，有时候还会存在拼写错误，用户不小心把“淘宝”打成“涛宝”，这时候需要用自然语言处理技术来做拼写纠错等处理，以正确理解用户需求。

第二步：分词技术：这一步利用自然语言处理技术将用户输入的查询语句进行分词，如标准分词会把“lucene全文检索框架”分成 lucene | 全 | 文｜检｜索｜框｜架｜， IK分词会分成： lucene｜全文｜检索｜框架｜,还有简单分词等多种分词方法。

第三步：关键词检索：提交关键词后在倒排索引库中进行匹配，倒排索引就是关键词和文档之间的对应关系，就像给文档贴上标签。比如在文档集中含有 "lucene" 关键词的有文档1 、文档 6、文档9，含有 "全文检索" 关键词的有文档1 、文档6 那么做与运算，同时含有 "lucene" 和 "全文检索" 的文档就是文档1和文档6，在实际的搜索中会有更复杂的文档匹配模型。

第四步：搜索排序：对多个相关文档进行相关度计算、排序，返回给用户检索结果。

> 引用自：https://www.cnblogs.com/cjsblog/p/10327673.html

#### 2.1 倒排索引

**倒排索引（Inverted Index）也叫反向索引，有反向索引必有正向索引。通俗地来讲，正向索引是通过key找value，反向索引则是通过value找key。**

首先，来搞清楚几个概念，为此，举个例子：假设有个user索引，它有四个字段：分别是name，gender，age，address：

- Term（单词）：一段文本经过分析器分析以后就会输出一串单词，这一个一个的就叫做Term（直译为：单词）
- Term Dictionary（单词字典）：顾名思义，它里面维护的是Term，可以理解为Term的集合
- Term Index（单词索引）：为了更快的找到某个单词，我们为单词建立索引
- Posting List（倒排列表）：倒排列表记录了出现过某个单词的所有文档的文档列表及单词在该文档中出现的位置信息，每条记录称为一个倒排项(Posting)。根据倒排列表，即可获知哪些文档包含某个单词。（PS：实际的倒排列表中并不只是存了文档ID这么简单，还有一些其它的信息，比如：词频（Term出现的次数）、偏移量（offset）等，可以想象成是Python中的元组，或者Java中的对象）

我们知道，每个文档都有一个ID，如果插入的时候没有指定的话，Elasticsearch会自动生成一个，因此ID字段就不多说了。Elasticsearch分别为每个字段都建立了一个倒排索引。比如，在上面“张三”、“北京市”、22 这些都是Term，而[1，3]就是PostingList。Posting list就是一个数组，存储了所有符合某个Term的文档ID。只要知道文档ID，就能快速找到文档。可是，要怎样通过我们给定的关键词快速找到这个Term呢？当然是建索引了，为Terms建立索引，最好的就是B-Tree索引

**在倒排索引中，通过Term索引可以找到Term在Term Dictionary中的位置，进而找到Posting List，有了倒排列表就可以根据ID找到文档了**

> 引用自：https://segmentfault.com/a/1190000037658997

在实际使用中，postings list 还需要解决几个痛点，postings list 如果不进行压缩，会非常占用磁盘空间，联合查询下，如何快速求交并集（intersections and unions）。对于如何压缩，可能会有人觉得没有必要，”posting list 不是已经只存储文档 id 了吗？还需要压缩？”，但是如果在 posting list 有百万个 doc id 的情况，压缩就显得很有必要了。

1. 压缩Frame of Reference：在 lucene 中，要求 postings lists 都要是有序的整形数组。这样就带来了一个很好的好处，可以通过 增量编码（delta-encode）这种方式进行压缩。比如现在有 id 列表 [73, 300, 302, 332, 343, 372]，转化成每一个 id 相对于前一个 id 的增量值（第一个 id 的前一个 id 默认是 0，增量就是它自己）列表是[73, 227, 2, 30, 11, 29]。在这个新的列表里面，所有的 id 都是小于 255 的，所以每个 id 只需要一个字节存储。

2. 联合查询：讲完了压缩，我们再来讲讲联合查询。先讲简单的，如果查询有 filter cache，那就是直接拿 filter cache 来做计算，也就是说位图来做 AND 或者 OR 的计算。如果查询的 filter 没有缓存，那么就用 skip list 的方式去遍历磁盘上的 postings list。我们现在需要把它们用 AND 的关系合并，得出 posting list 的交集。首先选择最短的 posting list，逐个在另外两个 posting list 中查找看是否存在，最后得到交集的结果。遍历的过程可以跳过一些元素，比如我们遍历到绿色的 13 的时候，就可以跳过蓝色的3了，因为3比13要小。用skiplist还会带来一个好处，还记得前面说的吗，postingslist在磁盘里面是采用FOR的编码方式存储的，会把所有的文档分成很多个block，每个block正好包含256个文档，然后单独对每个文档进行增量编码，计算出存储这个 block 里面所有文档最多需要多少位来保存每个 id，并且把这个位数作为头信息（header）放在每个 block 的前面。因为这个 FOR 的编码是有解压缩成本的。利用 skip list，除了跳过了遍历的成本，也跳过了解压缩这些压缩过的 block 的过程，从而节省了 cpu。

如何可以做到快速检索：

- 为了能够快速定位到目标文档，ES 使用倒排索引技术来优化搜索速度，虽然空间消耗比较大，但是搜索性能提高十分显著。
- 为了能够在数量巨大的 terms 中快速定位到某一个 term，同时节约对内存的使用和减少磁盘 io 的读取，lucene 使用 "term index -> term dictionary -> postings list" 的倒排索引结构，通过 FST 压缩放入内存，进一步提高搜索效率。
- 为了减少 postings list 的磁盘消耗，lucene 使用了 FOR（Frame of Reference）技术压缩，带来的压缩效果十分明显。
- ES 的 filter 语句采用了 Roaring Bitmap 技术来缓存搜索结果，保证高频 filter 查询速度的同时降低存储空间消耗。
- 在联合查询时，在有 filter cache 的情况下，会直接利用位图的原生特性快速求交并集得到联合查询结果，否则使用 skip list 对多个 postings list 求交并集，跳过遍历成本并且节省部分数据的解压缩 cpu 成本

> 引用自：https://segmentfault.com/a/1190000015256970

#### 2.2 在海量数据中怎样提高效率

- filesystem cache：ES的搜索引擎是严重的依赖底层的filesystem cache，如果给filesystem cache更多的内存，尽量让内存可以容纳所有的index segment file 索引数据文件
- 数据预热：对于那些你觉得比较热的数据，经常会有人访问的数据，最好做一个专门的缓存预热子系统，就是对热数据，每隔一段时间，你就提前访问以下，让数据进入filesystem cache里面去，这样期待下次访问的时候，性能会更好一些。
- 冷热分离：关于ES的性能优化，数据拆分，将大量的搜索不到的字段，拆分到别的存储中去，这个类似于MySQL的分库分表的垂直才分。
- document的模型设计：不要在搜索的时候去执行各种复杂的操作，尽量在document模型设计的时候，写入的时候就完成了，另外对于一些复杂的操作，尽量要避免
- 分页性能优化：翻页的时候，翻得越深，每个shard返回的数据越多，而且协调节点处理的时间越长，当然是用scroll，scroll会一次性的生成所有数据的一个快照，然后每次翻页都是通过移动游标完成的。 api 只是在一页一页的往后翻

### 问题

1. ES使用场景

- 搜索引擎：电商网站的商品搜索、站内搜索、模糊查询、全文检索服务
- 非关系型数据库：业务宽表（数据库字段太多，查询太慢，索引没有办法再做优化）
- 数据库做统计查询，大数据近实时分析引擎
- 日志分析

> 引用自：https://www.jianshu.com/p/52b92f1a9c47

2. 深分页问题

解决方案1：服务端缓存 Scan and scroll API

为了返回某一页记录，其实我们抛弃了其他的大部分已经排好序的结果。那么简单点就是把这个结果缓存起来，下次就可以用上了。根据这个思路，ES提供了Scroll API。它概念上有点像传统数据库的游标(cursor)。

scroll调用本质上是实时创建了一个快照(snapshot)，然后保持这个快照一个指定的时间，这样，下次请求的时候就不需要重新排序了。从这个方面上来说，scroll就是一个服务端的缓存。既然是缓存，就会有下面两个问题：

一致性问题。ES的快照就是产生时刻的样子了，在过期之前的所有修改它都视而不见。
服务端开销。ES这里会为每一个scroll操作保留一个查询上下文(Search context)。ES默认会合并多个小的索引段(segment)成大的索引段来提供索引速度，在这个时候小的索引段就会被删除。但是在scroll的时候，如果ES发现有索引段正处于使用中，那么就不会对它们进行合并。这意味着需要更多的文件描述符以及比较慢的索引速度。
其实这里还有第三个问题，但是它不是缓存的问题，而是因为ES采用的游标机制导致的。就是你只能顺序的扫描，不能随意的跳页。而且还要求客户每次请求都要带上”游标”。

解决方案2：Search After

Scroll API相对于from+size方式当然是性能好很多，但是也有如下问题：

Search context开销不小。
是一个临时快照，并不是实时的分页结果。
针对这些问题，ES 5.0 开始推出了Search After机制可以提供了更实时的游标(live cursor)。它的思想是利用上一页的分页结果来提高下一页的分页请求。

3. ES数据近实时问题

ES数据写入之后，要经过一个refresh操作之后，才能够创建索引，进行查询。但是get查询很特殊，数据实时可查。

ES5.0之前translog可以提供实时的CRUD，get查询会首先检查translog中有没有最新的修改，然后再尝试去segment中对id进行查找。5.0之后，为了减少translog设计的负责性以便于再其他更重要的方面对translog进行优化，所以取消了translog的实时查询功能。get查询的实时性，通过每次get查询的时候，如果发现该id还在内存中没有创建索引，那么首先会触发refresh操作，来让id可查。

> 引用自：https://zhuanlan.zhihu.com/p/102500311

4.  分片的设定

分片数过小，数据写入形成瓶颈，无法水平拓展。分片数过多，每个分片都是一个lucene的索引，分片过多将会占用过多资源

如何计算分片数：需要注意分片数量最好设置为节点数的整数倍，保证每一个主机的负载是差不多一样的，特别的，如果是一个主机部署多个实例的情况，更要注意这一点，否则可能遇到其他主机负载正常，就某个主机负载特别高的情况。一般我们根据每天的数据量来计算分片，保持每个分片的大小在 50G 以下比较合理。如果还不能满足要求，那么可能需要在索引层面通过拆分更多的索引或者通过别名 + 按小时 创建索引的方式来实现了。

5. elasticsearch 了解多少，说说你们公司 es 的集群架构，索引数据大小，分片有多少，以及一些调优手段 。

如实结合自己的实践场景回答即可。比如：ES 集群架构 13 个节点，索引根据通道不同共 20+索引，根据日期，每日递增 20+，索引：10 分片，每日递增 1 亿+数据，每个通道每天索引大小控制：150GB 之内。

设计阶段调优

- 根据业务增量需求，采取基于日期模板创建索引，通过 roll over API 滚动索引；
- 使用别名进行索引管理；
- 每天凌晨定时对索引做 force_merge 操作，以释放空间；
- 采取冷热分离机制，热数据存储到 SSD，提高检索效率；冷数据定期进行 shrink操作，以缩减存储；
- 采取 curator 进行索引的生命周期管理；
- 仅针对需要分词的字段，合理的设置分词器；
- Mapping 阶段充分结合各个字段的属性，是否需要检索、是否需要存储等。……..

写入调优

- 写入前副本数设置为 0；
- 写入前关闭 refresh_interval 设置为-1，禁用刷新机制；
- 写入过程中：采取 bulk 批量写入；
- 写入后恢复副本数和刷新间隔；
- 尽量使用自动生成的 id。

查询调优

- 禁用 wildcard；
- 禁用批量 terms（成百上千的场景）；
- 充分利用倒排索引机制，能 keyword 类型尽量 keyword；
- 数据量大时候，可以先基于时间敲定索引再检索；
- 设置合理的路由机制。

Elasticsearch 在部署时，对 Linux 的设置有哪些优化方法

- 关闭缓存 swap;
- 堆内存设置为：Min（节点内存/2, 32GB）;
- 设置最大文件句柄数；
- 线程池+队列大小根据业务需要做调整；
- 磁盘存储 raid 方式——存储有条件使用 RAID10，增加单节点性能以及避免单

6. lucence 内部结构是什么？

- 索引(Index)： 在Lucene中一个索引是放在一个文件夹中的。
- 段(Segment)： 一个索引可以包含多个段，段与段之间是独立的，添加新文档可以生成新的段，不同的段可以合并。
- segments.gen和segments_X是段的元数据文件，也即它们保存了段的属性信息。
- 文档(Document)： 文档是我们建索引的基本单位，不同的文档是保存在不同的段中的，一个段可以包含多篇文档。 新添加的文档是单独保存在一个新生成的段中，随着段的合并，不同的文档合并到同一个段中。
- 域(Field)： 一篇文档包含不同类型的信息，可以分开索引，比如标题，时间，正文，作者等，都可以保存在不同的域里。 不同域的索引方式可以不同，在真正解析域的存储的时候，我们会详细解读。
- 词(Term)： 词是索引的最小单位，是经过词法分析和语言处理后的字符串。

- Lucene 索引是由多个段组成，段本身是一个功能齐全的倒排索引。
- 段是不可变的，允许 Lucene 将新的文档增量地添加到索引中，而不用从头重建索引。
- 对于每一个搜索请求而言，索引中的所有段都会被搜索，并且每个段会消耗CPU 的时钟周、文件句柄和内存。这意味着段的数量越多，搜索性能会越低。
- 为了解决这个问题，Elasticsearch 会合并小段到一个较大的段，提交新的合并段到磁盘，并删除那些旧的小段。

7. Elasticsearch 是如何实现 Master 选举的？

- Elasticsearch 的选主是 ZenDiscovery 模块负责的，主要包含 Ping（节点之间通过这个 RPC 来发现彼此）和 Unicast（单播模块包含一个主机列表以控制哪些节点需要 ping 通）这两部分；
- 对所有可以成为 master 的节点（node.master: true）根据 nodeId 字典排序，每次选举每个节点都把自己所知道节点排一次序，然后选出第一个（第 0 位）节点，暂且认为它是 master 节点。
- 如果对某个节点的投票数达到一定的值（可以成为 master 节点数 n/2+1）并且该节点自己也选举自己，那这个节点就是 master。否则重新选举一直到满足上述条件。
- 补充：master 节点的职责主要包括集群、节点和索引的管理，不负责文档级别的管理；data 节点可以关闭 http 功能*。

8. Elasticsearch 中的节点（比如共 20 个），其中的 10 个

选了一个 master，另外 10 个选了另一个 master，怎么办？

- 当集群 master 候选数量不小于 3 个时，可以通过设置最少投票通过数量（discovery.zen.minimum_master_nodes）超过所有候选节点一半以上来解决脑裂问题；
- 当候选数量为两个时，只能修改为唯一的一个 master 候选，其他作为 data节点，避免脑裂问题。

9. 对于 GC 方面，在使用 Elasticsearch 时要注意什么？

- 倒排词典的索引需要常驻内存，无法 GC，需要监控 data node 上 segmentmemory 增长趋势。
- 各类缓存，field cache, filter cache, indexing cache, bulk queue 等等，要设置合理的大小，并且要应该根据最坏的情况来看 heap 是否够用，也就是各类缓存全部占满的时候，还有 heap 空间可以分配给其他任务吗？避免采用 clear cache等“自欺欺人”的方式来释放内存。
- 避免返回大量结果集的搜索与聚合。确实需要大量拉取数据的场景，可以采用scan & scroll api 来实现。
- cluster stats 驻留内存并无法水平扩展，超大规模集群可以考虑分拆成多个集群通过 tribe node 连接。
- 想知道 heap 够不够，必须结合实际应用场景，并对集群的 heap 使用情况做持续的监控。

10. Elasticsearch 对于大数据量（上亿量级）的聚合如何实现？

Elasticsearch 提供的首个近似聚合是 cardinality 度量。它提供一个字段的基数，即该字段的 distinct 或者 unique 值的数目。它是基于 HLL 算法的。HLL 会先对我们的输入作哈希运算，然后根据哈希运算的结果中的 bits 做概率估算从而得到基数。其特点是：可配置的精度，用来控制内存的使用（更精确 ＝ 更多内存）；小的数据集精度是非常高的；我们可以通过配置参数，来设置去重需要的固定内存使用量。无论数千还是数十亿的唯一值，内存使用量只与你配置的精确度相关。

11. 在并发情况下，Elasticsearch 如果保证读写一致？

- 可以通过版本号使用乐观并发控制，以确保新版本不会被旧版本覆盖，由应用层来处理具体的冲突；
- 另外对于写操作，一致性级别支持 quorum/one/all，默认为 quorum，即只有当大多数分片可用时才允许写操作。但即使大多数可用，也可能存在因为网络等原因导致写入副本失败，这样该副本被认为故障，分片将会在一个不同的节点上重建。
- 对于读操作，可以设置 replication 为 sync(默认)，这使得操作在主分片和副本分片都完成后才会返回；如果设置 replication 为 async 时，也可以通过设置搜索请求参数_preference 为 primary 来查询主分片，确保文档是最新版本。

12. 如何监控 Elasticsearch 集群状态？

Marvel 让你可以很简单的通过 Kibana 监控 Elasticsearch。你可以实时查看你的集群健康状态和性能，也可以分析过去的集群、索引和节点指标。

13. 是否了解字典树？

- 可以看到，trie 树每一层的节点数是 26^i 级别的。所以为了节省空间，我们还可以用动态链表，或者用数组来模拟动态。而空间的花费，不会超过单词数×单词长度。
- 实现：对每个结点开一个字母集大小的数组，每个结点挂一个链表，使用左儿子右兄弟表示法记录这棵树；
- 对于中文的字典树，每个节点的子节点用一个哈希表存储，这样就不用浪费太大的空间，而且查询速度上可以保留哈希的复杂度 O(1)。

14. 索引数据多了怎么办，如何调优，部署

- 动态索引层面：基于模板+时间+rolloverapi滚动创建索引，举例：设计阶段定义：blog索引的模板格式为：blog_index_时间戳的形式，每天递增数据。这样做的好处：不至于数据量激增导致单个索引数据量非常大，接近于上线2的32次幂-1，索引存储达到了TB+甚至更大。一旦单个索引很大，存储等各种风险也随之而来，所以要提前考虑+及早避免。
- 存储层面：冷热数据分离存储 ，热数据（比如最近3天或者一周的数据），其余为冷数据。对于冷数据不会再写入新数据，可以考虑定期force_merge加shrink压缩操作，节省存储空间和检索效率。
- 部署层面：一旦之前没有规划，这里就属于应急策略。结合ES自身的支持动态扩展的特点，动态新增机器的方式可以缓解集群压力，注意：如果之前主节点等规划合理 ，不需要重启集群也能完成动态新增的。

> 引用自不错的文章：https://blog.csdn.net/a745233700/article/details/115585342

15. DocValues的作用：

倒排索引也是有缺陷的，假如我们需要对数据做一些聚合操作，比如排序/分组时，lucene内部会遍历提取所有出现在文档集合的排序字段，然后再次构建一个最终的排好序的文档集合list，这个步骤的过程全部维持在内存中操作，而且如果排序数据量巨大的话，非常容易就造成solr内存溢出和性能缓慢。

DocValues 就是 es 在构建倒排索引的同时，构建了正排索引，保存了docId到各个字段值的映射，可以看作是以文档为维度，从而实现根据指定字段进行排序和聚合的功能。另外doc Values 保存在操作系统的磁盘中，当docValues大于节点的可用内存，ES可以从操作系统页缓存中加载或弹出，从而避免发生内存溢出的异常，docValues远小于节点的可用内存，操作系统自然将所有Doc Values存于内存中（堆外内存），有助于快速访问。

16. text 和 keyword类型的区别：

两个的区别主要分词的区别：keyword 类型是不会分词的，直接根据字符串内容建立倒排索引，keyword类型的字段只能通过精确值搜索到；Text 类型在存入 Elasticsearch 的时候，会先分词，然后根据分词后的内容建立倒排索引

17. query 和 filter 的区别？

- query：查询操作不仅仅会进行查询，还会计算分值，用于确定相关度；
- filter：查询操作仅判断是否满足查询条件，不会计算任何分值，也不会关心返回的排序问题，同时，filter 查询的结果可以被缓存，提高性能。

18. Elasticsearch对于大数据量（上亿量级）的聚合如何实现？

Elasticsearch 提供的首个近似聚合是cardinality 度量。它提供一个字段的基数，即该字段的distinct或者unique值的数目。它是基于HLL算法的。HLL 会先对我们的输入作哈希运算，然后根据哈希运算的结果中的 bits 做概率估算从而得到基数。其特点是：可配置的精度，用来控制内存的使用（更精确 ＝ 更多内存）；小的数据集精度是非常高的；我们可以通过配置参数，来设置去重需要的固定内存使用量。无论数千还是数十亿的唯一值，内存使用量只与你配置的精确度相关。

> 引用自：https://www.jianshu.com/p/642d5115724f

19. ES分配多少内存?VM参数如何优化?

生成大量长生命周期的对象，是给heap造成压力的主要原因，例如读取一大片数据在内存中进行排序，或者在heap内部建cache缓存大量数据。如果GC释放的空间有限，而应用层面持续大量申请新对象，GC频度就开始上升，同时会消耗掉很多CPU时间。

Lucene的倒排索引(Inverted Index)是先在内存里生成，然后定期以段文件(segment file)的形式刷到磁盘的。每个段实际就是一个完整的倒排索引，并且一旦写到磁盘上就不会做修改。 API层面的文档更新和删除实际上是增量写入的一种特殊文档，会保存在新的段里。不变的段文件易于被操作系统cache，热数据几乎等效于内存访问。

基于以上2个基本事实，我们不难理解，为何官方建议的heap size不要超过系统可用内存的一半。heap以外的内存并不会被浪费，操作系统会很开心的利用他们来cache被用读取过的段文件。

Heap分配多少合适？遵从官方建议就没错。 **不要超过系统可用内存的一半，并且不要超过32GB**。JVM参数呢？对于初级用户来说，并不需要做特别调整，仍然遵从官方的建议，将xms和xmx设置成和heap一样大小，避免动态分配heap size就好了。虽然有针对性的调整JVM参数可以带来些许GC效率的提升，当有一些“坏”用例的时候，这些调整并不会有什么魔法效果帮你减轻heap压力，甚至可能让问题更糟糕。

20. ES的heap被什么占用?

Segment不是file吗？segment memory又是什么？前面提到过，一个segment是一个完备的lucene倒排索引，而倒排索引是通过词典 (Term Dictionary)到文档列表(Postings List)的映射关系，快速做查询的。 由于词典的size会很大，全部装载到heap里不现实，因此Lucene为词典做了一层前缀索引(Term Index)，这个索引在Lucene4.0以后采用的数据结构是FST (Finite State Transducer)。 这种数据结构占用空间很小，Lucene打开索引的时候将其全量装载到内存中，加快磁盘上词典查询速度的同时减少随机磁盘访问次数。

说白了,ES的data node存储数据并非只是耗费磁盘空间的，为了加速数据的访问，每个segment都有会一些索引数据驻留在heap里。因此segment越多，瓜分掉的heap也越多，并且这部分heap是无法被GC掉的！ 理解这点对于监控和管理集群容量很重要，当一个node的segment memory占用过多的时候，就需要考虑删除、归档数据，或者扩容了。

剩下的看：https://www.jianshu.com/p/642d5115724f

21. 查询性能

查询性能中routing非常重要。分合: 在实践过程中,索引越来越大,那么单个shard分片也越来越大,查询速度也越来越慢.是选择分索引还是分shards?实验中更多的shards会带来额外的IO压力.Elastic 官方文档建议：一个 Node 最好不要多于三个 shards。

22. ElasticSearch主分片数量可以在后期更改吗？为什么？

不可以，因为根据路由算法shard = hash(document_id) % (num_of_primary_shards)，当主分片数量变化时会影响数据被路由到哪个分片上。

> 引用自：https://zhuanlan.zhihu.com/p/139762008

23. ElasticSearch中的分片是什么?

在大多数环境中，每个节点都在单独的盒子或虚拟机上运行；索引 - 在Elasticsearch中，索引是文档的集合；分片 -因为Elasticsearch是一个分布式搜索引擎，所以索引通常被分割成分布在多个节点上的被称为分片的元素。

ElasticSearch中的副本是什么？一个索引被分解成碎片以便于分发和扩展。副本是分片的副本。一个节点是一个属于一个集群的ElasticSearch的运行实例。一个集群由一个或多个共享相同集群名称的节点组成。

什么是ElasticSearch中的编译器？编译器用于将字符串分解为术语或标记流。一个简单的编译器可能会将字符串拆分为任何遇到空格或标点的地方。Elasticsearch有许多内置标记器，可用于构建自定义分析器。


24. 其他也不错的文章

https://jishuin.proginn.com/p/763bfbd31fed