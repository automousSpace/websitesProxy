const fs = require('fs');
const { promisify } = require('util');

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
const cheerio = require('cheerio');
const minify = require('html-minifier').minify;
const UglifyJS = require('uglify-js');
const proxyURL = 'http://sshukl03:QkWCr8hB@23.106.205.88:29842';
const baseDomain = process.env.ROOT_DOMAIN || "bundledseo.com";
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);
var cookie = "";
var token = "";
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

    wa: {
        productID: [9, 15, 21, 27, 36, 37, 39, 40, 41],
        address: 'https://wai.vipseotools.com',
        host: 'wai.vipseotools.com',
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
        withAgent: true,
        blockedRoutes: [
          '',
          '/',
          '/users/affiliate.php',
          '/users/account.php',
          '/users/filemanager.php',
          '/users/api.php',
          '/users/contact.php',
          '/blog',
          '/users/logout.php',
          '/account',
          '/home',
          '/saved_articles',
          '/bulk_rewrite',
          '/api',
          '/usages',
          '/affiliate',
        ],
        redirectDomain: "wai." + baseDomain,
        redirectPath: "/rewrite",
        requestHeaderModifiers: [],
        responseHeaderModifiers: [],
        transformResponse: true,
        responseModifiers: [
          function(body, userID) {
            console.log("WordAI", "UserID: ", userID);
            body = body.replace(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/g, 'private@email.com');
            body = body.replace(/Update for all future articles/, `
            <script>
              $(".footer").remove();
              $(".subfooter").remove();
              $(".Embed").remove();
              $("header").html("<div class='container clearfix'><div class='one-third column clearfix'><div class='logo'><a href='https://wa.bundledseo.com/turing.php'><img src='https://wordai.com/img/logo-word-ai-full.png' alt='via BundledSEO'></a></div></div><div class='two-thirds column clearfix'><div class='subheader'><ul class='sf-menu l_tinynav1 sf-js-enabled sf-shadow'><li></li><li><a href='https://bundledseo.com/' target='_blank'>BundledSEO</a></li><li><a href='https://wa.bundledseo.com/turing.php'>Tuning Spinner</a></li><li><a href='https://wa.bundledseo.com/foreignlanguage.php'>Foreign Language Spinner</a></li></ul></div></div></div>");
              $("input:image").remove();
    
              $('body').mouseover(function() {
                  console.clear();
                  $('a[href$="turing-bulk.php"]').remove();
                  $(".footer").remove();
                  $(".subfooter").remove();
                  $(".Embed").remove();
                  $("header").html("<div class='container clearfix'><div class='one-third column clearfix'><div class='logo'><a href='https://wa.bundledseo.com/turing.php'><img src='https://wordai.com/img/logo-word-ai-full.png' alt='via BundledSEO'></a></div></div><div class='two-thirds column clearfix'><div class='subheader'><ul class='sf-menu l_tinynav1 sf-js-enabled sf-shadow'><li></li><li><a href='https://bundledseo.com/' target='_blank'>BundledSEO</a></li><li><a href='https://wa.bundledseo.com/turing.php'>Tuning Spinner</a></li><li><a href='https://wa.bundledseo.com/foreignlanguage.php'>Foreign Language Spinner</a></li></ul></div></div></div>");
                  $("input:image").remove();
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
    delete req.headers['access-control-allow-origin'];
    delete req.headers['access-control-allow-credentials'];
    delete req.headers['access-control-allow-headers'];
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
  
  }
}

function modifyProxyResponse(responseModifiers, modifyJS = false, userID) {
  return function onProxyRes (proxyRes, req, res) {
    delete proxyRes.headers['set-cookie'];
    delete proxyRes.headers['Set-Cookie'];
    delete proxyRes.headers['content-length'];

    if(proxyRes.headers['content-encoding'] === 'br') {
      return;
    }

        if(proxyRes.headers['content-encoding'] === 'deflate') {
      console.log("here 222");
      return;
    }


    if(!userID) return;

    console.log(userID);

    if(proxyRes.headers['content-type'] && (proxyRes.headers['content-type'].includes('html') || modifyJS)) {
      modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {

        if (body) {

          if(body.includes("</body>"))
          {
            body = body.replace( "</body>" , `

            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
            <script>
            
            $(document).ready(function(){
             
              $('a[href="/affiliate"]').remove();
              $('a[href="/usages"]').remove();
              $('a[href="/api"]').remove();
              $('a[href="/bulk_rewrite"]').remove();
              $('a[href="/saved_articles"]').remove();
              $('a[href="https://wordai.zendesk.com/hc/en-us"]').remove();
       //       $('button[data-target="#af_modal"]').remove();
              $('.line-height').remove();
              $('#launcher').remove();
              setTimeout(function(){ $('#launcher').remove(); }, 3000);
              
            });

          </script> </body>`)
          }
            
        }

        return body;
      });
    }
  }

}

const client = redis.createClient({
  
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const db = mysql.createConnection({
  
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

app.use(bodyParser.urlencoded({
  extended: true
}));

/**bodyParser.json(options)
* Parses the text as JSON and exposes the resulting object on req.body.
*/
app.use(bodyParser.json());

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
  let toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];


  const toolData = connectionData[toolID]; 
  
  let userID;

  
  req.headers.host = "wai.wordai.com";
  req.headers.origin = "https://wai.wordai.com";


  if(isProduction) {
    if(!toolData) {
      res.send("Access forbidden. 1");
      return;
    }

    if(!req.cookies["PHPSESSID"]) {
      res.send("Access forbidden. 2");
      return;
    }

    userID = await getUserID(db, req.cookies["PHPSESSID"]);

    if(!userID) {
      res.send("Access forbidden. 3");
      return;
    }

    const hasAccess = await checkForAccess(db, userID, toolData.productID);

    if(!hasAccess) {
      res.send("Access forbidden. 4");
      return;
    }
  }


  if( req.baseUrl == "/create_job")
  {
    await next();
    return;

  }

  if( req.baseUrl == "/fetch_job_redis")
  {
    await next();
    return;

  }
  console.log( toolID );
  console.log("base ==" + req.baseUrl);


  if(isProduction) {

  if(toolData.blockedRoutes.length) {
  console.log(" in the block   ");
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
  }

}



  let accessTool;
  const accessAllData = JSON.parse(await getAsync("loginData"));
  if ( accessAllData == null)
  {
    const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
    await setAsync("loginData", content);
    console.log("Storage populated  again ...");
    accessAllData = JSON.parse(await getAsync("loginData"));
  }

  accessTool = accessAllData[toolID];
  let accessTool2 = accessAllData["wordai"];
  cookie = accessTool.cookie;
  token = accessTool2.cookie;



req.headers.host = await "wordai.com";


  let agent;

  if(isProduction) {

    agent = toolData.withAgent ? proxyingAgent.create(accessTool.proxy, toolData.address) : null;
  } else {
    agent = toolData.withAgent ? proxyingAgent.create(proxyURL, toolData.address) : null;
  }


  createProxyMiddleware({ 
    target: toolData.address,
    ws: true, 
    toProxy: true,
    changeOrigin: true,
    "secure": false,
    xfwd: false,
    agent,
    followRedirects: true,
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

// res.write(content);
});


app.post("/fetch_job_redis",  async(request, response) => {
  console.log("fetch job ->>>>>>>>>>>>>>>>>>>>>>>");

  const https = require('https')
  const qs = require('qs');
  

   
  let bodyData = qs.stringify(request.body);
  console.log(bodyData);
  
  
  
  const options = {
   hostname: 'wai.vipseotools.com',
   path: '/fetch_job_redis',
   method: 'POST',
   headers: {
    //   'X-Requested-With': 'XMLHttpRequest',
    // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    // 'origin': 'https://wai.wordai.com', 
    // 'accept': 'application/json, text/javascript, */*; q=0.01',
    // 'x-csrf-token': token,
    // 'cookie' : cookie,
    'referer': 'https://wai.vipseotools.com/rewrite',
  }
  }
  
  const req =  https.request(options, async res => {
     console.log(`statusCode of event  :  ${ res.statusCode}`)
   if(res.statusCode == 200)
   {
     
   }
   var contents = "";
   res.on('data', async d => {
     //process.stdout.write(d)
     contents += d;

   })

   res.on('end', async() => {
   // console.log(contents);
    if(res.statusCode == 200)
    { 
     await response.setHeader("set-cookie" ,res.headers['set-cookie'])
     await response.setHeader("Content-type" ,res.headers['content-type'])
     await response.setHeader("Date" ,res.headers['date'])
     await response.setHeader("ETag" ,res.headers['etag'])
    //  response.setHeader("Transfer-Encoding" ,res.headers['transfer-encoding'])
     await response.setHeader("X-Content-Type-Options" ,res.headers['x-content-type-options'])
     await response.setHeader("X-Download-Options" ,res.headers['x-download-options'])
     await response.setHeader("X-Frame-Options" ,res.headers['x-frame-options'])
     await response.setHeader("X-Permitted-Cross-Domain-Policies" ,res.headers['x-permitted-cross-domain-policies'])
     await response.setHeader("X-Request-Id" ,res.headers['x-request-id'])
     await response.setHeader("X-Runtime" ,res.headers['x-runtime'])
     await response.setHeader("X-XSS-Protection" ,res.headers['x-xss-protection'])
     await response.end(contents);
 
    }
  });
  })
  
  req.on('error', error => {
   console.error(error)
  })
  
  req.write(bodyData)
  req.end()
});

app.post("/create_job",  async(request, response) => {
  console.log("craeate job ->>>>>>>>>>>>>>>>>>>>>>>");

  const https = require('https')
  const qs = require('qs');
  

   
  let bodyData = qs.stringify(request.body);
  console.log(bodyData);
  
  
  
  const options = {
   hostname: 'wai.vipseotools.com',
   path: '/create_job',
   method: 'POST',
   headers: {
    'referer': 'https://wai.vipseotools.com/rewrite',
  //     'X-Requested-With': 'XMLHttpRequest',
  //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //   'origin': 'https://wai.wordai.com', 
  //   'accept': 'application/json, text/javascript, */*; q=0.01',
  //   'x-csrf-token': token,
  //   'cookie' : cookie,
    }
  }
  
  const req =  https.request(options, async res => {
     console.log(`statusCode of event  :  ${ res.statusCode}`)
   if(res.statusCode == 200)
   {
     
   }
  
   res.on('data', d => {
//     process.stdout.write(d)
  //    response.setHeader("set-cookie" ,res.headers['set-cookie'])
  //    response.setHeader("Content-type" ,res.headers['content-type'])
  //    response.setHeader("Date" ,res.headers['date'])
  //    response.setHeader("ETag" ,res.headers['etag'])
  // //   response.setHeader("Transfer-Encoding" ,res.headers['transfer-encoding'])
  //    response.setHeader("X-Content-Type-Options" ,res.headers['x-content-type-options'])
  //    response.setHeader("X-Download-Options" ,res.headers['x-download-options'])
  //    response.setHeader("X-Frame-Options" ,res.headers['x-frame-options'])
  //    response.setHeader("X-Permitted-Cross-Domain-Policies" ,res.headers['x-permitted-cross-domain-policies'])
  //    response.setHeader("X-Request-Id" ,res.headers['x-request-id'])
  //    response.setHeader("X-Runtime" ,res.headers['x-runtime'])
  //    response.setHeader("X-XSS-Protection" ,res.headers['x-xss-protection'])
     response.end(d);
   })
  })
  
  req.on('error', error => {
   console.error(error)
  })
  
  req.write(bodyData)
  req.end()
});

client.on("ready", async (err) => {
  if(isProduction) {
    try {
      console.log("Connected to Redis...");

      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("loginData", content);
      console.log("Storage populated...");

      await connectToDB()
      console.log("Connected to MySQL...");

      app.listen(5556, (err) => {
        if(err) {
          console.log(err);
          return;
        }

        console.log("Server running on: http://127.0.0.1:5556");
      });
    } catch(err) {
      console.log(err);
    }
  } else {
    app.listen(5556, (err) => {
      if(err) {
        console.log(err);
        return;
      }

      console.log("Server running on: http://127.0.0.1:5556");
    });
  }
});
