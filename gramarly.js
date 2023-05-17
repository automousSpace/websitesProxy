
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
const cheerio = require('cheerio');
const { cookie } = require('request');
var token = "";
const baseDomain = process.env.ROOT_DOMAIN || "bundledseo.com" ;
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

const connectionData = {

  gramarly: {
    productID: [21,15,37,41,58,59],
    address: 'https://app.grammarly.com',
    host: 'app.grammarly.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: "gramarly." + baseDomain,
    redirectPath: "",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Grammerly", "UserID: ", userID);
        return body;
      }
    ]
  },

  denali: {
    productID: [21,15,37,41,58,59],
    address: 'https://denali-static.grammarly.com',
    host: 'denali-static.grammarly.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: "denali." + baseDomain,
    redirectPath: "",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Grammerly denali", "UserID: ", userID);
        return body;
      }
    ]
  },

  auth: {
    productID: [21,15,37,41,58,59],
    address: 'https://auth.grammarly.com',
    host: 'auth.grammarly.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: "auth." + baseDomain,
    redirectPath: "",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Grammerly auth", "UserID: ", userID);
        return body;
      }
    ]
  },

  data: {
    productID: [21,15,37,41,58,59],
    address: 'https://data.grammarly.com',
    host: 'data.grammarly.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: "data." + baseDomain,
    redirectPath: "",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Grammerly data", "UserID: ", userID);
        return body;
      }
    ]
  },

  gnar: {
    productID: [21,15,37,41,58,59],
    address: 'https://gnar.grammarly.com',
    host: 'gnar.grammarly.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: "gnar." + baseDomain,
    redirectPath: "",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Grammerly gnar", "UserID: ", userID);
        return body;
      }
    ]
  },

  dox: {
    productID: [21,15,37,41,58,59],
    address: 'https://dox.grammarly.com',
    host: 'dox.grammarly.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: "dox." + baseDomain,
    redirectPath: "",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Grammerly dox", "UserID: ", userID);
        return body;
      }
    ]
  },

  capi: {
    productID: [21,15,37,41,58,59],
    address: 'wss://capi.grammarly.com/freews',
    host: 'capi.grammarly.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: "dox." + baseDomain,
    redirectPath: "",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Grammerly dox", "UserID: ", userID);
        return body;
      }
    ]
  },

  flog: {
    productID: [21,15,37,41,58,59],
    address: 'wss://capi.grammarly.com/freews',
    host: 'capi.grammarly.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: "dox." + baseDomain,
    redirectPath: "",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Grammerly dox", "UserID: ", userID);
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
         body = body.replace("https://denali-static.grammarly.com" , "https://denali.bundledseo.com");
       }

       while( body.includes("https://app.grammarly.com"))
       {
         body = body.replace("https://app.grammarly.com" , "https://app.bundledseo.com");
       }

       while( body.includes("https://auth.grammarly.com"))
       {
         body = body.replace("https://auth.grammarly.com" , "https://auth.bundledseo.com");
       }

       while( body.includes("https://data.grammarly.com"))
       {
         body = body.replace("https://data.grammarly.com" , "https://data.bundledseo.com");
       }

       while( body.includes("https://subscription.grammarly.com"))
       {
         body = body.replace("https://subscription.grammarly.com" , "https://subscription.bundledseo.com");
       }

       while( body.includes("dox.grammarly.com"))
       {
         body = body.replace("dox.grammarly.com" , "dox.bundledseo.com");
       }

       while( body.includes("https://gnar.grammarly.com"))
       {
         body = body.replace("https://gnar.grammarly.com" , "https://gnar.bundledseo.com");
       }

       while( body.includes("capi.grammarly.com"))
       {
         body = body.replace("capi.grammarly.com" , "capi.bundledseo.com");
       }

      //  while( body.includes("f-log-editor.grammarly.com"))
      //  {
      //    body = body.replace("f-log-editor.grammarly.com" , "f-log-editor.bundledseo.com");
      //  }

      //  while( body.includes("f-log-editor.grammarly.io"))
      //  {
      //    body = body.replace("f-log-editor.grammarly.io" , "f-log-editor.bundledseo.com");
      //  }

    
    
         
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

var cookies = "";

app.use('*', async (req, res, next) => {
  const toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];
  const toolData = connectionData[toolID]; 

  let userID;
  
if(toolID == "gramarly")
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



  console.log( " tool id = " + toolID );

  console.log( " base url  = " + req.baseUrl );

  req.origin = "app.grammarly.com";

  if( req.baseUrl == "/events")
  {
    await next();
    return;

  }

  if( toolID == "auth")
  {
       await res.setHeader('Content-Type', 'application/json');
       await next();
       return;
  }

  if ( req.baseUrl == "/api/mimic/withProps" )
  {
    console.log("dataa ->>>>>>>>>>>>>>>>>>>>>>>");
    await res.setHeader('Content-Type', 'application/json');
    await next();
    return;
  }

  if ( req.baseUrl == "/api/v1/subscription" )
  {
    console.log("subsccc ->>>>>>>>>>>>>>>>>>>>>>>");
    await res.setHeader('Content-Type', 'application/json');
    await next();
    return;
  }




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
    let accessTool2 = accessAllData["dox"]; //getting token

    if(!accessTool) {
      res.send("Access forbidden. You need to purchase first.");
      return;
    }

    if( toolID == "gramarly")
    {
      cookies = accessTool.cookie;
      token = accessTool2.cookie;

    //  console.log("cookies " + cookies);
    //  console.log("token " + token);

    }
  

    agent = toolData.withAgent ? proxyingAgent.create(accessTool.proxy, toolData.address) : null;
  } else {
    agent = toolData.withAgent ? proxyingAgent.create(proxyURL, toolData.address) : null;
  }

 
  createProxyMiddleware({ 
    target: toolData.address,
    ws: true, 
    agent,
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

});


app.post("/events",  async(request, response) => {
    console.log("event ->>>>>>>>>>>>>>>>>>>>>>>");

    const https = require('https')

    // const CircularJSON = require('flatted');
    //   const json = CircularJSON.stringify(request.body);
  //    console.log("stringgg ->>>>>>>>>>>>>>>>>>>>>>>" +JSON.stringify(request.body));

    const data = (JSON.stringify(request.body));
   
   
   
   const options = {
     hostname: 'gnar.grammarly.com',
     path: '/events',
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'origin': 'https://app.grammarly.com', 
       'accepte': 'application/json',
       'x-client-type': 'denali_editor',
       'x-client-version': '1.5.43-3707+master',
       'x-container-id': 'vrsx6b84dn2t0j80',
       'x-csrf-token': token,
       'cookie' : cookies,
   }
   }
   
   const req = await https.request(options, async res => {
      await console.log(`statusCode of event  :  ${ res.statusCode}`)
     if(res.statusCode == 200)
     {
       
        response.setHeader("access-control-allow-credentials" ,"true")
        response.setHeader("access-control-allow-origin" ,"https://gramarly.bundledseo.com");
        await response.send("posted");
     }
   
     res.on('data', d => {
       process.stdout.write(d)
     })
   })
   
   req.on('error', error => {
     console.error(error)
   })
   
   req.write(data)
   req.end()
  });

app.get("/api/v1/subscription",  async(request, response) => {

    console.log("subb ->>>>>>>>>>>>>>>>>>>>>>>");
    const https = require('https')
    const options = {
    hostname: 'subscription.grammarly.com',
    path: '/api/v1/subscription',
    method: 'GET',
    headers: {
      'origin': 'https://app.grammarly.com', 
      'accepte': 'application/json',
      'x-client-type': 'denali_editor',
      'x-client-version': '1.5.43-3707+master',
      'x-container-id': 'vrsx6b84dn2t0j80',
      'x-csrf-token': token,
      'cookie' : cookies,
  }
    }

    const req = https.request(options,  res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data',  d => {
        response.send(d);
    })
    })


    req.on('error', error => {
    console.error(error)
    })

    req.end();
  });

app.get("/api/mimic/withProps", async(request, response) => {

    console.log("data ->>>>>>>>>>>>>>>>>>>>>>>");
    const https = require('https')
    const options = {
    hostname: 'data.grammarly.com',
    path: '/api/mimic/withProps',
    method: 'GET',
    headers: {
      'origin': 'https://app.grammarly.com', 
      'accepte': 'application/json',
      'x-client-type': 'denali_editor',
      'x-client-version': '1.5.43-3707+master',
      'x-container-id': 'vrsx6b84dn2t0j80',
      'x-csrf-token': token,
      'cookie' : cookies,
  } 
    }

    const req = https.request(options,  res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data',  d => {
        response.send(d);
    })
    })


    req.on('error', error => {
    console.error(error)
    })

    req.end();
  });

app.get("/v3/user",  async(request, response) =>{

    const https = require('https')
    const options = {
    hostname: 'auth.grammarly.com',
    path: '/v3/user?app=webeditor_chrome&field=sandbox.payments&field=frontend_role',
    method: 'GET',
    headers: {
        'origin': 'https://app.grammarly.com', 
        'accepte': 'application/json',
        'x-client-type': 'denali_editor',
        'x-client-version': '1.5.43-3707+master',
        'x-container-id': 'vrsx6b84dn2t0j80',
        'x-csrf-token': token,
        'cookie' : cookies,
    } 
    }

    const req = https.request(options,  res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data',  d => {
        response.end(d);
    })
    })


    req.on('error', error => {
    console.error(error)
    })

    req.end();
  });



client.on("ready", async (err) => {
  if(isProduction) {
    try 
    {
      console.log("Connected to Redis...");
      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("loginData", content);
      console.log("Storage populated...");

      await connectToDB()
      console.log("Connected to MySQL...");

      app.listen(3338, (err) => {
        if(err) {
          console.log(err);
          return;
        }

        console.log("Server running on: http://127.0.0.1:3338");
      });

    } catch(err) {
      console.log(err);
    }
  } else {
    app.listen(3338, (err) => {
      if(err) {
        console.log(err);
        return;
      }

      console.log("Server running on: http://127.0.0.1:3338");
    });
  }
});


