(window.webpackJsonp=window.webpackJsonp||[]).push([[126],{502:function(t,_,v){"use strict";v.r(_);var r=v(13),e=Object(r.a)({},(function(){var t=this,_=t.$createElement,v=t._self._c||_;return v("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[v("p",[t._v("服务器返回的 "),v("strong",[t._v("响应报文")]),t._v(" 中第一行为状态行，包含了状态码以及原因短语，用来告知客户端请求的结果。")]),t._v(" "),v("table",[v("thead",[v("tr",[v("th",[t._v("状态码")]),t._v(" "),v("th",[t._v("类别")]),t._v(" "),v("th",[t._v("原因短语")])])]),t._v(" "),v("tbody",[v("tr",[v("td",[t._v("1XX")]),t._v(" "),v("td",[t._v("Informational（信息性状态码）")]),t._v(" "),v("td",[t._v("接收的请求正在处理")])]),t._v(" "),v("tr",[v("td",[t._v("2XX")]),t._v(" "),v("td",[t._v("Success（成功状态码）")]),t._v(" "),v("td",[t._v("请求正常处理完毕")])]),t._v(" "),v("tr",[v("td",[t._v("3XX")]),t._v(" "),v("td",[t._v("Redirection（重定向状态码）")]),t._v(" "),v("td",[t._v("需要进行附加操作以完成请求")])]),t._v(" "),v("tr",[v("td",[t._v("4XX")]),t._v(" "),v("td",[t._v("Client Error（客户端错误状态码）")]),t._v(" "),v("td",[t._v("服务器无法处理请求")])]),t._v(" "),v("tr",[v("td",[t._v("5XX")]),t._v(" "),v("td",[t._v("Server Error（服务器错误状态码）")]),t._v(" "),v("td",[t._v("服务器处理请求出错")])])])]),t._v(" "),v("h3",{attrs:{id:"_1-1xx-信息"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_1-1xx-信息"}},[t._v("#")]),t._v(" （1）1XX 信息")]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("100 Continue")]),t._v(" ：表明到目前为止都很正常，客户端可以继续发送请求或者忽略这个响应。")])]),t._v(" "),v("h3",{attrs:{id:"_2-2xx-成功"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_2-2xx-成功"}},[t._v("#")]),t._v(" （2）2XX 成功")]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("200 OK")])]),t._v(" "),v("li",[v("strong",[t._v("204 No Content")]),t._v(" ：请求已经成功处理，但是返回的响应报文不包含实体的主体部分。一般在只需要从客户端往服务器发送信息，而不需要返回数据时使用。")]),t._v(" "),v("li",[v("strong",[t._v("206 Partial Content")]),t._v(" ：表示客户端进行了范围请求。响应报文包含由 Content-Range 指定范围的实体内容。")])]),t._v(" "),v("h3",{attrs:{id:"_3-3xx-重定向"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_3-3xx-重定向"}},[t._v("#")]),t._v(" （3）3XX 重定向")]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("301 Moved Permanently")]),t._v(" ：永久性重定向")]),t._v(" "),v("li",[v("strong",[t._v("302 Found")]),t._v(" ：临时性重定向")]),t._v(" "),v("li",[v("strong",[t._v("303 See Other")]),t._v(" ：和 302 有着相同的功能，但是 303 明确要求客户端应该采用 GET 方法获取资源。")]),t._v(" "),v("li",[t._v("注：虽然 HTTP 协议规定 301、302 状态下重定向时不允许把 POST 方法改成 GET 方法，但是大多数浏览器都会在 301、302 和 303 状态下的重定向把 POST 方法改成 GET 方法。")]),t._v(" "),v("li",[v("strong",[t._v("304 Not Modified")]),t._v(" ：如果请求报文首部包含一些条件，例如：If-Match，If-Modified-Since，If-None-Match，If-Range，If-Unmodified-Since，如果不满足条件，则服务器会返回 304 状态码。")]),t._v(" "),v("li",[v("strong",[t._v("307 Temporary Redirect")]),t._v(" ：临时重定向，与 302 的含义类似，但是 307 要求浏览器不会把重定向请求的 POST 方法改成 GET 方法。")])]),t._v(" "),v("h3",{attrs:{id:"_4-4xx-客户端错误"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_4-4xx-客户端错误"}},[t._v("#")]),t._v(" （4）4XX 客户端错误")]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("400 Bad Request")]),t._v(" ：请求报文中存在语法错误。")]),t._v(" "),v("li",[v("strong",[t._v("401 Unauthorized")]),t._v(" ：该状态码表示发送的请求需要有认证信息（BASIC 认证、DIGEST 认证）。如果之前已进行过一次请求，则表示用户认证失败。")]),t._v(" "),v("li",[v("strong",[t._v("403 Forbidden")]),t._v(" ：请求被拒绝，服务器端没有必要给出拒绝的详细理由。")]),t._v(" "),v("li",[v("strong",[t._v("404 Not Found")])])]),t._v(" "),v("h3",{attrs:{id:"_5-5xx-服务器错误"}},[v("a",{staticClass:"header-anchor",attrs:{href:"#_5-5xx-服务器错误"}},[t._v("#")]),t._v(" （5）5XX 服务器错误")]),t._v(" "),v("ul",[v("li",[v("strong",[t._v("500 Internal Server Error")]),t._v(" ：服务器正在执行请求时发生错误。")]),t._v(" "),v("li",[v("strong",[t._v("503 Service Unavailable")]),t._v(" ：服务器暂时处于超负载或正在进行停机维护，现在无法处理请求。")])])])}),[],!1,null,null,null);_.default=e.exports}}]);