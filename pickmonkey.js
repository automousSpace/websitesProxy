
const fs = require('fs');
const { promisify } = require('util');
const puppeteer = require('puppeteer'); 
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

const baseDomain = process.env.ROOT_DOMAIN || "toolshunter.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);


const connectionData = {
    pm: {
      productID: [27 , 43], // 39 is trial
      address: 'https://www.picmonkey.com',
      host: 'www.picmonkey.com',
      origin : 'https://www.picmonkey.com',
      referer : 'https://www.picmonkey.com/',
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
      cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
      withAgent: true,
      blockedRoutes: [
     
      ],
      redirectDomain: "pm." + baseDomain,
      redirectPath: "/home",
      requestHeaderModifiers: [],
      responseHeaderModifiers: [],
      transformResponse: true,
      responseModifiers: [
        function(body, userID) {
          console.log("Ahrefs", "UserID: ", userID);
  
  
          return body;
        }
      ]
    },
    cdn: {
        productID: [27 , 43], // 39 is trial
        address: 'https://cdn-fastly.picmonkey.com',
        host: 'cdn-fastly.picmonkey.com',
        origin : 'https://www.picmonkey.com',
        referer : 'https://www.picmonkey.com/',
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
        cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
        withAgent: true,
        blockedRoutes: [
       
        ],
        redirectDomain: "cdn." + baseDomain,
        redirectPath: "/home",
        requestHeaderModifiers: [],
        responseHeaderModifiers: [],
        transformResponse: true,
        responseModifiers: [
          function(body, userID) {
            console.log("Ahrefs", "UserID: ", userID);
    
    
            return body;
          }
        ]
      },
    cdn1: {
        productID: [27 , 43], // 39 is trial
        address: 'https://cdn-fastly.picmonkey.com',
        host: 'cdn-fastly.picmonkey.com',
        origin : 'https://www.picmonkey.com',
        referer : 'https://www.picmonkey.com/',
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
        cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
        withAgent: true,
        blockedRoutes: [
       
        ],
        redirectDomain: "cdn1." + baseDomain,
        redirectPath: "/home",
        requestHeaderModifiers: [],
        responseHeaderModifiers: [],
        transformResponse: true,
        responseModifiers: [
          function(body, userID) {
            console.log("Ahrefs", "UserID: ", userID);
    
    
            return body;
          }
        ]
      },

  
  
  };

  function modifyProxyRequest(requestModifiers) {
    return function onProxyReq(proxyReq, req, res) {
  
  
    }
  }
  
  function modifyProxyResponse(responseModifiers, modifyJS = false, userID ) {
    return function onProxyRes (proxyRes, req, res) {
      delete proxyRes.headers['set-cookie'];
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['content-length'];
      proxyRes.headers['access-control-allow-origin'] = "https://pm.toolshunter.com"
  
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

            while(body.includes("cdn-fastly.picmonkey.com"))
            {
                body = body.replace("cdn-fastly.picmonkey.com" ,`pmcdn.toolshunter.com`)
            }

            if(body.includes('<head>'))
            {
                body = body.replace('<head>',
                `
                <head>
                <script>
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
                    if( path == "/home/account" || path == "/home/account/billing" )
                    {
                        window.location.replace("https://pm.toolshunter.com/home");
            
                    }
                })
            
                let pathh = window.location.pathname;
                     if( pathh == "/home/account" || pathh == "/home/account/billing")
                    {
                        window.location.replace("https://pm.toolshunter.com/home");
            
                    }

                    </script>
                `)
            }

            if(body.includes(`docsWsHost: "wss://hub.gke.prod.picmonkey.com"`))
            {
                body = body.replace(`docsWsHost: "wss://hub.gke.prod.picmonkey.com"` ,`docsWsHost: "wss://pmws.toolshunter.com"`)
            }


       
            while(body.includes(`www.picmonkey.com`))
            {
                body = body.replace(`www.picmonkey.com` ,`pm.toolshunter.com`)
            }



     
  
          }
  
          return newBody ? newBody : body;
        });
      }
    }
  
  }

  const client = redis.createClient({
    host: isProduction ? '' ,
    port: '6379',
    password: ''
  });

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const db = mysql.createConnection({
  host    : '127.0.0.1',
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

      resolve(true);
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

const ipBlocker = (db, id , ip) =>
{
  let today = new Date();
  let minutes = today.getMinutes();
 return new Promise((resolve, reject) => {
    // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
     db.query(`SELECT  *FROM session WHERE user_id = ${id}`, (err, result) => {
     if(err) {
       console.log(err);
       reject();
       return;
     }

     console.log(" Result lenth - "+result.length);
     if( result.length ==0 )
     {
       // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
         db.query(`INSERT INTO session (user_id , active_time , ip ) VALUES (${id} , ${minutes} , '${ip}')`, (err, result1) => {
         if(err) {
           console.log(err);
           reject();
           return;
         }
         else
         {
           console.log("ip ----- added :)");
           resolve(true)
           return
         }
         });

     }

     if(result.length > 1)
     {

             // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
             db.query(`delete from session WHERE user_id = ${id} `, (err, result1) => {
              if(err) {
                console.log(err);
                reject();
                return;
              }
              else
              {
                console.log(" olddddd deletedddd ");
                       // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
                // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
                db.query(`INSERT INTO session (user_id , active_time , ip ) VALUES (${id} , ${minutes} , '${ip}')`, (err, result1) => {
                  if(err) {
                    console.log(err);
                    reject();
                    return;
                  }
                  else
                  {
                    console.log("ip added after deleting all ----> :)");
                    resolve(true)
                    return;
                  }
                  });
              }
              });
         
     }

     if(( result.length == 1))
     {

        let active_time = result[0].active_time;
        if( active_time < minutes )
        {
            let session_time = minutes - active_time;
            if( session_time > 15 )
            {
                    // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
                    db.query(`UPDATE session SET ip = '${ip}'  , active_time = ${minutes}  WHERE user_id = ${id}`, (err, result) => {
                      if(err) {
                        console.log(err);
                        reject();
                        return;
                      }
                      else
                      {
                        console.log("ip ----- updateddd :)");
                        resolve(true)
                        return
                      }
                      });
            }
            else
            {
              if(result[0].ip == ip )
              {
                resolve(true)
                return
              }
              else
              {
                reject();
                return;
              }
            }
        }
        else if ( active_time > minutes )
        {
          let session_time = 60 - active_time;
          session_time = session_time + minutes;
          if( session_time > 15 )
          {
                  // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
                  db.query(`UPDATE session SET ip = '${ip}'  , active_time = ${minutes}  WHERE user_id = ${id}`, (err, result) => {
                    if(err) {
                      console.log(err);
                      reject();
                      return;
                    }
                    else
                    {
                      console.log("ip ----- updateddd :)");
                      resolve(true)
                      return
                    }
                    });
          }
          else
          {
            if(result[0].ip == ip )
            {
              resolve(true)
              return
            }
            else
            {
              reject();
              return;
            }
          }

        }
     }


    });

 });

}



const app = express();

app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());


app.use('*', async (req, res, next) => {
  let toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];

  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


  console.log( toolID );
  console.log("base ==" + req.baseUrl);


  const toolData = connectionData[toolID]; 
  
  let userID ;



  if(toolID == "pm")
  {
    if(isProduction) {
      if(!toolData) {
        res.redirect("https://my.toolshunter.com");
        return;
      }
  
      if(!req.cookies["PHPSESSID"]) {
        res.redirect("https://my.toolshunter.com");
        return;
      }
  
      userID = await getUserID(db, req.cookies["PHPSESSID"]);
  
      if(!userID) {
        res.redirect("https://my.toolshunter.com");
        return;
      }
  
      const hasAccess = await checkForAccess(db, userID, toolData.productID);
  
      if(!hasAccess) {
        res.redirect("https://my.toolshunter.com");
        return;
      }
    }
  }

  if(toolID == "pm")
{
  let hasAccesss =  ipBlocker(db, userID , ip);
  hasAccesss.catch(function () 
  {
    console.log("Promise Rejected");
    res.end("not allowed");
    return;
    
  });
}

    const accessAllData = JSON.parse(await getAsync("loginData"));
    let accessTool = accessAllData["pm"];
    let accessTool1 = accessAllData["pm1"];


    if(req.baseUrl.includes("/home/static/js/editor") && req.baseUrl.includes("bundle.js") && toolID=="cdn")
    {
       
        next()
        return;
    }

    if(req.baseUrl.includes("/home/static/js/main.") && req.baseUrl.includes(".js") && toolID=="cdn" )
    {
        next();
        return;
    }
    if(req.baseUrl == "/_/api/auth/session_token")
    {
        req.headers['cookie'] = accessTool.cookie;
        req.token = accessTool.proxy;
        req.csrf = accessTool1.cookie;
        next();
        return;
    }

    if(req.baseUrl == "/_/api/auth/is_authenticated")
    {
        req.headers['cookie'] = accessTool.cookie;
        req.csrf = accessTool1.cookie;
        next();
        return;
    }

    if(req.baseUrl == "/_/api/subscription")
    {
        req.headers['cookie'] = accessTool.cookie;
        next();
        return;
    }

 
     if(toolData.blockedRoutes.length) {
            if(toolData.blockedRoutes.includes(req.baseUrl))  {
              res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
              return;
            }
    }


  createProxyMiddleware({ 
    target: toolData.address,
    ws: true, 
    toProxy: true,
    xfwd: false,
    followRedirects: true,
    onProxyReq: modifyProxyRequest(toolData.requestModifiers),
    onProxyRes: toolData.transformResponse ? modifyProxyResponse(toolData.responseModifiers, false, userID  ) : function() {},
    headers: {
      "User-Agent": toolData.userAgent,
      cookie: accessTool.cookie,
      host: toolData.host,
      origin: toolData.origin,
    },
  })(req, res, next);


});

client.on("ready", async (err) => {
  if(isProduction) {
    try {
      console.log("Storage populated...");

      await connectToDB()
      console.log("Connected to MySQL.....");


      console.log(" under.......")
      
      app.listen(6015, (err) => {
        if(err) {
          console.log(err);
          return;
        }

        console.log("Server running on: http://127.0.0.1:6014");
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

      console.log("Server running on: http://127.0.0.1:4003");
    });
  }
});


app.post("/_/api/auth/session_token",  async(request, response) => {

  // console.log("subb ->>>>>>>>>>>>>>>>>>>>>>>" + request.token );
    const https = require('https')
    const options = {
    hostname: 'www.picmonkey.com',
    path: '/_/api/auth/session_token?include_refresh_token=true&v3&omitError=true',
    method: 'post',
    headers: {
  
        'x-csrftoken': request.csrf,
        'origin': 'https://www.picmonkey.com',
        'referer': 'https://www.picmonkey.com/home/',
        'content-type': 'application/json',
        'cookie' : request.headers.cookie
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
   //   console.log(contents);
     if(res.statusCode == 200)
     { 
  
      response.setHeader("content-type", "application/json; charset=utf-8")
      response.setHeader("Access-Control-Allow-Credentials", "true")
      response.setHeader("access-control-allow-origin", "https://pm.toolshunter.com")
      response.send(contents);
     }
    });
  
    })
  
  
    req.on('error', error => {
    console.error(error)
    })
    req.write(`{"refreshToken":"${request.token}"}`)
    req.end();
  });


  app.post("/_/api/auth/is_authenticated",  async(request, response) => {

   // console.log("subb ->>>>>>>>>>>>>>>>>>>>>>>" + request.headers.cookie );
    const https = require('https')
    const options = {
    hostname: 'www.picmonkey.com',
    path: '/_/api/auth/is_authenticated',
    method: 'post',
    headers: {
  
        'x-csrftoken': request.csrf,
        'origin': 'https://www.picmonkey.com',
        'referer': 'https://www.picmonkey.com/home/',
        'content-type': 'application/json',
        'cookie' : request.headers.cookie
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
  
      response.setHeader("content-type", "application/json; charset=utf-8")
      response.setHeader("Access-Control-Allow-Credentials", "true")
      response.setHeader("access-control-allow-origin", "https://pm.toolshunter.com")
     response.send(contents);
     }
    });
  
    })
  
  
    req.on('error', error => {
    console.error(error)
    })
    req.end();
  });

app.get("/_/api/subscription",  async(request, response) => {

 //   console.log("subb ->>>>>>>>>>>>>>>>>>>>>>>" + request.headers.cookie );
    const https = require('https')
    const options = {
    hostname: 'www.picmonkey.com',
    path: '/_/api/subscription',
    method: 'get',
    headers: {
  
        'accept': '*/*',
        'origin': 'https://www.picmonkey.com',
        'referer': 'https://www.picmonkey.com/home/',
        'content-type': 'application/json',
        'cookie' : request.headers.cookie
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
  
      response.setHeader("content-type", "application/json; charset=utf-8")
      response.setHeader("Access-Control-Allow-Credentials", "true")
      response.setHeader("access-control-allow-origin", "https://pm.toolshunter.com")
      response.send(contents);
     }
    });
  
    })
  
  
    req.on('error', error => {
    console.error(error)
    })
    req.end();
  });

app.get("/home/static/js/main.*",  async(request, response) => {

      console.log("subb ->>>>>>>>>>>>>>>>>>>>>>>");
       const https = require('https')
       const options = {
       hostname: 'pmcdn1.toolshunter.com',
       path: request.url,
       method: 'get',
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
      //  console.log(contents);
        if(res.statusCode == 200)
        { 
            response.setHeader("content-type", "application/javascript; charset=utf-8")
            response.setHeader("Access-Control-Allow-Credentials", "true")
            response.setHeader("access-control-allow-origin", "https://pm.toolshunter.com")
              while(contents.includes("www.picmonkey.com"))
              {
                  contents = contents.replace("www.picmonkey.com" , "pm.toolshunter.com")
              }
              while(contents.includes("cdn-fastly.picmonkey.com"))
              {
                contents = contents.replace("cdn-fastly.picmonkey.com" ,`pmcdn.toolshunter.com`)
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

app.get("/home/static/js/editor*",  async(request, response) => {

        console.log("subb ->>>>>>>>>>>>>>>>>>>>>>>");
         const https = require('https')
         const options = {
         hostname: 'pmcdn1.toolshunter.com',
         path: request.url,
         method: 'get',
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
        //  console.log(contents);
          if(res.statusCode == 200)
          { 
              response.setHeader("content-type", "application/javascript; charset=utf-8")
              response.setHeader("Access-Control-Allow-Credentials", "true")
              response.setHeader("access-control-allow-origin", "https://pm.toolshunter.com")
                if(contents.includes("cdn.fastly.picmonkey.com"))
                {
                    contents = contents.replace("cdn.fastly.picmonkey.com" , "pmcdn.toolshunter.com")
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
   
