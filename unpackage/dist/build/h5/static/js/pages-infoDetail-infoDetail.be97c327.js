(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-infoDetail-infoDetail"],{"2bbd":function(t,e,o){"use strict";o.r(e);var n=o("abd8"),a=o("44ac");for(var i in a)"default"!==i&&function(t){o.d(e,t,(function(){return a[t]}))}(i);o("c63b");var r,s=o("f0c5"),d=Object(s["a"])(a["default"],n["b"],n["c"],!1,null,"56d96025",null,!1,n["a"],r);e["default"]=d.exports},"44ac":function(t,e,o){"use strict";o.r(e);var n=o("de47"),a=o.n(n);for(var i in n)"default"!==i&&function(t){o.d(e,t,(function(){return n[t]}))}(i);e["default"]=a.a},a48f:function(t,e,o){o("a15b"),o("d81d"),o("d3b7"),o("25f0");var n=function(t){var e=t.getFullYear(),o=t.getMonth()+1,n=t.getDate(),a=t.getHours(),i=t.getMinutes(),r=t.getSeconds();return[e,o,n].map(d).join("/")+" "+[a,i,r].map(d).join(":")},a=function(t){var e=t.getFullYear(),o=t.getMonth()+1,n=t.getDate(),a=t.getHours(),i=t.getMinutes();t.getSeconds();return[e,o,n].map(d).join("-")+" "+[a,i].map(d).join(":")},i=function(t){var e=t.getFullYear(),o=t.getMonth()+1,n=t.getDate();return[e,o,n].map(d).join("-")},r=function(t){var e=t.getFullYear(),o=t.getMonth()+1,n=t.getDate();return[e,o,n].map(d).join("/")},s=function(t){var e=t.getMonth()+1,o=t.getDate();return[e,o].map(d).join("/")},d=function(t){return t=t.toString(),t[1]?t:"0"+t};t.exports={formatTime:n,formatTimes:a,formatDate:r,formatDates:i,formatMD:s}},abd8:function(t,e,o){"use strict";var n,a=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("v-uni-view",{staticClass:"bg-white"},[o("cu-custom",{attrs:{bgColor:"",isBack:!0,noMore:!0,hasAdd:!0,favorFill:t.favorFill},on:{toggleAdd:function(e){arguments[0]=e=t.$handleEvent(e),t.toggleAdd.apply(void 0,arguments)}}},[o("template",{attrs:{slot:"content"},slot:"content"},[t._v("智能舆情系统")])],2),t.hasContent?o("v-uni-view",{},[o("v-uni-view",{staticClass:"info-title text-xxl padding"},[t._v(t._s(t.art.Title))]),o("v-uni-view",{staticClass:"text-sm padding-lr"},[o("v-uni-view",{},[t._v(t._s(t.art.Media+" | "+t.art.Author))]),o("v-uni-view",{staticClass:"text-gray"},[t._v(t._s(t.art.date))])],1),o("v-uni-view",{staticClass:"info-content padding"},[o("v-uni-view",{staticClass:"info-content-html",domProps:{innerHTML:t._s(t.art.Contents)}})],1)],1):t._e(),t.noContent?o("v-uni-view",{staticClass:"info-none"},[t._v("该媒体页面已变更")]):t._e()],1)},i=[];o.d(e,"b",(function(){return a})),o.d(e,"c",(function(){return i})),o.d(e,"a",(function(){return n}))},c63b:function(t,e,o){"use strict";var n=o("db8e"),a=o.n(n);a.a},db8e:function(t,e,o){var n=o("df52");"string"===typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);var a=o("4f06").default;a("a2c70608",n,!0,{sourceMap:!1,shadowMode:!1})},de47:function(t,e,o){"use strict";var n=o("ee27");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var a,i=o("cbf1"),r=n(o("a48f")),s={data:function(){return{articleId:null,hasContent:!1,noContent:!1,favorFill:!1,art:"",userId:""}},onLoad:function(t){console.log(t),a=this;var e=uni.getStorageSync("userData");a.userId=e.userid,a.articleId=t.id;var o={Article_ID:t.id,ProjectName:t.ProjectName,UserID:t.UserID};a.getArticleDetail(o)},methods:{getArticleDetail:function(t){console.log(t),uni.showLoading(),(0,i.getArticleDetail)(t).then((function(t){if(uni.hideLoading(),console.log("getArticleDetail",t),"1"==t.data.successCode){if(0==t.data.data.length)return void(a.noContent=!0);var e=t.data.data[0];e.date=r.default.formatDates(new Date(1e3*e.MediaDate)),console.log(e),1==e.IsBookMark&&(a.favorFill=!0),a.art=e,a.hasContent=!0,a.noContent=!1}else a.hasContent=!1,a.noContent=!0,a.showToast(t.data.msg)})).catch((function(t){uni.hideLoading(),a.hasContent=!1,a.noContent=!0,console.log(t),a.showToast(t.msg)}))},addBookMark:function(t){var e={ArticleID:t,UserID:a.userId};(0,i.addBookMark)(e).then((function(t){console.log("addBookMark",t),"1"==t.data.successCode?(uni.showToast({title:"收藏成功"}),a.favorFill=!0):a.showToast(t.data.msg)})).catch((function(t){console.log(t),a.showToast(t.msg)}))},deleteBookMark:function(t){var e={ArticleID:t,UserID:a.userId};(0,i.deleteBookMark)(e).then((function(t){console.log("deleteBookMark",t),"1"==t.data.successCode?(uni.showToast({title:"取消收藏"}),a.favorFill=!1):a.showToast(t.data.msg)})).catch((function(t){console.log(t),a.showToast(t.msg)}))},toggleAdd:function(t){console.log(a.articleId),a.articleId?(console.log(t),uni.showLoading(),t.favorFill?a.deleteBookMark(a.art.BookMarkID):a.addBookMark(a.art.BookMarkID)):a.showToast("该媒体页面已变更")},getUserId:function(){try{var t=uni.getStorageSync("userData");t&&(console.log(t),a.userId=t.userid)}catch(o){var e=uni.getStorageSync("userData");e&&(console.log(e),a.userId=e.userid)}},showToast:function(t){uni.showToast({title:t,icon:"none",mask:!0,duration:2e3})}}};e.default=s},df52:function(t,e,o){var n=o("24fb");e=n(!1),e.push([t.i,".info-none[data-v-56d96025]{position:fixed;top:40%;width:100%;text-align:center}.info-content-html[data-v-56d96025]{width:100%;word-wrap:break-word;overflow:hidden}.info-content-html img[data-v-56d96025],.info-content-html uni-image[data-v-56d96025]{max-width:100%!important}",""]),t.exports=e}}]);