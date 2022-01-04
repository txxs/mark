module.exports = () => {
    return [
        {
            title: "工程算法",
            collapsable: false,
            children: [
                'explain.md',
                'InnoDB什么时候用行锁和表锁.md',
                'innodb行锁实现方式.md',
                'MyISAM和InnoDB区别.md',
                'MySQL中的重做日redolog和undolog以及binlog.md',
                'MySQL主从同步延时问题.md',
                'MYSQL主从复制.md',
                'MYSQL事务和隔离级别.md',
                'mysql同步的三种方式.md',
                'Mysql新知识20200818.md',
                '一条SQL语句执行得很慢的原因有哪些.md',
                '为什么要分库分表.md',
                '乐观锁和悲观锁.md',
                '什么是MVCC.md',
                '分布式事务以及单个事务执行过程.md',
                '分库分表中间件对比和原理.md',
                '分库分表之后id主键如何处理.md',
                '分库分表的分页查询.md',
                '大表优化.md',
                '如何设计可以动态扩容缩容的分库分表方案.md',
                '引擎区别.md',
                '数据库引擎情况.md',
                '数据的基本知识.md',
                '新的数据存储相关基本知识',
                '最终一致性其实比MVCC简单.md',
                '海量数据limit慢.md',
                '索引.md',
                '自己或公司实现分库分表中间件.md',
                '锁机制与InnoDB锁算法.md'
            ]
        }
    ]
}