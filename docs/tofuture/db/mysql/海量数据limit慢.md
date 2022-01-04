### 1、海量数据查询

原文地址：https://blog.csdn.net/zzp448561636/article/details/68952861

朋友提出一个sql语句优化的问题，limit N,M，在N数值较大，N很小的时候，例如limit 100000， 20的情况下，MySQL的性能很低。
然后上网搜索了一下相关的解决思路，怕自己忘记，在这里记录一下

mysql的性能低是因为数据库要去扫描N+M条记录，然后又要放弃之前N条记录，开销很大
解决思略：
1、前端加缓存，或者其他方式，减少落到库的查询操作，例如某些系统中数据在搜索引擎中有备份的，可以用es等进行搜索
2、使用延迟关联，即先通用limit得到需要数据的索引字段，然后再通过原表和索引字段关联获得需要数据

select a.* from a,(select id from table_1 where is_deleted='N' limit 100000,20) b where a.id = b.id
1
3、从业务上实现，不分页如此多，例如只能分页前100页，后面的不允许再查了
4、不使用limit N,M,而是使用limit N，即将offset转化为where条件。

select id,namefrom tableName limit5000000,10;
select id,namefrom tableNamewhere id>5000000 limit 10;
1
2
但是这种有有一点问题，就是有些数据会做删除，不管是逻辑删除还是物理删除，有时候筛选会去掉这种删除字段，这个时候光自增长的id是不能准确定位的，这个时候可以传入一个参数，即上次查询结果的最后一个数据的id，然后往前往后追溯

select id,name from tableName where id>16838 and is_deleted='N' limit 10;

慢的原因，可以按照一下解释：

如 * from table limit 0,10 这个没有问题 当 limit 200000,10 的时候数据读取就很慢。

limit10000,20的意思扫描满足条件的10020行，扔掉前面的10000行，返回最后的20行，问题就在这里。

LIMIT 451350,30 扫描了45万多行，怪不得慢的都堵死了。

但是limit 30 这样的语句仅仅扫描30行。


换成大于就OK了
