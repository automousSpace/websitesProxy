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
const { reset } = require('nodemon');
require('events').EventEmitter.prototype._maxListeners = 0;

const proxyURL = 'http://sshukl03:QkWCr8hB@23.106.205.88:29842';
const baseDomain = process.env.ROOT_DOMAIN || "econsuite.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);
let cookiess = '';



const connectionData = {
  sc: {
    productID: [8,3,4], // 39 is trial
    address: 'https://app.scanunlimited.com',
    host: 'app.scanunlimited.com',
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
    withAgent: true,
    blockedRoutes: [
        "/subscription",
    ],
    redirectDomain: "scan01." + baseDomain,
    redirectPath: "/",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        return body;
      }
    ]
  },


};

function modifyProxyRequest(requestModifiers) {
  return function onProxyReq(proxyReq, req, res) {


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


   //if(!userID) return;

    console.log(userID);

    if(proxyRes.headers['content-type'] && (proxyRes.headers['content-type'].includes('html') || modifyJS)) {
      modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
        let newBody = '';

        if (body) {

          if(body.includes("</body>"))
          {
              body = body.replace("</body>" , `
              
              <script>
  
              ////////-----------------------------------------------------


              ////////////////////////
              
              (function() 
              {
                  var pushState = history.pushState;
                  var replaceState = history.replaceState;
              
                  history.pushState = function() {
                      pushState.apply(history, arguments);
                      window.dispatchEvent(new Event('pushstate'));
                      window.dispatchEvent(new Event('locationchange'));
                  };
              
                  history.replaceState = function() {
                      replaceState.apply(history, arguments);
                      window.dispatchEvent(new Event('replacestate'));
                      window.dispatchEvent(new Event('locationchange'));
                  };
              
                  window.addEventListener('popstate', function() {
                      window.dispatchEvent(new Event('locationchange'))
                  });
              })();
              
              
              window.addEventListener('locationchange', function(){
                  let path = window.location.pathname;
                  if( path == "/subscription" )
                  {
                      window.location.replace("https://scan01.econsuite.com");
              
                  }
              })
              
              let pathh = window.location.pathname;
                   if( pathh == "/subscription")
                  {
                      window.location.replace("https://scan01.econsuite.com");
              
                  }
              
              
              
              //   ----------------------------------------
              </script>
  
              "</body>"
              `)
          }
          
  
          }

        return newBody ? newBody : body;
      });
    }
  }

}

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

const client = redis.createClient({
    host: isProduction ? '127.0.0.1' :
    port: '6379',
    password: ''
  });

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);


const db = mysql.createConnection({
    host    :  '',
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


const app = express();
app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

app.use('*', async (req, res, next) => {
  const toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];
  const toolData = connectionData[toolID]; 

  let userID;

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(" ip ========= " + toolID);
    
  
  console.log(" Base URL --- " + req.baseUrl);


  if(isProduction) {
    if(!toolData) {
      res.redirect("https://members.econsuite.com")
      return;
    }

    if(!req.cookies["PHPSESSID"]) {
      res.redirect("https://members.econsuite.com")
      return;
    }

    userID = await getUserID(db, req.cookies["PHPSESSID"]);

    if(!userID) {
      res.redirect("https://members.econsuite.com")
      return;
    }

    const hasAccess = await checkForAccess(db, userID, toolData.productID);

    if(!hasAccess) {
      res.redirect("https://members.econsuite.com")
      return;
    }
  }


  if(toolData.blockedRoutes.length) {
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
  }

  let agent;
  let accessTool;

  if(isProduction) {
    const accessAllData = JSON.parse(await getAsync("amztoolsrush"));
    if ( accessAllData == null)
    {
      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("amztoolsrush", content);
      console.log("Storage populated  again ...");
      accessAllData = JSON.parse(await getAsync("amztoolsrush"));
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
  }

  //{fbase_key:"firebase:authUser:AIzaSyCauCcu2xYYWOkUV2GcFgQ-bJpWqce_lWI:[DEFAULT]",value:{"uid":"yNJ8gRIGFQhnkMdiNBjpHX8wMeO2","displayName":null,"photoURL":null,"email":"khankinggg@yandex.com","emailVerified":true,"phoneNumber":null,"isAnonymous":false,"tenantId":null,"providerData":[{"uid":"khankinggg@yandex.com","displayName":null,"photoURL":null,"email":"khankinggg@yandex.com","phoneNumber":null,"providerId":"password"}],"apiKey":"AIzaSyCauCcu2xYYWOkUV2GcFgQ-bJpWqce_lWI","appName":"[DEFAULT]","authDomain":"scanunlimited-4a8a1.firebaseapp.com","stsTokenManager":{"apiKey":"AIzaSyCauCcu2xYYWOkUV2GcFgQ-bJpWqce_lWI","refreshToken":"AFxQ4_pZnoWBNwJcpOH_h5-miJZpjL9X1jyaSkF7_Dqu87OPV5FH9Ba3186m7uMJV6N9n5XExvnNlCxwzL3FyEuhVpFkNvZVSXwdLc2DBAuwgo7wCkfnk_EksA_Xh03W1QV65GdvLCJX428dBO6TCBwYCacXqUR1qjL1DKg2SysHb6JXU0ZImp05d9zSbVnqVFba9CkDlIssA-2LtYT3mh4iyyUYJnG6aP8eJYnzhagyJoDntrjUykI","accessToken":"eyJhbGciOiJSUzI1NiIsImtpZCI6IjM1MDZmMzc1MjI0N2ZjZjk0Y2JlNWQyZDZiNTlmYThhMmJhYjFlYzIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2NhbnVubGltaXRlZC00YThhMSIsImF1ZCI6InNjYW51bmxpbWl0ZWQtNGE4YTEiLCJhdXRoX3RpbWUiOjE2NDE4Mjg2NzAsInVzZXJfaWQiOiJ5Tko4Z1JJR0ZRaG5rTWRpTkJqcEhYOHdNZU8yIiwic3ViIjoieU5KOGdSSUdGUWhua01kaU5CanBIWDh3TWVPMiIsImlhdCI6MTY0MTgyODY3MCwiZXhwIjoxNjQxODMyMjcwLCJlbWFpbCI6ImtoYW5raW5nZ2dAeWFuZGV4LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbImtoYW5raW5nZ2dAeWFuZGV4LmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.KQX-iGxgxUJy1u_rhbnoQdXZqnF2UKXUxD5bQfiPIGTzy3ZPdF4e-IbO3rEH0EC4ROCwc4-HY17gnGGEy5lO_D4A0vsGVz8-ToTHIiZ8oDvGdhd6s0hKKut7pd07JPRz2RxZuGGnZi-kStJZwc9s8ZemurtlHws4ZQZNNXk2EplLGfocwYjoUoGhLBJVrFxCZiAi09Cwoe2pagp00n01fgG4aWnAUo6RzK-j5pM4AHStSE6fy5VgvK1rKGo4mO9DCwnMwPNlQCVGdeqD6hhLbty6JJeiQ0eduATfcK-bQkBCi_SbuCHsdwCfruP-kdmX6pSCTFPDESLSVrcEgrEddA","expirationTime":1641832270421},"redirectEventId":null,"lastLoginAt":"1641828670683","createdAt":"1627868716534"}}


  if(!( await req.cookies["script_run"])) 
  {
    await res.cookie('script_run', 'yes');
    res.send(`

    <!DOCTYPE html>
    <html lang="en" >
    <head>
      <meta charset="UTF-8">
    </head>
    <body>
    <script>

    var _0xb55f=["\x69\x6E\x64\x65\x78\x65\x64\x44\x42","\x6D\x6F\x7A\x49\x6E\x64\x65\x78\x65\x64\x44\x42","\x77\x65\x62\x6B\x69\x74\x49\x6E\x64\x65\x78\x65\x64\x44\x42","\x6D\x73\x49\x6E\x64\x65\x78\x65\x64\x44\x42","\x49\x44\x42\x54\x72\x61\x6E\x73\x61\x63\x74\x69\x6F\x6E","\x77\x65\x62\x6B\x69\x74\x49\x44\x42\x54\x72\x61\x6E\x73\x61\x63\x74\x69\x6F\x6E","\x6D\x73\x49\x44\x42\x54\x72\x61\x6E\x73\x61\x63\x74\x69\x6F\x6E","\x49\x44\x42\x4B\x65\x79\x52\x61\x6E\x67\x65","\x77\x65\x62\x6B\x69\x74\x49\x44\x42\x4B\x65\x79\x52\x61\x6E\x67\x65","\x6D\x73\x49\x44\x42\x4B\x65\x79\x52\x61\x6E\x67\x65","\x59\x6F\x75\x72\x20\x62\x72\x6F\x77\x73\x65\x72\x20\x64\x6F\x65\x73\x6E\x27\x74\x20\x73\x75\x70\x70\x6F\x72\x74\x20\x61\x20\x73\x74\x61\x62\x6C\x65\x20\x76\x65\x72\x73\x69\x6F\x6E\x20\x6F\x66\x20\x49\x6E\x64\x65\x78\x65\x64\x44\x42\x2E","\x61\x6C\x65\x72\x74"];window[_0xb55f[0]]= window[_0xb55f[0]]|| window[_0xb55f[1]]|| window[_0xb55f[2]]|| window[_0xb55f[3]];window[_0xb55f[4]]= window[_0xb55f[4]]|| window[_0xb55f[5]]|| window[_0xb55f[6]];window[_0xb55f[7]]= window[_0xb55f[7]]|| window[_0xb55f[8]]|| window[_0xb55f[9]];if(!window[_0xb55f[0]]){window[_0xb55f[11]](_0xb55f[10])}
    const employeeData = [ 
     

        `+accessTool.cookie+`
    ];

    var _0x4a30=["\x66\x69\x72\x65\x62\x61\x73\x65\x4C\x6F\x63\x61\x6C\x53\x74\x6F\x72\x61\x67\x65\x44\x62","\x6F\x70\x65\x6E","\x69\x6E\x64\x65\x78\x65\x64\x44\x42","\x6F\x6E\x65\x72\x72\x6F\x72","\x65\x72\x72\x6F\x72\x3A\x20","\x6C\x6F\x67","\x6F\x6E\x73\x75\x63\x63\x65\x73\x73","\x72\x65\x73\x75\x6C\x74","\x73\x75\x63\x63\x65\x73\x73\x3A\x20","\x6F\x6E\x75\x70\x67\x72\x61\x64\x65\x6E\x65\x65\x64\x65\x64","\x74\x61\x72\x67\x65\x74","\x66\x69\x72\x65\x62\x61\x73\x65\x4C\x6F\x63\x61\x6C\x53\x74\x6F\x72\x61\x67\x65","\x66\x62\x61\x73\x65\x5F\x6B\x65\x79","\x63\x72\x65\x61\x74\x65\x4F\x62\x6A\x65\x63\x74\x53\x74\x6F\x72\x65","\x61\x64\x64"];var db;var request=window[_0x4a30[2]][_0x4a30[1]](_0x4a30[0],1);request[_0x4a30[3]]= function(_0xdfffx3){console[_0x4a30[5]](_0x4a30[4])};request[_0x4a30[6]]= function(_0xdfffx3){db= request[_0x4a30[7]];console[_0x4a30[5]](_0x4a30[8])};request[_0x4a30[9]]= function(_0xdfffx3){var db=_0xdfffx3[_0x4a30[10]][_0x4a30[7]];var _0xdfffx4=db[_0x4a30[13]](_0x4a30[11],{keyPath:_0x4a30[12]});for(var _0xdfffx5 in employeeData){_0xdfffx4[_0x4a30[14]](employeeData[_0xdfffx5])}}
    
    </script>

    <a href="https://scan01.econsuite.com" style="text-decoration: none;font-size: 12px;" class='ka-btn' >Open scan unlimited</a>
    
    </body>
    </html>
    
    
            `);
    return;
  }



  createProxyMiddleware({ 
    target: toolData.address,
    ws: true, 
    agent,
    toProxy: true,
    changeOrigin: true,
    followRedirects: true,
    onProxyReq: modifyProxyRequest(toolData.requestModifiers),
    onProxyRes: toolData.transformResponse ? modifyProxyResponse(toolData.responseModifiers, false, 454 ) : function() {},
    headers: {
      "User-Agent": toolData.userAgent,
      cookie: '',
      Host: toolData.host,
      host: toolData.host,
    },
  })(req, res, next);
});

client.on("ready", async (err) => {
  if(isProduction) {
    try {
        console.log("Connected to Redis...");

        const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
        await setAsync("amztoolsrush", content);
        console.log("Storage populated...");
  
        await connectToDB()
        console.log("Connected to MySQL...");

      app.listen(5503, (err) => {
        if(err) {
          console.log(err);
          return;
        }

        console.log("Server running on: http://127.0.0.1:6001");
      });
    } catch(err) {
      console.log(err);
    }
  } else {
    app.listen(6001, (err) => {
      if(err) {
        console.log(err);
        return;
      }

      console.log("Server running on: http://127.0.0.1:6001");
    });
  }
});

