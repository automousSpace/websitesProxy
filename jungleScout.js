const fs = require('fs');
const { promisify, isObject } = require('util');
require('events').EventEmitter.defaultMaxListeners = 0
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const modifyResponse = require('http-proxy-response-rewrite');
const proxyingAgent = require('proxying-agent');
const redis = require('redis');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const proxyURL = 'http://sshukl03:QkWCr8hB@23.106.205.88:29842';
const baseDomain = process.env.ROOT_DOMAIN || "econsuite.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);


const findFromAliases = id => {
  const aliases = {
    cdnah: "ahx",
    ahelp: "ahx",
    stah: "ahx"
  };

  return aliases[id];
};

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: '',
    password: '',
    database: ''
  });
  

const connectToDB = () => {
  return new Promise((resolve, reject) => {
    db.connect(function(err) {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

const getUserID = (db, session) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT user_id FROM am_session WHERE id = '${session}'`, (err, result) => {
      if(err) {
        resolve(null);
        return;
      }

      resolve(result[0] && result[0].user_id ? result[0].user_id : null);
    });
  });
};

const checkForAccess = (db, id, productID) => {
  return new Promise((resolve, reject) => {
    if(accessCache[id + "+" + productID]) {
      resolve(accessCache[id + "+" + productID]);
      return;
    }

    db.query(`SELECT status FROM am_user_status WHERE user_id = ${id} AND product_id IN (${productID.join(",")});`, (err, result) => {
      if(err) {
        console.log(err);
        resolve(null);
        return;
      }

      console.log(result[0] && result[0].status ? result[0].status : null);
      resolve(result[0] && result[0].status ? result[0].status : null);
      accessCache[id + "+" + productID] = result[0] && result[0].status ? result[0].status : null;
    });
  });
};

const connectionData = {
  js1: {
    productID: [2,3,4,5],
    address: 'https://members.junglescout.com',
    host: 'members.junglescout.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: "jsweb01." + baseDomain,
    redirectPath: "",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("js", "UserID: ", userID);
        return body;
      }
    ]
  },


};
function modifyProxyRequest(requestModifiers) {
  return function onProxyReq(proxyReq, req, res) {
     req.headers['access-control-allow-origin']= "*";
    delete req.headers['access-control-allow-credentials'];
    delete req.headers['access-control-allow-methods'];
    delete req.headers['cf-ipcountry'];
    delete req.headers['cf-ray'];
    delete req.headers['x-forwarded-proto'];
    delete req.headers['x-forwarded-for'];
    delete req.headers['cf-visitor'];
    delete req.headers['cf-request-id'];
    delete req.headers['cf-connecting-ip'];
    delete req.headers['cdn-loop'];
    delete req.headers['tool-subdomain'];
    delete req.headers['referer'];

  //  console.log( " origin of dox ======  "+  JSON.stringify(req.headers));
  }
}

function modifyProxyResponse(responseModifiers, modifyJS = false, userID) {
  return function onProxyRes (proxyRes, req, res) {
    delete proxyRes.headers['set-cookie'];

    console.log(proxyRes.headers['set-cookie']);
    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['content-security-policy-report-only'];
 
  var newBody ='';

    if(proxyRes.headers['content-encoding'] === 'br') {
      console.log("here");
      return;
    }


    if(proxyRes.headers['content-encoding'] === 'deflate') 
    {
      return;
     
    }



    if(proxyRes.headers['content-type'] && (proxyRes.headers['content-type'].includes('html') || modifyJS)) {
      modifyResponse(res, proxyRes.headers['content-encoding'], function (body) 
      {

        if (body) {

       

        //  console.log(body)

        }
        return  body;
      });
    }
  }

}

const client = redis.createClient({
    host: '127.0.0.1',
    port: '6379',
    password: ''
  });
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

let accessCache = {};

setInterval(() => {
  accessCache = {};
}, 120000);

const app = express();


app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

app.use(express.json());

app.use('*', async (req, res, next) => {
  const toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];
  const toolData = connectionData[toolID]; 

  
  console.log( " tool id = " + toolID );

  console.log( " base url  = " + req.baseUrl );

  let userID;

//   if(isProduction) {
//     if(!toolData) {
//       res.redirect("https://members.econsuite.com")
//       return;
//     }

//     if(!req.cookies["PHPSESSID"]) {
//       res.redirect("https://members.econsuite.com")
//       return;
//     }

//     userID = await getUserID(db, req.cookies["PHPSESSID"]);

//     if(!userID) {
//       res.redirect("https://members.econsuite.com")
//       return;
//     }

//     const hasAccess = await checkForAccess(db, userID, toolData.productID);

//     if(!hasAccess) {
//       res.redirect("https://members.econsuite.com")
//       return;
//     }
//   }

  if(isProduction) {
  if(toolData.blockedRoutes.length) {
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
  }

}


  let agent;
  let accessTool;

  if(isProduction) {
    const accessAllData = JSON.parse(await getAsync("econsuite"));
    if ( accessAllData == null)
    {
      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("econsuite", content);
      console.log("Storage populated  again ...");
      accessAllData = JSON.parse(await getAsync("econsuite"));
    }

    accessTool = accessAllData[toolID];

    if(!accessTool) {
      accessTool = accessAllData[findFromAliases(toolID)];
    }

    if(!accessTool) {
      res.send("Access forbidden. You need to purchase first.");
      return;
    }

    agent = toolData.withAgent ? proxyingAgent.create(accessTool.proxy, toolData.address) : null;
    if(  req.baseUrl == "")
    {

       res.cookie('auth_token', accessTool.cookie);
        res.send(`
        <!doctype html><html lang="en"><head>
  
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/6.0.0/normalize.min.css" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css?display=swap&family=Work+Sans:300,400,500,600,700" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?display=swap&family=Work+Sans:300,400,500,600,700" media="print" onload="this.media='all'" />
        
        <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no"><meta name="theme-color" content="#000000"><meta name="stripe-key" content="#000000"><meta name="google-site-verification" content="mTGF6TC5Ia5CJuGeRDXcMg2v_R3x-lw-RX9dR5kw9Zk"><title>Jungle Scout</title><script src="/cdn-cgi/apps/head/B6wlZilhTBHH4H3gGxd0on1lkqQ.js"></script><script>/MSIE |Trident\\//.test(navigator.userAgent)&&(window.location.href="/index-legacy.html")</script><script type="application/javascript">const DataDomeDomains = ['staging-api.dev-junglescout.com', 'api.junglescout.com', 'api.junglescout.cn', 'staging-api.junglescout.cn']
        window.ddCaptchaOptions= {ajaxListenerPath: DataDomeDomains, sessionByHeader: true, allowHtmlContentTypeOnCaptcha: true};</script><script type="application/javascript" src="https://js.captcha-display.com/xhr_tag.js"></script><script src="https://js.stripe.com/v3/"></script><script>(function (d, s, h) {
      if (!(h.search('registrations') > 0 && h.search('lang=zh') > 0)) {
        var node = d.getElementsByTagName(s)[0];
        const googleFontSrc = "https://fonts.googleapis.com/css?display=swap&family=Work+Sans:300,400,500,600,700";
      
      }
      })(document, 'script', window.location.hash);</script><script type="text/javascript">dataLayer=[]</script><script>!function(e,t,a){if(!(0<a.search("registrations")&&0<a.search("lang=zh"))){var n=e.getElementsByTagName(t)[0],s=e.createElement(t);s.defer=!0,s.src="https://cdn.optimizely.com/js/12383541967.js",n.parentNode.appendChild(s)}}(document,"script",window.location.hash)</script><script>!function(e,t,a,n){e[n]=e[n]||[],e[n].push({"gtm.start":(new Date).getTime(),event:"gtm.js"});var r=t.getElementsByTagName(a)[0],g=t.createElement(a);g.defer=!0,g.src="//www.googletagmanager.com/gtm.js?id=GTM-TJXJ6N",r.parentNode.insertBefore(g,r)}(window,document,"script","dataLayer")</script><script type="text/javascript">if(!(0<window.location.hash.search("registrations")&&0<window.location.hash.search("lang=zh"))){var _vwo_code=function(){var t=!1,n=document;return{use_existing_jquery:function(){return!1},library_tolerance:function(){return 2500},finish:function(){if(!t){t=!0;var e=n.getElementById("_vis_opt_path_hides");e&&e.parentNode.removeChild(e)}},finished:function(){return t},load:function(e){var t=n.createElement("script");t.src=e,t.type="text/javascript",t.innerText,t.onerror=function(){_vwo_code.finish()},n.getElementsByTagName("head")[0].appendChild(t)},init:function(){settings_timer=setTimeout("_vwo_code.finish()",2e3);var e=n.createElement("style"),t="body{opacity:0 !important;filter:alpha(opacity=0) !important;background:none !important;}",i=n.getElementsByTagName("head")[0];return e.setAttribute("id","_vis_opt_path_hides"),e.setAttribute("type","text/css"),e.styleSheet?e.styleSheet.cssText=t:e.appendChild(n.createTextNode(t)),i.appendChild(e),this.load("//dev.visualwebsiteoptimizer.com/j.php?a=215937&u="+encodeURIComponent(n.URL)+"&f=1&r="+Math.random()),settings_timer}}}();_vwo_settings_timer=_vwo_code.init()}</script><script type="text/javascript">window._vis_opt_queue=window._vis_opt_queue||[]</script><script type="text/javascript">!function(e,o){var t,n,l,a;o.__SV||((window.mixpanel=o)._i=[],o.init=function(e,t,n){function i(e,t){var n=t.split(".");2==n.length&&(e=e[n[0]],t=n[1]),e[t]=function(){e.push([t].concat(Array.prototype.slice.call(arguments,0)))}}var p=o;for(void 0!==n?p=o[n]=[]:n="mixpanel",p.people=p.people||[],p.toString=function(e){var t="mixpanel";return"mixpanel"!==n&&(t+="."+n),e||(t+=" (stub)"),t},p.people.toString=function(){return p.toString(1)+".people (stub)"},l="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" "),a=0;a<l.length;a++)i(p,l[a]);o._i.push([e,t,n])},o.__SV=1.2,(t=e.createElement("script")).type="text/javascript",t.async=!0,t.src="undefined"!=typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js",(n=e.getElementsByTagName("script")[0]).parentNode.insertBefore(t,n))}(document,window.mixpanel||[]),mixpanel.init("c74f4284138a8d26cd2c3b5ebba43d0f",{cross_domain_cookie:!0})</script><script>!function(){var r=window.analytics=window.analytics||[];if(!r.initialize)if(r.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{r.invoked=!0,r.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"],r.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);return e.unshift(t),r.push(e),r}};for(var e=0;e<r.methods.length;e++){var t=r.methods[e];r[t]=r.factory(t)}r.load=function(e,t){var n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://cdn.segment.com/analytics.js/v1/"+e+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a),r._loadOptions=t},r.SNIPPET_VERSION="4.13.1",r.load("YAxc3fZJr2UOtNFjkYaAHH5dhtg9VcFv")}}()</script><style id="antiClickjack">body{display:none!important}</style><script type="text/javascript">if(self===top){var antiClickjack=document.getElementById("antiClickjack");antiClickjack.parentNode.removeChild(antiClickjack)}else top.location=self.location</script><link href="/static/css/vendors~main.44bf52ef.css" rel="stylesheet"><link href="/static/css/main.4ea459bd.css" rel="stylesheet"><script async src='/cdn-cgi/bm/cv/669835187/api.js'></script></head><body><script>!function(a,b,c,d,e,f){a.ddjskey=e;a.ddoptions=f||null;var m=b.createElement(c),n=b.getElementsByTagName(c)[0];m.async=1,m.src=d,n.parentNode.insertBefore(m,n)}(window,document,"script","https://js.datadome.co/tags.js","C1D006A6A638324EF50C3B18DBE0AF", {"ajaxListenerPath": true});</script><noscript><iframe src="//www.googletagmanager.com/ns.html?id=GTM-TJXJ6N" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><noscript>You need to enable JavaScript to run this app.</noscript><div id="root"></div><script>!function(e,t,l,n,o,r,d){e.ProfitWellObject=o,e[o]=e[o]||function(){(e[o].q=e[o].q||[]).push(arguments)},e[o].l=1*new Date,r=t.createElement(l),d=t.getElementsByTagName(l)[0],r.async=1,r.src="https://dna8twue3dlxq.cloudfront.net/js/profitwell.js",d.parentNode.insertBefore(r,d)}(window,document,"script",0,"profitwell"),profitwell("auth_token","e2875d361dd8d419d00cf85264939b7e"),profitwell("user_email","")</script><script>!function(e,t,n){e.ddjskey="C1D006A6A638324EF50C3B18DBE0AF",e.ddoptions=null;var s=t.createElement(n),a=t.getElementsByTagName(n)[0];s.async=1,s.src="https://js.datadome.co/tags.js",a.parentNode.insertBefore(s,a)}(window,document,"script")</script><script type="text/javascript">window.lightningjs||function(l){function n(n,e){var i,u,p,t,r,a;return e&&(e+=(/\\?/.test(e)?"&":"?")+"lv=1"),l[n]||(i=window,u=document,p=n,t=u.location.protocol,r="load",a=0,function(){l[p]=function(){var n=arguments,e=this,o=++a,t=e&&e!=i&&e.id||0;function d(){return d.id=o,l[p].apply(d,arguments)}return(c.s=c.s||[]).push([o,t,n]),d.then=function(n,e,t){var i=c.fh[o]=c.fh[o]||[],r=c.eh[o]=c.eh[o]||[],a=c.ph[o]=c.ph[o]||[];return n&&i.push(n),e&&r.push(e),t&&a.push(t),d},d};var c=l[p]._={};function n(){c.P(r),c.w=1,l[p]("_load")}c.fh={},c.eh={},c.ph={},c.l=e?e.replace(/^\\/\\//,("https:"==t?t:"http:")+"//"):e,c.p={0:+new Date},c.P=function(n){c.p[n]=new Date-c.p[0]},c.w&&n(),i.addEventListener?i.addEventListener(r,n,!1):i.attachEvent("onload",n);var h=function(){function e(){return["<!DOCTYPE ",i,"><",i,"><head></head><",n,"><",t,' src="',c.l,'"></',t,"></",n,"></",i,">"].join("")}var n="body",t="script",i="html",r=u[n];if(!r)return setTimeout(h,100);c.P(1);var a,o=u.createElement("div"),d=o.appendChild(u.createElement("div")),l=u.createElement("iframe");o.style.display="none",r.insertBefore(o,r.firstChild).id="lightningjs-"+p,l.frameBorder="0",l.id="lightningjs-frame-"+p,/MSIE[ ]+6/.test(navigator.userAgent)&&(l.src="javascript:false"),l.allowTransparency="true",d.appendChild(l);try{l.contentWindow.document.open()}catch(e){c.domain=u.domain,a="javascript:var d=document.open();d.domain='"+u.domain+"';",l.src=a+"void(0);"}try{var s=l.contentWindow.document;s.write(e()),s.close()}catch(n){l.src=a+'d.write("'+e().replace(/"/g,String.fromCharCode(92)+'"')+'");d.close();'}c.P(2)};c.l&&h()}()),l[n].lv="1",l[n]}var e=window.lightningjs=n("lightningjs");e.require=n,e.modules=l}({}),window.usabilla_live=lightningjs.require("usabilla_live","//w.usabilla.com/308b2bb49b59.js")</script><script src="/static/js/vendors~main.5bbcce4f.chunk.js"></script><script src="/static/js/main.b130b77c.js"></script><script type="text/javascript">(function(){window['__CF$cv$params']={r:'6a8f06703898ca8c',m:'WqmBFbiX1MTzUM9g4ClAtTshJM5NaFywG1Gkuhtpj4g-1636041312-0-Afinz0P58n6HdYgtyKvTSe+tineEc/zbYyyzqr87KNofRd5E3Fud/1LhJdI2QK8t17wZspBsqE1H5lEHEZ0n/xLTwjrDxDrxDpFFrYDEuT4C8gGGCvxCm7Jr4hV/tNsKkA==',s:[0x1630cdd655,0xe50522a243],}})();</script>
      
      


          <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
          <script>
          $(document).ready(function(){
            
            $("div[class='NavbarLink-mhfjmp-2 egxwJp navbar-link-account']").remove();
          });
          $(window).on('hashchange', function() {
            if( window.location.hash == "#/account" || window.location.hash == "#/account/info" || window.location.hash == "#/seller-tools" || window.location.hash == "#/products"  || window.location.hash == "#/account/languages"   )
            {
              window.location.replace("https://jsweb01.econsuite.com");
            }
          });
          if( window.location.hash == "#/account" || window.location.hash == "#/account/info" || window.location.hash == "#/seller-tools" || window.location.hash == "#/products"  || window.location.hash == "#/account/languages"   )
          {
            window.location.replace("https://jsweb01.econsuite.com");
          }
          </script>
          </body></html>`)
        return;
    }
    else
    {
      console.log("noooooooooooo")
  
    }
    
  } else {
    agent = toolData.withAgent ? proxyingAgent.create(proxyURL, toolData.address) : null;
  }

  createProxyMiddleware({ 
    target: toolData.address,
    toProxy: true,
    onProxyReq: modifyProxyRequest(toolData.requestModifiers),
    onProxyRes: toolData.transformResponse ? modifyProxyResponse(toolData.responseModifiers, false, userID) : function() {},
    headers: {
      "User-Agent": toolData.userAgent,
      host: toolData.host,
      referer: 'https://members.junglescout.com/',
      origin: 'https://members.junglescout.com',
    },
  })(req, res, next);

});


client.on("ready", async (err) => {
    if(isProduction) {
      try {
        console.log("Connected to Redis...");
  
        const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
        await setAsync("econsuite", content);
        console.log("Storage populated...");
  
        await connectToDB()
        console.log("Connected to MySQL...");
  
        app.listen(1004, (err) => {
          if(err) {
            console.log(err);
            return;
          }
  
          console.log("Server running on: http://127.0.0.1:5555");
        });
      } catch(err) {
        console.log(err);
      }
    } else {
      app.listen(5500, (err) => {
        if(err) {
          console.log(err);
          return;
        }
  
        console.log("Server running on: http://127.0.0.1:5555");
      });
    }
  });
  


