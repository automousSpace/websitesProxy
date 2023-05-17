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
const baseDomain = process.env.ROOT_DOMAIN || "amzfbatool.com" ;
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

const db = mysql.createConnection({
  host    :  '...222',
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
  kp1: {
    productID: [7,2,3,4],
    address: 'https://www.keepa.com',
    origin : 'https://keepa.com',
    referer : 'https://keepa.com/',
    host: 'keepa.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: baseDomain,
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
  dyn: {
    productID: [7,2,3,4],
    address: 'https://dyn.keepa.com',
    origin : 'https://keepa.com',
    referer : 'https://keepa.com/',
    host: 'dyn.keepa.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: baseDomain,
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
    delete proxyRes.headers['Set-Cookie'];
    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['content-length'];
    proxyRes.headers['access-control-allow-origin'] = "kep01.amzfbatool.com";

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
            body = body.replace("</body>",
            `
            <script>
            
            localStorage.setItem("token", "`+cokiess+`");
            </script>
            <script>

            
            $(window).on('hashchange', function() {
              if( window.location.hash == "#!channels" || window.location.hash == "#!settings/1" || window.location.hash == "#!api" )
              {
                window.location.replace("https://kep01.amzfbatool.com");
              }
            });
            if(  window.location.hash == "#!channels" || window.location.hash == "#!settings/1" || window.location.hash == "#!api" )
            {
              window.location.replace("https://kep01.amzfbatool.com");
            }
      
      
       
      
      
            function method_MutationObserver() {
              // $('#method').attr('class','new').text('MutationObserver');
              var observer12 = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
            
                  if ( mutation.type == 'childList' ) {
            
                    if (mutation.addedNodes.length >= 1) {
            
                      for (var i = 0; i < mutation.addedNodes.length; i++) {
            
                        $(mutation.addedNodes[i]).find('div').each(function(){
                       
                          let id = $(this).attr("id");
                          if(id == "userMenuPanel")
                          {
                           $(this).remove();
                          }
                        });
            
                      }
            
                    }
                  }
                });
              });
            
              var observerConfig = { childList: true };
              var observerConfig = { attributes: true, childList: true, characterData: true, subtree: true };
              var targetNode = document.body;
            
              observer12.observe(targetNode, observerConfig);
            }
            
      
             
      
           method_MutationObserver();
      
      
      
            </script>
        
            </body>
            `)
          }
      

        
          while(body.includes("https://keepa.com"))
          {
            body = body.replace("https://keepa.com","https://kep01.amzfbatool.com")
          }

          if(body.includes("//cdn.keepa.com/20220201/keepa.js"))
          {
            body = body.replace("//cdn.keepa.com/20220201/keepa.js","https://kep01.amzfbatool.com/kk7.js")
          }

          

   

      }

        return newBody ? newBody : body;
      });
    }
  }

}


const client = redis.createClient({
  host: isProduction ? '.0.0.1' : '9.57',
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



app.get("/authenticationsetter", async (req, res) => {
    console.log("heere")
    const auth = await getAsync("agency_keepa");
    res.render("pages/sessions", { sessions: JSON.parse(auth) });
  });
  
  app.post("/setsessions", bodyParser.json(), async (req, res) => {
    try { 
      const { tool, proxy, cookie } = req.body;
      const auth = await getAsync("agency_keepa");
      const parsed = JSON.parse(auth);
  
      parsed[tool] = { 
        name: parsed[tool]["name"], 
        proxy, 
        cookie 
      };
  
      const forSave = JSON.stringify(parsed);
      await setAsync("agency_keepa", forSave);
  
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

  // if(isProduction) {
  //   if(!toolData) {
  //     res.send("Access forbidden. 1");
  //     return;
  //   }

  //   if(!req.cookies["PHPSESSID"]) {
  //     res.send("Access forbidden. 2");
  //     return;
  //   }

  //   userID = await getUserID(db, req.cookies["PHPSESSID"]);

  //   if(!userID) {
  //     res.send("Access forbidden. 3");
  //     return;
  //   }

  //   const hasAccess = await checkForAccess(db, userID, toolData.productID);

  //   if(!hasAccess) {
  //     res.send("Access forbidden. 4");
  //     return;
  //   }
  // }

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

  if(req.baseUrl == "/kk7.js")
  {
    next()
    return
  }


console.log( " downnn" );

  let agent;
  let accessTool;

  if(isProduction) {
    const accessAllData = JSON.parse(await getAsync("agency_keepa"));
    if ( accessAllData == null)
    {
      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("agency_keepa", content);
      console.log("Storage populated  again ...");
      accessAllData = JSON.parse(await getAsync("agency_keepa"));
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
    console.log(cokiess)
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
      "User-Agent": toolData.userAgent,
      host: toolData.host,
      origin: toolData.origin,
    },
  })(req, res, next);

});

client.on("ready", async (err) => {
  if(isProduction) {
    try {
      console.log("Connected to Redis...");

      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("agency_keepa", content);
      console.log("Storage populated...");

    //  await connectToDB()
      console.log("Connected to MySQL...");

      app.listen(5600, (err) => {
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


app.get("/kk7.js",  async(request, response) => {

  console.log("subb ->>>>>>>>>>>>>>>>>>>>>>>");
  const https = require('https')
  const options = {
  hostname: 'cdn.keepa.com',
  path: '/20220201/keepa.js',
  method: 'GET',
  headers: {

}
  }

  const req = https.request(options,  res => {
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

    response.setHeader("content-type", "application/javascript; charset=utf-8")
    response.setHeader("Access-Control-Allow-Credentials", "true")
    response.setHeader("access-control-allow-origin", "https://kep01.amzfbatool.com")

      if(contents.includes(`qa=null!=window.connection&&1==w`))
      {
        console.log(" found ====== ==== ==== ")
          contents = contents.replace(`qa=null!=window.connection&&1==w` , `
          console.log("server caa = " + ca[oa]);
          qa = null != window.connection && 1 == w`)
      }

      

      if(contents.includes(`"wss://"+ca[oa]+"/apps/cloud/?app=keepaWebsite&version=1.6"`))
      {
          contents = contents.replace(`"wss://"+ca[oa]+"/apps/cloud/?app=keepaWebsite&version=1.6"` , `"wss://wskp.amzfbatool.com/apps/cloud/?app=keepaWebsite&version=1.6"`)
      }

      if(contents.includes(`var q=new WebSocket`))
      {
        console.log(" found ====== ==== ==== ")
          contents = contents.replace(`var q=new WebSocket` , `
          console.log("server 0 = " + server[0]);
          var q = new WebSocket`)
      }


  
    response.send(contents);
   }
  });

  })


  req.on('error', error => {
  console.error(error)
  })

  req.end();
});


