(window.webpackJsonp=window.webpackJsonp||[]).push([[101],{483:function(_,v,t){"use strict";t.r(v);var a=t(13),r=Object(a.a)({},(function(){var _=this,v=_.$createElement,t=_._self._c||v;return t("ContentSlotsDistributor",{attrs:{"slot-key":_.$parent.slotKey}},[t("p",[_._v("原文地址：")]),_._v(" "),t("p",[_._v("https://segmentfault.com/a/1190000004474543")]),_._v(" "),t("p",[_._v("http://anruence.com/2018/03/05/tcc-2pc-3pc/")]),_._v(" "),t("p",[_._v("https://www.cnblogs.com/qdhxhz/p/11172585.html")]),_._v(" "),t("h3",{attrs:{id:"_2pc-阻塞、数据不一致问题、单点问题"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2pc-阻塞、数据不一致问题、单点问题"}},[_._v("#")]),_._v(" 2PC（阻塞、数据不一致问题、单点问题）")]),_._v(" "),t("p",[_._v("2PC协议用于保证属于多个数据分片上的操作的原子性。这些数据分片可能分布在不同的服务器上，2PC协议保证多台服务器上的操作要么全部成功，要么全部失败。在数据一致性中，它的含义是：要么所有副本（备份数据）同时修改某个数值，要么都不更改，以此来保证数据的强一致性。")]),_._v(" "),t("p",[_._v("2PC要解决的问题可以简单总结为：在分布式系统中，每个节点虽然可以知道自己的操作是成功还是失败，却是无法知道其他节点的操作状态。当一个事务需要跨越多个节点时，为了保持事务的 ACID 特性，需要引入一个作为"),t("strong",[_._v("协调者")]),_._v("的组件来统一掌控所有节点（参与者）的操作结果并最终指示这些节点是否要把操作结果进行真正的提交（比如将更新后的数据写入磁盘等等）。因此，二阶段提交的算法思路可以概括为： "),t("strong",[_._v("参与者将操作结果通知协调者，再由协调者根据所有参与者的反馈情报决定各参与者是否要提交操作还是中止操作")]),_._v("。")]),_._v(" "),t("h4",{attrs:{id:"_1、阶段一-提交事务请求-投票阶段"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1、阶段一-提交事务请求-投票阶段"}},[_._v("#")]),_._v(" 1、阶段一：提交事务请求（投票阶段）")]),_._v(" "),t("p",[_._v("（1）事务询问:协调者向所有的参与者发送事务内容，询问是否可以执行事务提交操作，并开始等待各参与者的响应")]),_._v(" "),t("p",[_._v("（2）执行事务:各参与者节点执行事务操作，并将Undo和Redo信息计入事务日志中")]),_._v(" "),t("p",[_._v("（3）各参与者向协调者反馈事务询问的响应:如果参与者成功执行了事务操作，那么就反馈给协调者Yes响应，表示事务可以执行；如果参与者没有成功执行事务，那么就反馈给协调者No响应，表示事务不可以执行。")]),_._v(" "),t("h4",{attrs:{id:"_2、阶段二-执行事务提交-执行阶段"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2、阶段二-执行事务提交-执行阶段"}},[_._v("#")]),_._v(" 2、阶段二：执行事务提交（执行阶段）")]),_._v(" "),t("p",[_._v("（1）执行事务提交:如果所有参与者的反馈都是Yes响应，那么")]),_._v(" "),t("p",[_._v("A、发送提交请求:协调者向所有参与者节点发出Commit请求")]),_._v(" "),t("p",[_._v("B、事务提交:参与者接收到Commit请求后，会正式执行事务提交操作，并在完成提交之后释放在整个事务执行期间占用的事务资源")]),_._v(" "),t("p",[_._v("C、反馈事务提交结果:参与者在完成事务提交之后，向协调者发送ACK信息")]),_._v(" "),t("p",[_._v("D、完成事务:协调者接收到所有参与者反馈的ACK消息后，完成事务")]),_._v(" "),t("p",[_._v("（2）中断事务:任何一个参与者反馈了No响应，或者在等待超时之后，协调者尚无法接收到所有参与者的反馈响应，那么就会中断事务。")]),_._v(" "),t("p",[_._v("A、发送回滚请求:协调者向所有参与者节点发出Rollback请求")]),_._v(" "),t("p",[_._v("B、事务回滚:参与者接收到rollback请求后，会利用其在阶段一中记录的Undo信息来执行事务回滚操作，并在完成回滚之后释放整个事务执行期间占用的资源")]),_._v(" "),t("p",[_._v("C、反馈事务回滚结果:参与者在完成事务回滚之后，向协调者发送ACK信息")]),_._v(" "),t("p",[_._v("D、中断事务:协调者接收到所有参与者反馈的ACK信息后，完成事务中断")]),_._v(" "),t("h4",{attrs:{id:"优缺点"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#优缺点"}},[_._v("#")]),_._v(" 优缺点")]),_._v(" "),t("p",[_._v("优点：原理简单、实现方便")]),_._v(" "),t("p",[_._v("缺点：同步阻塞、单点问题、数据不一致、太过保守")]),_._v(" "),t("p",[_._v("（1）同步阻塞:同步阻塞会极大地限制分布式系统的性能。在二阶段提交的执行过程中，所有参与该事务操作的逻辑都处于阻塞状态，各个参与者在等待其他参与者响应的过程中，将无法进行其他任何操作。")]),_._v(" "),t("p",[_._v("（2）单点问题:一旦协调者出现问题（协调者是单点），那么整个二阶段提交流程将无法运转，更为严重的是，如果是在阶段二中出现问题，那么其他参与者将会一直处于锁定事务资源的状态中，无法继续完成事务操作。")]),_._v(" "),t("p",[_._v("（3）数据不一致:在阶段二，当协调者向所有参与者发送commit请求之后，发生了局部网络异常或协调者在尚未发完commit请求之前自身发生了崩溃，导致最终只有部分参与者接收到了commit请求，于是这部分参与者执行事务提交，而没收到commit请求的参与者则无法进行事务提交，于是整个分布式系统出现了数据不一致性现象。")]),_._v(" "),t("p",[_._v("（4）太过保守:如果参与者在与协调者通信期间出现故障，协调者只能靠超时机制来判断是否需要中断事务，这个策略比较保守，需要更为完善的容错机制，任意一个节点的失败都会导致整个事务的失败。")]),_._v(" "),t("h3",{attrs:{id:"_3pc-解决2pc的阻塞-但还是可能造成数据不一致"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3pc-解决2pc的阻塞-但还是可能造成数据不一致"}},[_._v("#")]),_._v(" 3PC（解决2PC的阻塞，但还是可能造成数据不一致）")]),_._v(" "),t("p",[_._v("为了避免在通知所有参与者提交事务时，其中一个参与者crash不一致时，就出现了三阶段提交的方式。三阶段提交在两阶段提交的基础上增加了一个preCommit的过程，当所有参与者收到preCommit后，并不执行动作，直到收到commit或超过一定时间后才完成操作。")]),_._v(" "),t("h4",{attrs:{id:"_1、阶段一cancommit"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1、阶段一cancommit"}},[_._v("#")]),_._v(" 1、阶段一CanCommit")]),_._v(" "),t("p",[_._v("（1）事务询问:协调者向各参与者发送CanCommit的请求，询问是否可以执行事务提交操作，并开始等待各参与者的响应")]),_._v(" "),t("p",[_._v("（2）参与者向协调者反馈询问的响应:参与者收到CanCommit请求后，正常情况下，如果自身认为可以顺利执行事务，那么会反馈Yes响应，并进入预备状态，否则反馈No。")]),_._v(" "),t("h4",{attrs:{id:"_2、阶段二precommit"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2、阶段二precommit"}},[_._v("#")]),_._v(" 2、阶段二PreCommit")]),_._v(" "),t("p",[_._v("（1）执行事务预提交:如果协调者接收到各参与者反馈都是Yes，那么执行事务预提交")]),_._v(" "),t("p",[_._v("A、发送预提交请求:协调者向各参与者发送preCommit请求，并进入prepared阶段")]),_._v(" "),t("p",[_._v("B、事务预提交:参与者接收到preCommit请求后，会执行事务操作，并将Undo和Redo信息记录到事务日记中")]),_._v(" "),t("p",[_._v("C、各参与者向协调者反馈事务执行的响应:如果各参与者都成功执行了事务操作，那么反馈给协调者Ack响应，同时等待最终指令，提交commit或者终止abort（就是这里会有问题）")]),_._v(" "),t("p",[_._v("（2）中断事务:如果任何一个参与者向协调者反馈了No响应，或者在等待超时后，协调者无法接收到所有参与者的反馈，那么就会中断事务。")]),_._v(" "),t("p",[_._v("A、发送中断请求:协调者向所有参与者发送abort请求")]),_._v(" "),t("p",[_._v("B、中断事务:无论是收到来自协调者的abort请求，还是等待超时，参与者都中断事务")]),_._v(" "),t("h4",{attrs:{id:"_3、阶段三docommit"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3、阶段三docommit"}},[_._v("#")]),_._v(" 3、阶段三doCommit")]),_._v(" "),t("p",[_._v("（1）执行提交")]),_._v(" "),t("p",[_._v("A、发送提交请求:假设协调者正常工作，接收到了所有参与者的ack响应，那么它将从预提交阶段进入提交状态，并向所有参与者发送doCommit请求")]),_._v(" "),t("p",[_._v("B、事务提交:参与者收到doCommit请求后，正式提交事务，并在完成事务提交后释放占用的资源")]),_._v(" "),t("p",[_._v("C、反馈事务提交结果:参与者完成事务提交后，向协调者发送ACK信息")]),_._v(" "),t("p",[_._v("D、完成事务:协调者接收到所有参与者ack信息，完成事务")]),_._v(" "),t("p",[_._v("（2）中断事务:假设协调者正常工作，并且有任一参与者反馈No，或者在等待超时后无法接收所有参与者的反馈，都会中断事务")]),_._v(" "),t("p",[_._v("A、发送中断请求:协调者向所有参与者节点发送abort请求")]),_._v(" "),t("p",[_._v("B、事务回滚:参与者接收到abort请求后，利用undo日志执行事务回滚，并在完成事务回滚后释放占用的资源")]),_._v(" "),t("p",[_._v("C、反馈事务回滚结果:参与者在完成事务回滚之后，向协调者发送ack信息")]),_._v(" "),t("p",[_._v("D、中断事务:协调者接收到所有参与者反馈的ack信息后，中断事务。")]),_._v(" "),t("h4",{attrs:{id:"阶段三可能出现的问题"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#阶段三可能出现的问题"}},[_._v("#")]),_._v(" 阶段三可能出现的问题：")]),_._v(" "),t("p",[_._v("协调者出现问题、协调者与参与者之间网络出现故障。不论出现哪种情况，最终都会导致参与者无法及时接收到来自协调者的doCommit或是abort请求，针对这种情况，参与者都会在等待超时后，继续进行事务提交（timeout后中断事务）。")]),_._v(" "),t("h4",{attrs:{id:"优缺点-2"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#优缺点-2"}},[_._v("#")]),_._v(" 优缺点：")]),_._v(" "),t("p",[_._v("优点：降低参与者阻塞范围，并能够在出现单点故障后继续达成一致")]),_._v(" "),t("p",[_._v("缺点：引入preCommit阶段，在这个阶段如果出现网络分区，协调者无法与参与者正常通信，参与者依然会进行事务提交，造成数据不一致。")]),_._v(" "),t("h3",{attrs:{id:"_2pc和3pc对比"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2pc和3pc对比"}},[_._v("#")]),_._v(" 2pc和3pc对比")]),_._v(" "),t("p",[_._v("相对于2PC，3PC主要解决的单点故障问题，并减少阻塞，因为一旦参与者无法及时收到来自协调者的信息之后，他会默认执行commit。而不会一直持有事务资源并处于阻塞状态。但是这种机制也会导致数据一致性问题，因为，由于网络原因，协调者发送的abort响应没有及时被参与者接收到，那么参与者在等待超时之后执行了commit操作。这样就和其他接到abort命令并执行回滚的参与者之间存在数据不一致的情况。")]),_._v(" "),t("h3",{attrs:{id:"tcc"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#tcc"}},[_._v("#")]),_._v(" TCC")]),_._v(" "),t("p",[_._v("为了解决在事务运行过程中大颗粒度资源锁定的问题，业界提出一种新的事务模型，它是基于业务层面的事务定义。锁粒度完全由业务自己控制。它本质是一种补偿的思路。它把事务运行过程分成 Try、Confirm / Cancel 两个阶段。在每个阶段的逻辑由业务代码控制。这样就事务的锁粒度可以完全自由控制。业务可以在牺牲隔离性的情况下，获取更高的性能。")]),_._v(" "),t("p",[_._v("在TCC协议里，参与的主体分为两种：")]),_._v(" "),t("p",[_._v("发起方：发起事务的应用。")]),_._v(" "),t("p",[_._v("参与方：执行事务请求，手上握有资源的服务。")]),_._v(" "),t("p",[_._v("并且有三种动作：Try、Confirm、Cancel。")]),_._v(" "),t("p",[_._v("TCC是Try、Confirm、Cancel的简称，它们分别的职责是：")]),_._v(" "),t("p",[_._v("Try：负责预留资源（比如新建一条状态=PENDING的订单），同时也做业务检查（比如看看余额是否足够），简单来说就是不能预留已经被占用的资源。")]),_._v(" "),t("p",[_._v("Confirm：负责落地所预留的资源（比如扣费、把订单状态变成COMPLETED）")]),_._v(" "),t("p",[_._v("Cancel：负责撤销所预留的资源（比如把订单状态变成CANCELED）")]),_._v(" "),t("p",[t("strong",[_._v("TCC将2PC数据库层面的动作提升到了服务层面，不同的是TCC的所有动作都是一个本地事务，每个本地事务都在动作完成后commit到数据库：")])]),_._v(" "),t("p",[_._v("Try相当于2PC的Commit request phase，外加了业务检查逻辑")]),_._v(" "),t("p",[_._v("Confirm相当于2PC的Commit phase的commit动作")]),_._v(" "),t("p",[_._v("Cancel相当于2PC的Commit phase的rollback动作")]),_._v(" "),t("h4",{attrs:{id:"tcc流程"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#tcc流程"}},[_._v("#")]),_._v(" TCC流程")]),_._v(" "),t("p",[_._v("1、【发起方】发送Try到所有参与方")]),_._v(" "),t("p",[_._v("2、每个【参与方】执行Try，预留资源")]),_._v(" "),t("p",[_._v("3、【发起方】收到所有【参与方】的Try结果")]),_._v(" "),t("p",[_._v("4、【发起方】发送Confirm/Cancel到所有参与房")]),_._v(" "),t("p",[_._v("5、每个【参与方】执行Confirm/Cancel")]),_._v(" "),t("p",[_._v("6、【发起方】收到所有【参与方】的Confirm/Cancel结果")]),_._v(" "),t("h4",{attrs:{id:"异常处理"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#异常处理"}},[_._v("#")]),_._v(" 异常处理")]),_._v(" "),t("p",[_._v("从【发起方】的角度来看出现异常要怎么处理：")]),_._v(" "),t("p",[_._v("step 1发生异常，【发起方】可以什么都不做等待【参与方】自行Cancel，也可以直接发起Cancel请求")]),_._v(" "),t("p",[_._v("step 2、3发生异常，意味着【发起方】没有收到【参与方】的响应，这个时候因认定为失败，执行Cancel")]),_._v(" "),t("p",[_._v("step 4发生异常，【发起方】重试Confirm/Cancel")]),_._v(" "),t("p",[_._v("step 5、6发生异常，意味着【发起方】没有收到【参与方】的响应，这个时候因认定为失败，重试Confirm/Cancel")]),_._v(" "),t("p",[_._v("从【参与方】角度来看看看出现异常怎么处理：")]),_._v(" "),t("p",[_._v("step 1，意味着【参与方】没有收到请求，什么都不需要做")]),_._v(" "),t("p",[_._v("step 2，意味着【参与方】没有执行成功，什么都不需要做")]),_._v(" "),t("p",[_._v("step 3，意味着【发起方】没有收到结果，什么都不需要做，等待【发起方】重试即可。【参与方】要保证prepare是幂等的。")]),_._v(" "),t("p",[_._v("step 4，等待【发起方】重试，或者等待timeout后自行Cancel。")]),_._v(" "),t("p",[_._v("step 5，等待【发起方】重试即可")]),_._v(" "),t("p",[_._v("step 6，意味着【发起方】没有收到结果，什么都不需要做，等待【发起方】重试即可，【参与方】要保证Confirm/Cancel是幂等的。")]),_._v(" "),t("p",[_._v("观察一下你就会发现TCC和2PC存在一样的问题：")]),_._v(" "),t("p",[_._v("若【发起方】/【参与方】因崩溃遗失了信息，则会造成有的【参与方】已Confirm，有的【参与方】则被Cancel了，甚至于依然保持在预留状态。")]),_._v(" "),t("p",[_._v("若【发起方】在step 4发送Confirm，而【参与方】在Cancel（因timeout导致）。")]),_._v(" "),t("p",[t("strong",[_._v("不过TCC在处理这种情况相比2PC具有一些优势，因为TCC是在服务层面的，当出现这种问题的时候可以很容易通过日志、业务数据排查出来，然后人工介入，而2PC完全是数据库底层的。")])]),_._v(" "),t("h4",{attrs:{id:"实现tcc时的注意事项"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#实现tcc时的注意事项"}},[_._v("#")]),_._v(" 实现TCC时的注意事项")]),_._v(" "),t("p",[_._v("TCC模式在于服务层面而非数据库层面")]),_._v(" "),t("p",[_._v("TCC模式依赖于各服务正确实现Try、Confirm、Cancel和timeout处理机制")]),_._v(" "),t("p",[_._v("TCC模式最少通信次数为2n（n=服务数量）")]),_._v(" "),t("p",[_._v("不是所有业务模型都适合使用TCC，比如发邮件业务根本就不需要预留资源")]),_._v(" "),t("p",[_._v("需要良好地设计服务的日志、人工处理流程/机制，便于异常情况的处理")]),_._v(" "),t("h4",{attrs:{id:"例子"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#例子"}},[_._v("#")]),_._v(" 例子")]),_._v(" "),t("p",[_._v("例子：A服务转30块钱、B服务转50块钱，一起到C服务上。")]),_._v(" "),t("p",[_._v("Try：尝试执行业务。完成所有业务检查(一致性)：检查A、B、C的帐户状态是否正常，帐户A的余额是否不少于30元，帐户B的余额是否不少于50元。预留必须业务资源(准隔离性)：帐户A的冻结金额增加30元，帐户B的冻结金额增加50元，这样就保证不会出现其他并发进程扣减了这两个帐户的余额而导致在后续的真正转帐操作过程中，帐户A和B的可用余额不够的情况。")]),_._v(" "),t("p",[_._v("Confirm：确认执行业务。真正执行业务：如果Try阶段帐户A、B、C状态正常，且帐户A、B余额够用，则执行帐户A给账户C转账30元、帐户B给账户C转账50元的转帐操作。这时已经不需要做任何业务检查，Try阶段已经完成了业务检查。只使用Try阶段预留的业务资源：只需要使用Try阶段帐户A和帐户B冻结的金额即可。")]),_._v(" "),t("p",[_._v("Cancel：取消执行业务释放Try阶段预留的业务资源：如果Try阶段部分成功，比如帐户A的余额够用，且冻结相应金额成功，帐户B的余额不够而冻结失败，则需要对帐户A做Cancel操作，将帐户A被冻结的金额解冻掉。")]),_._v(" "),t("h3",{attrs:{id:"_2pc和tcc区别"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2pc和tcc区别"}},[_._v("#")]),_._v(" 2pc和TCC区别")]),_._v(" "),t("p",[_._v("TCC 实质上是应用层的2PC()，好比把 XA 两阶段提交那种在数据资源层做的事务管理工作提到了数据应用层。")]),_._v(" "),t("p",[_._v("2PC是资源层面的分布式事务，是强一致性，在两阶段提交的整个过程中，"),t("em",[_._v("一直会持有资源的锁")]),_._v("。")]),_._v(" "),t("p",[_._v("TCC是业务层面的分布式事务，最终一致性，"),t("em",[_._v("不会一直持有资源的锁")]),_._v("。")]),_._v(" "),t("p",[_._v("TCC相比较于2PC来讲性能会好很多，但是因为同时需要改造try、confirm、canel3个接口，开发成本高。")])])}),[],!1,null,null,null);v.default=r.exports}}]);