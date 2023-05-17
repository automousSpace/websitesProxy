const fs = require('fs');
const { promisify, isObject } = require('util');
require('events').EventEmitter.defaultMaxListeners = 0
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const modifyResponse = require('http-proxy-response-rewrite');
const proxyingAgent = require('proxying-agent');
const basicAuth = require('express-basic-auth');
const redis = require('redis');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const minify = require('html-minifier').minify;
const UglifyJS = require('uglify-js');
const cheerio = require('cheerio');

const baseDomain = process.env.ROOT_DOMAIN || "triopacks.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);
var stack ="";

const generateYandexMetrica = (userID) => {
  return `
    <script type="text/javascript" >
       (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
       m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
       (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

       ym(72683164, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            userParams: {
              UserID: ${userID}
            }
       });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/72683164" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
  `;
};

const generateTrackingScript = (userID) => {
  const code = `
    document.addEventListener("DOMContentLoaded", function(e) {
      fetch('https://tracker.bundledseo.com/event', {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ userID: ${userID}, host: location.hostname })
      })
    });
  `;
  const result = UglifyJS.minify(code);
  return `<script type="text/javascript">${result.code}</script>`;
}

const generateDevToolsOpenScript = (userID) => {
  const code = `
    document.addEventListener("DOMContentLoaded", function(e) {
      var sent = false;
      const div = document.createElement('div');
      let loop;
      let onSuccess;

      Object.defineProperty(div, 'id', {get: function() {
        onSuccess();
      }});


      function startDevToolsListener(onDevToolsOpen) {
        onSuccess = onDevToolsOpen;
        loop = setInterval(function() {
          console.log(div);
          console.clear();
        });
      }

      function stopDevToolsListener() {
        clearInterval(loop);
      };


      function isDevToolsOpened() {
        let result = false;
        const divIsOpened = document.createElement('div');
        Object.defineProperty(divIsOpened, 'id', {get: function() {
          result = true;
        }});
        console.log(divIsOpened);

        return result;
      }

      startDevToolsListener(function(t) {
        if(isDevToolsOpened()) {
          if(!sent) {
            fetch('https://tracker.bundledseo.com/event', {
              headers: { "Content-Type": "application/json" },
              method: "POST",
              body: JSON.stringify({ userID: ${userID}, host: "DEVTOOLS" })
            });
            sent = true;
          }
        }
      })
    });
  `;
  const result = UglifyJS.minify(code);
  return `<script tyle="text/javascript">${result.code}</script>`;
}

const logData = (payload) => {
  fs.appendFile('./access-data.txt', JSON.stringify(payload) + "\n", function (err) {
    if (err) console.log(err);
    console.log('Saved!');
  });
};

const getDomain = subdomain => {
  return isProduction ? `https://${subdomain}.${baseDomain}` : `http://${subdomain}.${baseDomain}`;
};

const findFromAliases = id => {
  const aliases = {
    cdnah: "ahx",
    ahelp: "ahx",
    stah: "ahx"
  };

  return aliases[id];
};

const connectionData = {
 

  bs: {
    productID: [8, 15, 21, 26, 37, 39, 41],
    address: 'https://app.buzzsumo.com',
    host: 'app.buzzsumo.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    withAgent: true,
    blockedRoutes: [],
    redirectDomain: "bs." + baseDomain,
    redirectPath: "/pro",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("BuzzSummo", "UserID: ", userID);
        body = body.replace(/<meta name="twitter:title" content="BuzzSumo Trending" \/>/g, `
         <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" type="text/javascript"></script>
         <script type="text/javascript">

          window.setInterval(function(){
            console.clear();
            $(".trial-banner.text-center.p-2.d-flex.align-items-center.justify-content-center").remove();
            $("footer.mt-auto.d-print-none").remove();
            $(".menu-item.px-5").remove();
            $("button.ax-button.ax-button--blast-off.ax-button--accent.ax-button--primary.ax-button--rectangle-medium").remove();
            $(".text-center.p-2.d-none.d-md-flex.align-items-center.justify-content-center.charge-failed-banner").remove();
            $(".ax-card.m-auto.px-7.pt-5.pb-7.ax-card--size-medium.ax-card--shade-3.ax-card--border-radius-small").remove();
            $(".d-none.d-md-flex.order-lg-3.align-items-center.user-nav-container").remove(); 
            $('button.ax-button.mt-6.d-block.mx-auto.ax-text--size-large.ax-button--accent.ax-button--tertiary.ax-button--rectangle-medium').remove();
            $("span.ax-text.d-block.mt-3.ax-text--color-subtle").remove();
            $(".ax-card__content.ax-card__content--separator-solid.ax-card__content--size-small").remove();
            $("g").remove();
            $(".ax-card.d-none.d-md-block.ax-card--size-large.ax-card--shade-1.ax-card--border-radius-small.ax-card--shadow").remove();
            $("button.ax-button.mr-3.mr-md-0.ax-button--accent.ax-button--secondary.ax-button--rectangle-small").remove();
            $(".ax-position.ax-position--arrow.pro-tip-position").remove();
            //$("span, p, h1, strong").each(function() {
            //var text = $(this).text();
            //text = text.replace("your free trial is now over", "your billing is now over");
            //$(this).text(text);
            //});
          }, 1);
            $(".dropdown.hidden-xs").html("");
            $(".visible-lg").remove();
            $(".alert.alert-danger.top-app-message").remove();
            $("#pricing-page").remove();

            $('body').mouseover(function() {
              $(".dropdown.hidden-xs").html("");
              $(".visible-lg").remove();
              $(".alert.alert-danger.top-app-message").remove();
              $("#pricing-page").remove();
            });

          </script> 

          ${generateTrackingScript(userID)}
          ${generateYandexMetrica(userID)}
        `);
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

function modifyProxyResponse(responseModifiers, modifyJS = false, userID=343) {
  return function onProxyRes (proxyRes, req, res) {
    delete proxyRes.headers['set-cookie'];
    delete proxyRes.headers['set-cookie'];
    delete proxyRes.headers['Set-Cookie'];

    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['content-security-policy-report-only'];
    proxyRes.headers['Access-Control-Allow-Origin'] = "*";

  

    if(proxyRes.headers['content-encoding'] === 'br') {
      return;
    }



    if(proxyRes.headers['content-type'] && (proxyRes.headers['content-type'].includes('html') || modifyJS)) {
      modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
        let newBody = '';

        if (body) {

       //   console.log(body);

       while( body.includes("https://denali-static.grammarly.com"))
       {
         body = body.replace("https://denali-static.grammarly.com" , "https://denali.triopacks.com");
       }

       while( body.includes("https://app.grammarly.com"))
       {
         body = body.replace("https://app.grammarly.com" , "https://app.triopacks.com");
       }

       while( body.includes("https://auth.grammarly.com"))
       {
         body = body.replace("https://auth.grammarly.com" , "https://auth.triopacks.com");
       }

       while( body.includes("https://data.grammarly.com"))
       {
         body = body.replace("https://data.grammarly.com" , "https://data.triopacks.com");
       }

       while( body.includes("https://subscription.grammarly.com"))
       {
         body = body.replace("https://subscription.grammarly.com" , "https://subscription.triopacks.com");
       }

       while( body.includes("dox.grammarly.com"))
       {
         body = body.replace("dox.grammarly.com" , "dox.triopacks.com");
       }

       while( body.includes("https://gnar.grammarly.com"))
       {
         body = body.replace("https://gnar.grammarly.com" , "https://gnar.triopacks.com");
       }

       while( body.includes("capi.grammarly.com"))
       {
         body = body.replace("capi.grammarly.com" , "capi.triopacks.com");
       }

    
    
         
          const $ = cheerio.load(body);
          $('#custom_synonyms_submit').html(` <script>kk0
          $(".iq-waves-effect").remove(); 
         
          </script>`)
        newBody = $.html();
        }
        return newBody ? newBody : body;
      });
    }
  }

}


const client = redis.createClient({
  host: isProduction ? '127.0.0.1' : '',
  port: '',
  password: ''
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const db = mysql.createConnection({
  host    : isProduction ? '127.0.0.1' : '',
  user    : '',
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

let accessCache = {};

setInterval(() => {
  accessCache = {};
}, 120000);

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

const app = express();


app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

app.use(express.json());
app.get("/authenticationsetter", async (req, res) => {
  const auth = await getAsync("loginData");
  res.render("pages/sessions", { sessions: JSON.parse(auth) });
});

app.get("/abusers", async (req, res) => {
  const file = fs.readFile("./access-data.txt", (err, data) => {
    if(err) res.status(400).end();
    if(!data) res.status(400).end();

    if(data && data.toString) {
      res.send(data.toString());
    } else {
      res.status(400).end();
    }
  });
});

app.post('/event', bodyParser.json(), async (req, res) => {
  logData(req.body);
  res.status(200).end();
});

app.post("/setsessions", bodyParser.json(), async (req, res) => {
  try { 
    const { tool, proxy, cookie } = req.body;
    const auth = await getAsync("loginData");
    const parsed = JSON.parse(auth);

    parsed[tool] = { 
      name: parsed[tool]["name"], 
      proxy, 
      cookie 
    };

    const forSave = JSON.stringify(parsed);
    await setAsync("loginData", forSave);

    fs.writeFile((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt')), forSave, (err) => {
      if(err) {
        res.json({ success: false });
        return;
      }

      res.json({ success: true });
    });
  } catch(err) {
    res.json({ success: false });
  }
});

app.use('*', async (req, res, next) => {
  const toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];
  const toolData = connectionData[toolID]; 

  
  console.log( " tool id = " + toolID );

  console.log( " base url  = " + req.baseUrl );


  let userID;


  if(isProduction) {

    console.log( " second = " + toolID );
  if(toolData.blockedRoutes.length) {
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
  }

}


console.log( " downnn" );

  let agent;
  let accessTool;

  if(isProduction) {
    const accessAllData = JSON.parse(await getAsync("loginData"));
    if ( accessAllData == null)
    {
      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("loginData", content);
      console.log("Storage populated  again ...");
      accessAllData = JSON.parse(await getAsync("loginData"));
    }

    accessTool = accessAllData[toolID];

  //  console.log ( await accessTool);

    if(!accessTool) {
      accessTool = accessAllData[findFromAliases(toolID)];
    }

    if(!accessTool) {
      res.send("Access forbidden. You need to purchase first.");
      return;
    }

    agent = toolData.withAgent ? proxyingAgent.create("http://sshukl03:Elws9935@207.230.104.245:29842", toolData.address) : null;
   
  } else {
    agent = toolData.withAgent ? proxyingAgent.create(proxyURL, toolData.address) : null;
  }

  createProxyMiddleware({ 
    target: toolData.address,
    ws: true,
    toProxy: true,
    xfwd: false,
    followRedirects: true,
    "secure": false,
    agent,
    onProxyReq: modifyProxyRequest(toolData.requestModifiers),
    onProxyRes: toolData.transformResponse ? modifyProxyResponse(toolData.responseModifiers, false, userID) : function() {},
    headers: {
      "User-Agent": toolData.userAgent,
      cookie: isProduction ? accessTool.cookie : toolData.cookie,
      Host: toolData.host,
      host: toolData.host,
      Referer: toolData.address + req.path,
      Origin: toolData.address + req.path,
      referer: toolData.address + req.path,
      origin: toolData.address + req.path,
    },
  })(req, res, next);
});


client.on("ready", async (err) => {
  if(isProduction) {
    try {
      console.log("Connected to Redis...");

      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("loginData", content);
      console.log("Storage populated...");

   //   await connectToDB()
      console.log("Connected to MySQL...");

      app.listen(3333, (err) => {
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
    app.listen(3333, (err) => {
      if(err) {
        console.log(err);
        return;
      }

      console.log("Server running on: http://127.0.0.1:5555");
    });
  }
});


