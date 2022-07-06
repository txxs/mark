(window.webpackJsonp=window.webpackJsonp||[]).push([[49],{425:function(t,e,_){"use strict";_.r(e);var i=_(13),v=Object(i.a)({},(function(){var t=this,e=t.$createElement,_=t._self._c||e;return _("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[_("p",[t._v("来源：\nhttps://blog.csdn.net/guyue35/article/details/84875476\nhttp://xjin.wang/2018/08/12/%E6%B0%B4%E5%B9%B3%E5%88%86%E5%BA%93%E7%9A%84%E5%88%86%E9%A1%B5%E6%96%B9%E6%A1%88%E6%80%9D%E8%80%83/\nhttps://segmentfault.com/q/1010000000203643")]),t._v(" "),_("h4",{attrs:{id:"全局视野法"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#全局视野法"}},[t._v("#")]),t._v(" 全局视野法")]),t._v(" "),_("p",[t._v("每个库都返回3页数据，所得到的6页数据在服务层进行内存排序，得到数据全局视野，再取第3页数据，便能够得到想要的全局分页数据。\n再总结一下这个方案的步骤：")]),t._v(" "),_("p",[t._v("（1）将order by time offset X limit Y，改写成order by time offset 0 limit X+Y")]),t._v(" "),_("p",[t._v("（2）服务层将改写后的SQL语句发往各个分库：即例子中的各取3页数据")]),t._v(" "),_("p",[t._v("（3）假设共分为N个库，服务层将得到N*(X+Y)条数据：即例子中的6页数据")]),t._v(" "),_("p",[t._v("（4）服务层对得到的N*(X+Y)条数据进行内存排序，内存排序后再取偏移量X后的Y条记录，就是全局视野所需的一页数据")]),t._v(" "),_("p",[t._v("方案优点：通过服务层修改SQL语句，扩大数据召回量，能够得到全局视野，业务无损，精准返回所需数据。")]),t._v(" "),_("p",[t._v("方案缺点（显而易见）：")]),t._v(" "),_("p",[t._v("（1）每个分库需要返回更多的数据，增大了网络传输量（耗网络）；")]),t._v(" "),_("p",[t._v("（2）除了数据库按照time进行排序，服务层还需要进行二次排序，增大了服务层的计算量（耗CPU）；")]),t._v(" "),_("p",[t._v("（3）最致命的，这个算法随着页码的增大，性能会急剧下降，这是因为SQL改写后每个分库要返回X+Y行数据：返回第3页，offset中的X=200；假如要返回第100页，offset中的X=9900，即每个分库要返回100页数据，数据量和排序量都将大增，性能平方级下降。")]),t._v(" "),_("h4",{attrs:{id:"业务折衷-不指定页查询"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#业务折衷-不指定页查询"}},[t._v("#")]),t._v(" 业务折衷-不指定页查询")]),t._v(" "),_("p",[t._v("步骤")]),t._v(" "),_("p",[t._v("（1）对于每个分表的查询语句为，初始时min变量为0，因为价格都大于0\nSELECT * FROM product ORDER BY price where price > $min limit 10;\n（2）三个表一共取出30条数据，在内存中进行归并排序，再取出结果中的前10条，完成第一页查询。记录结果中的最后一条，作为下一页查询的初始锚点，即变量min。")]),t._v(" "),_("p",[t._v("（3）下滑刷新，即获取下一页数据时，把min代入，继续执行第一步中的SQL，同样只接受30条数据，就完成了第二页的查询，之后无论多少“下一页”都是固定的数据量：分表数*单页数据量")]),t._v(" "),_("p",[t._v("优点：查询性能有保证，不会根据分表数和页数的增加而大量占用带宽。")]),t._v(" "),_("p",[t._v("缺点：需要业务折衷，商品、信息流适用，管理系统不一定适用。")]),t._v(" "),_("h4",{attrs:{id:"二次查询法"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#二次查询法"}},[t._v("#")]),t._v(" 二次查询法")]),t._v(" "),_("p",[t._v("（1）将order by time offset X limit Y，改写成order by time offset X/N limit Y")]),t._v(" "),_("p",[t._v("（2）找到最小值time_min")]),t._v(" "),_("p",[t._v("（3）between二次查询，order by time between $time_min and $time_i_max")]),t._v(" "),_("p",[t._v("（4）设置虚拟time_min，找到time_min在各个分库的offset，从而得到time_min在全局的offset")]),t._v(" "),_("p",[t._v("（5）得到了time_min在全局的offset，自然得到了全局的offset X limit Y")]),t._v(" "),_("h4",{attrs:{id:"或者使用es"}},[_("a",{staticClass:"header-anchor",attrs:{href:"#或者使用es"}},[t._v("#")]),t._v(" 或者使用es")])])}),[],!1,null,null,null);e.default=v.exports}}]);