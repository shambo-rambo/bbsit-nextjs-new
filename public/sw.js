if(!self.define){let e,a={};const i=(i,s)=>(i=new URL(i+".js",s).href,a[i]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=a,document.head.appendChild(e)}else e=i,importScripts(i),a()})).then((()=>{let e=a[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,n)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(a[r])return;let o={};const c=e=>i(e,r),d={module:{uri:r},exports:o,require:c};a[r]=Promise.all(s.map((e=>d[e]||c(e)))).then((e=>(n(...e),o)))}}define(["./workbox-c2c0676f"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/NoiGOAMncEfYrkT9PSEsS/_buildManifest.js",revision:"a0ae24e7f29dd3809ab75b5dd91a79dc"},{url:"/_next/static/NoiGOAMncEfYrkT9PSEsS/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/0e5ce63c-70d119e45d029762.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/107-00d1c3f4f6119e1b.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/231-bba4db9d61137448.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/256-afa076f051d9204b.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/316.baa990643b7e7b23.js",revision:"baa990643b7e7b23"},{url:"/_next/static/chunks/343.78132ea564a9d0c5.js",revision:"78132ea564a9d0c5"},{url:"/_next/static/chunks/403-989fcae44cce4d0b.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/421.443d5aba7c19727f.js",revision:"443d5aba7c19727f"},{url:"/_next/static/chunks/430.266c4eb0040935f6.js",revision:"266c4eb0040935f6"},{url:"/_next/static/chunks/46-a5bf0915c581a234.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/527.87299612e86e8296.js",revision:"87299612e86e8296"},{url:"/_next/static/chunks/5e22fd23-d5679d502092836d.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/648-e0c5969e07afe406.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/674-61458b1fd2cca19d.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/685-5e92d98372b85748.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/736.04c3d02d631b9277.js",revision:"04c3d02d631b9277"},{url:"/_next/static/chunks/763.2782a9809079d1b1.js",revision:"2782a9809079d1b1"},{url:"/_next/static/chunks/817-6b49770ded99b81d.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/827.bd45453606d493ef.js",revision:"bd45453606d493ef"},{url:"/_next/static/chunks/8e1d74a4-cda5545821abff7e.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/986-2b2b9044a2f31977.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/998-a0bf078ce69b2315.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/_not-found/page-82d3b8161515241d.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/auth/page-92ddf50be1d4e3b8.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/event/page-edcc0a13c5675435.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/events/%5BeventId%5D/page-8d853f007030dd8f.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/events/dashboard/page-b1436503a2d72350.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/family/create/page-277e08a38907fdcc.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/family/dashboard/page-da53356c7bcffc12.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/family/settings/page-c4ca13a9444fb355.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/groups/%5BgroupId%5D/page-31487ee65929a1f2.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/groups/%5BgroupId%5D/settings/page-9b3cfe325c76ad03.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/groups/dashboard/page-5284b9c60460f310.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/invitation-sent/page-8b88af45c6cc6354.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/layout-4a4b075992626949.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/offline/page-c6f99cddabf47bf5.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/page-1f7c58406b95e8fc.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/app/profile/page-5c80d0c67ab60354.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/e8686b1f.701d5fb326f1a987.js",revision:"701d5fb326f1a987"},{url:"/_next/static/chunks/fd9d1056-8966b0d2f9f25603.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/framework-00a8ba1a63cfdc9e.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/main-5dfd20d14671e8f5.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/main-app-25226d2005965f05.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/pages/_app-037b5d058bd9a820.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/pages/_error-6ae619510b1539d6.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-bb904b809d62987a.js",revision:"NoiGOAMncEfYrkT9PSEsS"},{url:"/_next/static/css/5a56e3c1761e58ad.css",revision:"5a56e3c1761e58ad"},{url:"/_next/static/css/5ba74ebf760385c0.css",revision:"5ba74ebf760385c0"},{url:"/_next/static/css/c3c1fbb4abd379f9.css",revision:"c3c1fbb4abd379f9"},{url:"/_next/static/media/26a46d62cd723877-s.woff2",revision:"befd9c0fdfa3d8a645d5f95717ed6420"},{url:"/_next/static/media/55c55f0601d81cf3-s.woff2",revision:"43828e14271c77b87e3ed582dbff9f74"},{url:"/_next/static/media/581909926a08bbc8-s.woff2",revision:"f0b86e7c24f455280b8df606b89af891"},{url:"/_next/static/media/6d93bde91c0c2823-s.woff2",revision:"621a07228c8ccbfd647918f1021b4868"},{url:"/_next/static/media/97e0cb1ae144a2a9-s.woff2",revision:"e360c61c5bd8d90639fd4503c829c2dc"},{url:"/_next/static/media/a34f9d1faa5f3315-s.p.woff2",revision:"d4fe31e6a2aebc06b8d6e558c9141119"},{url:"/_next/static/media/df0a9ae256c0569c-s.woff2",revision:"d54db44de5ccb18886ece2fda72bdfe0"},{url:"/android/android-launchericon-144-144.png",revision:"b8f06125b08b122a43f92f0269789e1e"},{url:"/android/android-launchericon-192-192.png",revision:"a68c4e6715c28e90769326d7b0335ccc"},{url:"/android/android-launchericon-48-48.png",revision:"5f9eac4223a295714b2719379bfcbe67"},{url:"/android/android-launchericon-512-512.png",revision:"b4323c2bfd710f17fd984e3fde5c9704"},{url:"/android/android-launchericon-72-72.png",revision:"145d96fb7ae54555ef8f5137531997f9"},{url:"/android/android-launchericon-96-96.png",revision:"ce6989257bc6c9863cfd727899bec275"},{url:"/default-family-image.jpg",revision:"7b2e3f20643a0e7c15a1fad4bc09cf27"},{url:"/google-color.svg",revision:"1651d8b87f0961b52b759a8169341659"},{url:"/ios/100.png",revision:"ab4940a4872dbe74041c0bb3cdcf4a99"},{url:"/ios/1024.png",revision:"13e54bdf6ff6fa089f3ff2de9689e29d"},{url:"/ios/114.png",revision:"d914e861e5fc49ac8ee4e7e69857c6ae"},{url:"/ios/120.png",revision:"e2072508a8eefd89f685656c4303264f"},{url:"/ios/128.png",revision:"f75327c6c26e71a333e7b1082f362f41"},{url:"/ios/144.png",revision:"b8f06125b08b122a43f92f0269789e1e"},{url:"/ios/152.png",revision:"6844b7a7c3fffdafecfdee46dc126f7d"},{url:"/ios/16.png",revision:"262866ea630618d4a3938a5fedf6a79e"},{url:"/ios/167.png",revision:"f6469fefcd3a11ebf0befbaa1a74a6d8"},{url:"/ios/180.png",revision:"f4bb4dfae97acdbc8330c2d5aa448bf9"},{url:"/ios/192.png",revision:"a68c4e6715c28e90769326d7b0335ccc"},{url:"/ios/20.png",revision:"e61543ed470d7e67451e708e2fd39587"},{url:"/ios/256.png",revision:"9816a55cd78f798ed3780dcceaa3818d"},{url:"/ios/29.png",revision:"1dc3a8dc9e03dd3328ea33b9f8958a62"},{url:"/ios/32.png",revision:"f6ab79878bbf621a4fcedacebc57be74"},{url:"/ios/40.png",revision:"3cef38926ac03c6762eb4d18458836ba"},{url:"/ios/50.png",revision:"8a00bb150b217e23af4e50be2db38984"},{url:"/ios/512.png",revision:"b4323c2bfd710f17fd984e3fde5c9704"},{url:"/ios/57.png",revision:"531854208cfa8dabaf000a8a2264bae3"},{url:"/ios/58.png",revision:"68a9adc2d00d0d59d794d033506559aa"},{url:"/ios/60.png",revision:"7a87acafdaa90a139df2cc84d00a76ca"},{url:"/ios/64.png",revision:"32bdeba8fb268118dbbab5528ccac6c3"},{url:"/ios/72.png",revision:"145d96fb7ae54555ef8f5137531997f9"},{url:"/ios/76.png",revision:"5064555e4b2982f3583a7f4fcdf67008"},{url:"/ios/80.png",revision:"2805ea38fb813cab1d15f0e36d744e44"},{url:"/ios/87.png",revision:"799bb760478ed71bf8121001f9306022"},{url:"/logo-h.png",revision:"d2b35dd9c6c658675c548b9e46bc9e82"},{url:"/logo.png",revision:"1811e9f6dfc220ae31d78f578be30aab"},{url:"/manifest.json",revision:"746b5ba17cf6d68f0e3811d625769bca"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/screenshot-desktop.png",revision:"d2018a597b0534435ef425e0dd217c30"},{url:"/screenshot-mobile.png",revision:"27c0d495ff6f6371972a32f9e283f40b"},{url:"/service-worker.js",revision:"22ae0879d359b3238011c2c9cdcbfae1"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"},{url:"/windows11/LargeTile.scale-100.png",revision:"0c775fa4d2d0f2836b985a3b8866f938"},{url:"/windows11/LargeTile.scale-125.png",revision:"b08b300a28ea03ea9e5186773b93b820"},{url:"/windows11/LargeTile.scale-150.png",revision:"d51d639134d5ede5c011a04a9ee1585a"},{url:"/windows11/LargeTile.scale-200.png",revision:"e8856be6813c3c98ba08745104e76133"},{url:"/windows11/LargeTile.scale-400.png",revision:"62a5880a5710242ddda94998bbf67340"},{url:"/windows11/SmallTile.scale-100.png",revision:"4d14663241ec56fcdb5e33b49f4c77e4"},{url:"/windows11/SmallTile.scale-125.png",revision:"c6c5c8939604ef1424ca959374d4ab24"},{url:"/windows11/SmallTile.scale-150.png",revision:"ae4fbb9432affc66db7bd2a8fce808ac"},{url:"/windows11/SmallTile.scale-200.png",revision:"9f41b64ae55ada509c1233ba63bd3c09"},{url:"/windows11/SmallTile.scale-400.png",revision:"b59d7b9b4b468d4926f158a19916f9b7"},{url:"/windows11/SplashScreen.scale-100.png",revision:"111913055d91a2aaa334a2525cb026d2"},{url:"/windows11/SplashScreen.scale-125.png",revision:"9487964f85f594cd8aa4f0bad4f3c657"},{url:"/windows11/SplashScreen.scale-150.png",revision:"11943d3ad7e9ea4c2383a92e23355977"},{url:"/windows11/SplashScreen.scale-200.png",revision:"2b0da18184fd34b0d474af8408699212"},{url:"/windows11/SplashScreen.scale-400.png",revision:"dadea6d1f69377b6cb609a899fee0ff5"},{url:"/windows11/Square150x150Logo.scale-100.png",revision:"df132c6605164dc721a22dd45f1ec308"},{url:"/windows11/Square150x150Logo.scale-125.png",revision:"e4adae063a7af4868b26fc2826fcd520"},{url:"/windows11/Square150x150Logo.scale-150.png",revision:"b0c4d84ddf467d59158e94eee4e29a33"},{url:"/windows11/Square150x150Logo.scale-200.png",revision:"c4a585c2a2a20bc918635ba80a93b46b"},{url:"/windows11/Square150x150Logo.scale-400.png",revision:"9c4a6af07d629444153dbadffbc362f2"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",revision:"a0947ad9e3b64a1e8a1a2ff42e858487"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",revision:"42405a97ec4876c1521f198bb3968f11"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",revision:"5e980f0f7032711aaa60fe01822a69ab"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",revision:"93cf24bc5bbed35d5f5971bde3e9f7ad"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",revision:"b2feddd55fbaf9bc341ccb05e8890eaf"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",revision:"d02855b921ced81b972d64129041d4b9"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",revision:"2fdc04456e36196ab2636db470bb21dc"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",revision:"01f24fcce1697b8b4f998fe941529a55"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",revision:"77e7a3c3ad713df64fd097401eb484e0"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",revision:"1ec44cff95b11ad0f33dadf76e1a666e"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",revision:"03c12ad4f0bbe9e2a626935b19a759d2"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",revision:"d5299128bbd16fdf8e15bd88021d4583"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",revision:"36d5e9a324decee52b54f8fb103a1291"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",revision:"86a629c5a9c44afacb0bb584b9c33839"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",revision:"e7e2bb1542391d9bd1db36202d69708b"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",revision:"a0947ad9e3b64a1e8a1a2ff42e858487"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",revision:"42405a97ec4876c1521f198bb3968f11"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",revision:"5e980f0f7032711aaa60fe01822a69ab"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",revision:"93cf24bc5bbed35d5f5971bde3e9f7ad"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",revision:"b2feddd55fbaf9bc341ccb05e8890eaf"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",revision:"d02855b921ced81b972d64129041d4b9"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",revision:"2fdc04456e36196ab2636db470bb21dc"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",revision:"01f24fcce1697b8b4f998fe941529a55"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",revision:"77e7a3c3ad713df64fd097401eb484e0"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",revision:"1ec44cff95b11ad0f33dadf76e1a666e"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",revision:"03c12ad4f0bbe9e2a626935b19a759d2"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",revision:"d5299128bbd16fdf8e15bd88021d4583"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",revision:"36d5e9a324decee52b54f8fb103a1291"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",revision:"86a629c5a9c44afacb0bb584b9c33839"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",revision:"e7e2bb1542391d9bd1db36202d69708b"},{url:"/windows11/Square44x44Logo.scale-100.png",revision:"77e7a3c3ad713df64fd097401eb484e0"},{url:"/windows11/Square44x44Logo.scale-125.png",revision:"c789bacd5042541f6cab403fd87f4b86"},{url:"/windows11/Square44x44Logo.scale-150.png",revision:"f985c4fae6c50419b3982b3c03662d3b"},{url:"/windows11/Square44x44Logo.scale-200.png",revision:"4ca030c0a410d030eebca4dd3de74749"},{url:"/windows11/Square44x44Logo.scale-400.png",revision:"fffcdf1d431eee08973eba1cd58ef983"},{url:"/windows11/Square44x44Logo.targetsize-16.png",revision:"a0947ad9e3b64a1e8a1a2ff42e858487"},{url:"/windows11/Square44x44Logo.targetsize-20.png",revision:"42405a97ec4876c1521f198bb3968f11"},{url:"/windows11/Square44x44Logo.targetsize-24.png",revision:"5e980f0f7032711aaa60fe01822a69ab"},{url:"/windows11/Square44x44Logo.targetsize-256.png",revision:"93cf24bc5bbed35d5f5971bde3e9f7ad"},{url:"/windows11/Square44x44Logo.targetsize-30.png",revision:"b2feddd55fbaf9bc341ccb05e8890eaf"},{url:"/windows11/Square44x44Logo.targetsize-32.png",revision:"d02855b921ced81b972d64129041d4b9"},{url:"/windows11/Square44x44Logo.targetsize-36.png",revision:"2fdc04456e36196ab2636db470bb21dc"},{url:"/windows11/Square44x44Logo.targetsize-40.png",revision:"01f24fcce1697b8b4f998fe941529a55"},{url:"/windows11/Square44x44Logo.targetsize-44.png",revision:"77e7a3c3ad713df64fd097401eb484e0"},{url:"/windows11/Square44x44Logo.targetsize-48.png",revision:"1ec44cff95b11ad0f33dadf76e1a666e"},{url:"/windows11/Square44x44Logo.targetsize-60.png",revision:"03c12ad4f0bbe9e2a626935b19a759d2"},{url:"/windows11/Square44x44Logo.targetsize-64.png",revision:"d5299128bbd16fdf8e15bd88021d4583"},{url:"/windows11/Square44x44Logo.targetsize-72.png",revision:"36d5e9a324decee52b54f8fb103a1291"},{url:"/windows11/Square44x44Logo.targetsize-80.png",revision:"86a629c5a9c44afacb0bb584b9c33839"},{url:"/windows11/Square44x44Logo.targetsize-96.png",revision:"e7e2bb1542391d9bd1db36202d69708b"},{url:"/windows11/StoreLogo.scale-100.png",revision:"8a00bb150b217e23af4e50be2db38984"},{url:"/windows11/StoreLogo.scale-125.png",revision:"c3bcaf659700cc3960d31ca936879a8b"},{url:"/windows11/StoreLogo.scale-150.png",revision:"6d284e4192f9221a477eb0ff6e559ce2"},{url:"/windows11/StoreLogo.scale-200.png",revision:"ab4940a4872dbe74041c0bb3cdcf4a99"},{url:"/windows11/StoreLogo.scale-400.png",revision:"49504cb07ea133406b5a5708437bd142"},{url:"/windows11/Wide310x150Logo.scale-100.png",revision:"bf6530899a6280da25a58a736c856250"},{url:"/windows11/Wide310x150Logo.scale-125.png",revision:"453a265907c2b3ef1790da9cbb8dc5e2"},{url:"/windows11/Wide310x150Logo.scale-150.png",revision:"8da137f6a84f22ffdf25ed128f98bc3f"},{url:"/windows11/Wide310x150Logo.scale-200.png",revision:"111913055d91a2aaa334a2525cb026d2"},{url:"/windows11/Wide310x150Logo.scale-400.png",revision:"2b0da18184fd34b0d474af8408699212"}],{ignoreURLParametersMatching:[/^utm_/,/^fbclid$/]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({response:e})=>e&&"opaqueredirect"===e.type?new Response(e.body,{status:200,statusText:"OK",headers:e.headers}):e}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:2592e3})]}),"GET"),e.registerRoute(/\/_next\/static.+\.js$/i,new e.CacheFirst({cacheName:"next-static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4|webm)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:48,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e,url:{pathname:a}})=>!(!e||a.startsWith("/api/auth/callback")||!a.startsWith("/api/"))),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:a},sameOrigin:i})=>"1"===e.headers.get("RSC")&&"1"===e.headers.get("Next-Router-Prefetch")&&i&&!a.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc-prefetch",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({request:e,url:{pathname:a},sameOrigin:i})=>"1"===e.headers.get("RSC")&&i&&!a.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages-rsc",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:{pathname:e},sameOrigin:a})=>a&&!e.startsWith("/api/")),new e.NetworkFirst({cacheName:"pages",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({sameOrigin:e})=>!e),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
