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
      fetch('https://tracker.toolshunter.com/event', {
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
            fetch('https://tracker.toolshunter.com/event', {
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

    quil: {
        productID: [80 , 15],
        address: 'https://quillbot.com',
        host: 'quillbot.com',
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
        cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
        withAgent: true,
        blockedRoutes: [
          "/",
          "/settings",
          "/help",
          "/contact",
        ],
        redirectDomain: "quil." + baseDomain,
        redirectPath: "",
        requestHeaderModifiers: [],
        responseHeaderModifiers: [],
        transformResponse: true,
        responseModifiers: [
          function(body, userID) {
            console.log("quilbot", "UserID: ", userID);
            if( body.includes("/manifest.json") )
            body = body.replace("/manifest.json" , "");
    
    
            
    
            // fs.appendFile("example_file.txt", body, (err) => {
            //   if (err) {
            //     console.log(err);
            //   }
            // });
            
            return body;
          }
        ]
      },

      rest: {
        productID: [79],
        address: 'https://rest.quillbot.com',
        host: 'rest.quillbot.com',
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
        cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
        withAgent: true,
        blockedRoutes: [
        ],
        redirectDomain: "rest." + baseDomain,
        redirectPath: "",
        requestHeaderModifiers: [],
        responseHeaderModifiers: [],
        transformResponse: true,
        responseModifiers: [
          function(body, userID) {
            console.log("rest QuilBot", "UserID: ", userID);
    
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
          let newBody = '';
  
          if (body) {
  
            while( body.includes("https://quillbot.com/") )
            {
                body = body.replace("https://quillbot.com/" , "https://quil.bundledseo.com/" );
            }
    
            while( body.includes("https://www.googletagmanager.com/gtm.js?id=") )
            {
                body = body.replace("https://www.googletagmanager.com/gtm.js?id=" , "" );
            }
    
            while( body.includes("https://www.googletagmanager.com/gtag/js") )
            {
                body = body.replace("https://www.googletagmanager.com/gtag/js" , "" );
            }
    
            while( body.includes("GTM-MJ377JJ") )
            {
                body = body.replace("GTM-MJ377JJ" , "" );
            }
    
            while( body.includes("https://cdn.amplitude.com/libs/amplitude-7.1.0-min.gz.js") )
            {
                body = body.replace("https://cdn.amplitude.com/libs/amplitude-7.1.0-min.gz.js" , "" );
            }
    
            
            while( body.includes("https://rest.quillbot.com") )
            {
                body = body.replace("https://rest.quillbot.com" , "https://rest.bundledseo.com" );
                console.log("link 2 found ---------------->>>>>>>>");
            }
            
    
     


          }
  
          return newBody ? newBody : body;
        });
      }
    }
  
  }

  const client = redis.createClient({
    host: isProduction ? '127.0.0.1' : 
    port: '6379',
    password: ''
  });

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const db = mysql.createConnection({
    host    : isProduction ? '127.0.0.1' :
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



  console.log( toolID );
  console.log("base ==" + req.baseUrl);
  if( toolID == "quil" )
  req.headers.host = "quillbot.com"

  const toolData = connectionData[toolID]; 
  
  let userID;

  if(toolID == "quil")
  {
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
  }
  





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
  // if ( accessAllData == null)
  // {
  //   const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
  //   await setAsync("loginData", content);
  //   console.log("Storage populated  again ...");
  //   accessAllData = JSON.parse(await getAsync("loginData"));
  // }

  accessTool = accessAllData[toolID];

  if(!( await req.cookies["script_run"]) && req.baseUrl =="") 
  {
    await res.cookie('script_run', 'yes');
 //   await res.cookie('dt', accessTool.cookie);
  //  console.log(accessTool.proxy )
    res.send(`

    <!DOCTYPE html>
    <html lang="en" >
    <head>
      <meta charset="UTF-8">
      <title>Jarvis</title>
      <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css'>
    <link rel="stylesheet" href="https://bundledseo.com/assests/stylle.css">
    <style >
      .style{
    
        display: inline;
        background-image: radial-gradient(circle farthest-corner at 0 0,#ff61d3 25%,#b318ff 45%,#00f0ff 65%,#3cf7a2 85%);
        /* text-transform: capitalize; */
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        
    }
    
    
    </style>
    </head>
    <body>
    <script>

    var _0xb55f=["\x69\x6E\x64\x65\x78\x65\x64\x44\x42","\x6D\x6F\x7A\x49\x6E\x64\x65\x78\x65\x64\x44\x42","\x77\x65\x62\x6B\x69\x74\x49\x6E\x64\x65\x78\x65\x64\x44\x42","\x6D\x73\x49\x6E\x64\x65\x78\x65\x64\x44\x42","\x49\x44\x42\x54\x72\x61\x6E\x73\x61\x63\x74\x69\x6F\x6E","\x77\x65\x62\x6B\x69\x74\x49\x44\x42\x54\x72\x61\x6E\x73\x61\x63\x74\x69\x6F\x6E","\x6D\x73\x49\x44\x42\x54\x72\x61\x6E\x73\x61\x63\x74\x69\x6F\x6E","\x49\x44\x42\x4B\x65\x79\x52\x61\x6E\x67\x65","\x77\x65\x62\x6B\x69\x74\x49\x44\x42\x4B\x65\x79\x52\x61\x6E\x67\x65","\x6D\x73\x49\x44\x42\x4B\x65\x79\x52\x61\x6E\x67\x65","\x59\x6F\x75\x72\x20\x62\x72\x6F\x77\x73\x65\x72\x20\x64\x6F\x65\x73\x6E\x27\x74\x20\x73\x75\x70\x70\x6F\x72\x74\x20\x61\x20\x73\x74\x61\x62\x6C\x65\x20\x76\x65\x72\x73\x69\x6F\x6E\x20\x6F\x66\x20\x49\x6E\x64\x65\x78\x65\x64\x44\x42\x2E","\x61\x6C\x65\x72\x74"];window[_0xb55f[0]]= window[_0xb55f[0]]|| window[_0xb55f[1]]|| window[_0xb55f[2]]|| window[_0xb55f[3]];window[_0xb55f[4]]= window[_0xb55f[4]]|| window[_0xb55f[5]]|| window[_0xb55f[6]];window[_0xb55f[7]]= window[_0xb55f[7]]|| window[_0xb55f[8]]|| window[_0xb55f[9]];if(!window[_0xb55f[0]]){window[_0xb55f[11]](_0xb55f[10])}
    const employeeData = [ 
     
     `+accessTool.proxy+`

    ];

    var _0x4a30=["\x66\x69\x72\x65\x62\x61\x73\x65\x4C\x6F\x63\x61\x6C\x53\x74\x6F\x72\x61\x67\x65\x44\x62","\x6F\x70\x65\x6E","\x69\x6E\x64\x65\x78\x65\x64\x44\x42","\x6F\x6E\x65\x72\x72\x6F\x72","\x65\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67","\x6F\x6E\x73\x75\x63\x63\x65\x73\x73","\x72\x65\x73\x75\x6C\x74","\x73\x75\x63\x63\x65\x73\x73\x3A\x20","\x6F\x6E\x75\x70\x67\x72\x61\x64\x65\x6E\x65\x65\x64\x65\x64","\x74\x61\x72\x67\x65\x74","\x66\x69\x72\x65\x62\x61\x73\x65\x4C\x6F\x63\x61\x6C\x53\x74\x6F\x72\x61\x67\x65","\x66\x62\x61\x73\x65\x5F\x6B\x65\x79","\x63\x72\x65\x61\x74\x65\x4F\x62\x6A\x65\x63\x74\x53\x74\x6F\x72\x65","\x61\x64\x64"];var db;var request=window[_0x4a30[2]][_0x4a30[1]](_0x4a30[0],1);request[_0x4a30[3]]= function(_0xdfffx3){console[_0x4a30[5]](_0x4a30[4])};request[_0x4a30[6]]= function(_0xdfffx3){db= request[_0x4a30[7]];console[_0x4a30[5]](_0x4a30[8])};request[_0x4a30[9]]= function(_0xdfffx3){var db=_0xdfffx3[_0x4a30[10]][_0x4a30[7]];var _0xdfffx4=db[_0x4a30[13]](_0x4a30[11],{keyPath:_0x4a30[12]});for(var _0xdfffx5 in employeeData){_0xdfffx4[_0x4a30[14]](employeeData[_0xdfffx5])}}
    
   </script>
    <!-- partial:index.partial.html -->
    <div class="ka-intro-block">
        <div class="content-wrapper">
          <h1 class="style" >All Done, QuilBot is Ready Now.</h1>
          <p style="color: #ebebeb; margin-top: 12px" >Tool provided by Bundledseo</p>
          <a href="https://quil.bundledseo.com/" style="text-decoration: none;" class='ka-btn' >Open QuilBot</a>
        </div>
    </div> <!-- .ka-intro-block -->
    
    
    
    </body>
    </html>
    
    
            `);
    return;
  }



  let agent;

  if(isProduction) {

    agent = toolData.withAgent ? proxyingAgent.create(accessTool.proxy, toolData.address) : null;
    if( toolID == "rest" )
    {
      req.headers['useridtoken'] = accessTool.proxy;
      agent = "";
    }
  } else {
    agent = toolData.withAgent ? proxyingAgent.create(proxyURL, toolData.address) : null;
  }

  createProxyMiddleware({ 
    target: toolData.address,
    ws: true, 
    toProxy: true,
    xfwd: false,
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




client.on("ready", async (err) => {
  if(isProduction) {
    try {
      console.log("Connected to Redis...");

     const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
     await setAsync("loginData", content);
      console.log("Storage populated...");

      await connectToDB()
      console.log("Connected to MySQL...");

      app.listen(5557, (err) => {
        if(err) {
          console.log(err);
          return;
        }

        console.log("Server running on: http://127.0.0.1:6004");
      });
    } catch(err) {
      console.log(err);
    }
  } else {
    app.listen(6005, (err) => {
      if(err) {
        console.log(err);
        return;
      }

      console.log("Server running on: http://127.0.0.1:6004");
    });
  }
});
