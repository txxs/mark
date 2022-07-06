(window.webpackJsonp=window.webpackJsonp||[]).push([[131],{508:function(t,n,v){"use strict";v.r(n);var _=v(13),p=Object(_.a)({},(function(){var t=this,n=t.$createElement,v=t._self._c||n;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("p",[t._v("原文地址：")]),t._v(" "),v("p",[t._v("https://zhuanlan.zhihu.com/p/37738632")]),t._v(" "),v("p",[t._v("整体就是：\n公钥加密，公钥所有的节点都会获取，私钥解密，私钥只有自己有")]),t._v(" "),v("p",[t._v("非对称加密思想描绘了这样的美好场景：你的手上有两个密钥（一对密钥），它们有一定的关联，但没有办法通过其中一个算出另外一个。你把一个密钥紧紧地攥在手里，永远不向别人公布（私钥）；把另外一个发送给我，当然，发送给我的途中，所有的设备都知道了这个密钥（公钥）。之后我用公钥加密了数据，并发送给你，你却可以奇迹般地用私钥解密它。更神奇的是，中间所有的设备，居然都不能用公钥解开它！")]),t._v(" "),v("p",[t._v("总的来说，握手过程中，服务器会发出一张证书（带着公钥），客户端用公钥加密了一段较短的数据S，并返回给服务器。服务器用私钥解开，拿到S。此时，握手步骤完成，S成为了一个被安全传输到对方手中的对称加密密钥。此后，服务器与我的请求响应，只需要用S作为密钥进行一次对称的加密就好。")]),t._v(" "),v("p",[t._v("那证书的安全性怎么保证？为什么中间人不能做一个假证书？")]),t._v(" "),v("p",[t._v("因为这套证书体系已经根植于每一个操作系统里了。每一个操作系统里，都内置了数十张根证书，每个根证书都对应一个非常权威的证书签发机构。这些根证书上记录了各个机构的公钥。")]),t._v(" "),v("p",[t._v("当网站找证书机构购买了一份合法的证书时，网站申请的证书上的公钥、域名、有效期等信息会被计算一次hash，然后证书机构用它的私钥给这个hash加密一次。这个加密结果就是证书的签名。")]),t._v(" "),v("p",[t._v("当网站的合法HTTPS证书到达你的电脑上，这个证书上带有签发机构的信息（具体来说应该是一条证书链），你的浏览器会用这个签发机构对应的操作系统内置根证书上的公钥，去解开网站HTTPS证书的签名（还记得吗，由于运算结果有周期性，所以用私钥加密的信息可以用公钥解开）。发现签名解开的hash与证书信息内容的hash一致，就可以证明证书是合法的了。")])])}),[],!1,null,null,null);n.default=p.exports}}]);