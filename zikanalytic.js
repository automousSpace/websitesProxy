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
const baseDomain = process.env.ROOT_DOMAIN || "bundledseo.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);
let cokiess = '';

const findFromAliases = id => {
  const aliases = {
    cdnah: "ahx",
    ahelp: "ahx",
    stah: "ahx"
  };

  return aliases[id];
};

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
  zik: {
    productID: [101,110],
    address: 'https://www.zikanalytics.com',
    origin : 'https://www.zikanalytics.com',
    referer : 'https://www.zikanalytics.com/',
    host: 'www.zikanalytics.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
        "",
        "/",
        "/User/UserSettings",
        "/Managesubscriptions",
        "/Index/LogOut"
    ],
    redirectDomain: "zik."+ baseDomain,
    redirectPath: "/Index",
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
    delete proxyRes.headers['Set-Cookie'];
    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['content-length'];
    proxyRes.headers['access-control-allow-origin'] = "zik.bundledseo.com";

    if(proxyRes.headers['content-encoding'] === 'br') {
      return;
    }

        if(proxyRes.headers['content-encoding'] === 'deflate') {
      console.log("here 222");
      return;
    }


  
   // console.log(userID);
    if(proxyRes.headers['content-type'] && (proxyRes.headers['content-type'].includes('html') || modifyJS)) {
      modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
        let newBody = '';

        

        if (body) {

          
          if(body.includes("</body>"))
          {
            body = body.replace( "</body>" , `
            

    
          <script>

          $(document).ready(function(){
           
            $('div[class="sidebarTrialTimer"]').remove();
            
          });

          </script>
          </body>
            
            `)

          }

          

   

      }

        return newBody ? newBody : body;
      });
    }
  }

}



const client = redis.createClient({

  });
  
  const getAsync = promisify(client.get).bind(client);
  const setAsync = promisify(client.set).bind(client);
  
  let accessCache = {};
  
  const db = mysql.createConnection({

    
  });

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

  req.headers['host'] = "www.zikanalytics.com";
  console.log( " base url  = " + req.baseUrl );
  if(req.headers['referer'])
  {
      let tmp = req.headers['referer'];
      tmp = tmp.replace('zik.bundledseo.com' , 'www.zikanalytics.com')
    req.headers['referer'] = tmp;
  //  console.log(tmp)
  }

  let userID;

  if(isProduction) {
    if(!toolData) {
      res.redirect("https://access.bundledseo.com");
      return;
    }

    if(!req.cookies["PHPSESSID"]) {
      res.redirect("https://access.bundledseo.com");
      return;
    }

    userID = await getUserID(db, req.cookies["PHPSESSID"]);

    if(!userID) {
      res.redirect("https://access.bundledseo.com");
      return;
    }

    const hasAccess = await checkForAccess(db, userID, toolData.productID);

    if(!hasAccess) {
      res.redirect("https://access.bundledseo.com");
      return;
    }
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

 // console.log("-------" + req.baseUrl + req.url);

//   if(req.baseUrl == "/Index/Index")
//   {
//     next();
//     return
//   }


console.log( " downnn" );

  let agent;
  let accessTool;

  if(isProduction) {
    var accessAllData = JSON.parse(await getAsync("loginData"));
    if ( accessAllData == null)
    {
      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("loginData", content);
      console.log("Storage populated  again ...");
      accessAllData = JSON.parse(await getAsync("loginData"));
    }

    accessTool = accessAllData[toolID];

    if(!accessTool) {
      accessTool = accessAllData[findFromAliases(toolID)];
    }

    if(!accessTool) {
      res.send("Access forbidden. You need to purchase first.");
      return;
    }

    cokiess = accessTool.cookie;
   // console.log(cokiess)
    agent = toolData.withAgent ? proxyingAgent.create(accessTool.proxy, toolData.address) : null;
    
  } 

  createProxyMiddleware({ 
    target: toolData.address,
    ws: true,
    toProxy: true,
    xfwd: false,
    agent,
    onProxyReq: modifyProxyRequest(toolData.requestModifiers),
    onProxyRes: toolData.transformResponse ? modifyProxyResponse(toolData.responseModifiers, false, userID) : function() {},
    headers: {
        host: 'www.zikanalytics.com',
        "user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36",
       cookie : accessTool.cookie,
       
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
  
        await connectToDB()
        console.log("Connected to MySQL...");
  
        app.listen(4027, (err) => {
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


app.get("/Index/Index",  async(request, response) => {

  console.log("subb ->>>>>>>>>>>>>>>>>>>>>>>");
  const https = require('https')
  const options = {
    hostname: 'www.zikanalytics.com',
    path: '/Index',
    method: 'GET',
    headers: {
        cookie : `ASP.NET_SessionId=5tnn3bufdpyotrljcxn03ver; initialTrafficSource=utmcsr=(direct)|utmcmd=(none)|utmccn=(not set); intercom-id-k4f6o3vw=ca282b5e-abab-460a-b078-cd65ef253829; UserAlready=true; no_tracky_101015410=1; __RequestVerificationToken=adppg_BeUehy4qXSC320KEO9WNyPByRlVDgIHwXr-cWzOFVGn8wAA85v5CMMyPvXA_N5oLwGlOpJe5-Xy581C2QNTAuJ_WTUgksEqhTYaa01; _ga=GA1.2.40784661.1644414396; _gid=GA1.2.473021451.1644414396; _gcl_au=1.1.208010113.1644414396; __utmzzses=1; _jsuid=2830833258; _clck=12wr6mx|1|eyu|0; _gat_UA-106774548-1=1; _zlc901285=zimYmuifvALijpJRsrK3vO0aGrvNfIOO6Vs7sxBXHexRuxKgY2i_O8o0oKnOSJa_UXoV-SilHtqm30vciXNvIHelGif66_ZkJX5I2hU_QRczExI8d5Sk8vcXzeGsKTHNMNHgPqQYZXVq0GYY2PcCEiSSL28V3Aqfa1_4740oNN7Ey8z8at0rxQGnJzJtc_2VX8AFBAHKTbg-pPuFfPJjidP3ItfXN_l-Pt7F0TbbCMeTOvgsplVUPitdhmhi5t9sbQG_V1HTolewSWyq1aAVV9xlsP9c75m4H4wi0LKJMVpr8Zq7erAXXx7rsb3T_PxB8NBJ2wpSYobgiaB9jx_P1rCS9x7tJvG3VXw8F-57zDHrMKLAtiOdST9-uRFNdqG261Hl9QQREEwUBQcsG2-qo_F6VHwOdvfyre-A8-1b7QurUxS9M8l1vbLTkHArODeGUIz8uZVPZnV1k2lYPjIYPbsYZQKl_6J1SjuYxre6D59_MIgrR6Zlci05KEQC-_3qP8ikGrySv4jgm9s_JJa6Iqovd70NCnq6KCKqD--kWJA; _first_pageview=1; intercom-session-k4f6o3vw=MzdFRERIdGhaeVdLODJjaTcxNSs3ZGxBR2MzR2plQzIvZEx4Yys0SHY3U1dzMmNJZkRmNEtGOXlJdVluRzNFQS0tOWxPVktJU0ovbDJxeTdiNGM2azFkUT09--8d37c9570c1f516b6bd3a2d810f14b6fb1bfcabf; cookie_consent_level=%7B%22strictly-necessary%22%3Atrue%2C%22functionality%22%3Atrue%2C%22tracking%22%3Atrue%2C%22targeting%22%3Atrue%7D; _uetsid=1131fee0899311ec8ce1fbe1266b35e2; _uetvid=11321170899311ec83b657573e39552c; _clsk=1feezb2|1644415535516|10|1|e.clarity.ms/collect; cdn.bluesnap.700000.ka.ck=8e2d2acd88d6a26e401ddc17c501d3e139353dd0f84f6b3061139c98ab1adbc0538a5a0d2ed2ba181fd05f81bdf1f6fe63ce8d90df6f8f19df7c22881d2dd54707d2ee50a504c3807e3cf31d11fd61e6da6310e2863102cc4a966495591fa898a746d2f04f3683727fd3dc92f950e3bf7ea87d0069037c8f93dbca75fcea8acf3bbdcafbe9d2e5ce25c9c8782d2611347caf83e2ae4adb5318de47`,
       
  }
  }

  const req = https.request(options,  res => {
  //  console.log(JSON.stringify(res.headers))
  console.log(`statusCode: ${res.statusCode}`)

  var contents = "";
  res.on('data', async d => {
    //process.stdout.write(d)
    contents += d;

  })

  res.on('end', async() => {
  // console.log(contents);
   if(res.statusCode == 200)
   { 

    response.setHeader("content-type", "text/html; charset=utf-8")
    response.setHeader("Access-Control-Allow-Credentials", "true")
    response.setHeader("access-control-allow-origin", "https://zik.bundledseo.com")

    response.send(contents);
   }
  });

  })


  req.on('error', error => {
  console.error(error)
  })

  req.end();


  
});


