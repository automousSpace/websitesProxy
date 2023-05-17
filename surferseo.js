const fs = require('fs');
const { promisify } = require('util');
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const modifyResponse = require('http-proxy-response-rewrite');
const redis = require('redis');
const cookieParser = require('cookie-parser');
const proxyingAgent = require('proxying-agent');
const mysql = require('mysql');
const { Console } = require('console');
require('events').EventEmitter.prototype._maxListeners = 0;
const fileRead = (filename) => fs.readFileSync(filename);
const baseDomain = process.env.ROOT_DOMAIN || "bundledseo.com" ;
const isProduction = process.env.NODE_ENV || "production";
let urrl  = 'https://surfer.bundledseo.com';
var porrt = 4024;
let cookie = '';
let script_name = '';
let token =''
let ran_script = ''
let ToolsID = "kt";
const connectionData = {
    suf: {
        productID: [11, 15, 21, 29, 36, 37, 39, 40, 41],
        address: 'https://app.surferseo.com',
        host: 'app.surferseo.com',
        origin :'https://app.surferseo.com',
        referer : 'https://app.surferseo.com/',
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36",
        withAgent: true,
        blockedRoutes: [
          '/',
          "",
          "/billing/invoices",
          "/billing/subscription",
        ],
        redirectDomain: "surfer." + baseDomain,
        redirectPath: "/drafts",
        requestHeaderModifiers: [],
        responseHeaderModifiers: [],
        transformResponse: true,
        responseModifiers: [
          function(body, userID) {
            console.log("KT", "UserID: ", userID);
            return body;
          }
        ]
      },
    
  
  };
const client = redis.createClient({
    host: isProduction ? '127.0.0.1' : '',
    port: '',
    password: ''
  });

const db = mysql.createConnection({
    host    : isProduction ? '127.0.0.1' : '',
    user    : '',
    password: '',
    database: ''
  });

function modifyProxyRequest(requestModifiers) {
    return function onProxyReq(proxyReq, req, res) {
  
  
    }
  }
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}

const saveCookies =  async (cookiesForSave) =>
{
  try { 
    const tool = "suf";
    const auth = await getAsync("loginData");
    const parsed = JSON.parse(auth);

    parsed[tool] = { 
      name: parsed[tool]["name"], 
      proxy : parsed[tool]["proxy"],
      cookie : cookiesForSave
    };

    const forSave = JSON.stringify(parsed);

    //console.log(forSave);
    await setAsync("loginData", forSave);

    fs.writeFile((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt')), forSave, (err) => {
      if(err) {
        console.log(" Save Failed 1 ------->")
        return;
      }

      console.log(" Save Successfull ------->")
    });
  } catch(err) {
    console.log(" Save Failed 2 ------->")
  }
}

function modifyProxyResponse(responseModifiers, modifyJS = false, userID ) {
    return async function onProxyRes (proxyRes, req, res) {

      delete proxyRes.headers['content-length'];
      proxyRes.headers['access-control-allow-origin'] = urrl;


      if(proxyRes.headers['set-cookie'])
      {
        let cookie = proxyRes.headers['set-cookie'];
        for(let i =0 ; i<cookie.length ; i++)
        {
            if(cookie[i].includes("XSRF-TOKEN"))
            {
                let token = cookie[i].split(";")
                token = token[0]
                token = token.split("=")
                token = token[1]
                token = token.replace("%3D","=")
                savetoken(token)
         
            }
        }
      }
      

      delete proxyRes.headers['set-cookie'];
      delete proxyRes.headers['Set-Cookie'];
  
      if(proxyRes.headers['content-encoding'] === 'br') {
        return;
      }
  
     if(proxyRes.headers['content-encoding'] === 'deflate') {
        console.log("here 222");
        return;
      }

      // if(proxyRes.headers['content-type'].includes('application/json'))
      // {
   
      //   modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
      //       if (body) {
      //           while(body.includes("keywordtool.io"))
      //           {
      //               body = body.replace( "keywordtool.io" , "kt.bundledseo.com")
      //           }
      //       }
      //       return body;
      //   });

      // }
  
  
      if(proxyRes.headers['content-type'] && (proxyRes.headers['content-type'].includes('html') || modifyJS)) {
        modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
          let newBody = '';
  
          if (body) {
        

            let script = ''
            if(body.includes("src='/static/main."))
            {
              let start = body.indexOf("src='/static/main.")
              
              while(true)
              {
                  if(body[start] == '>')
                  {
                    break;
                  }
                  script = script + body[start];
                  start++;
              }
            }

              if(body.includes(script) && body.includes("src='/static/main.") )
              {
                  script_name = script;
                  body = body.replace(script , "src='https://surfer.bundledseo.com/app1.js'")
              }

            while(body.includes("connect.surferseo.com"))
            {
                body = body.replace( "connect.surferseo.com" , "surfer.bundledseo.com/connect")
            }

            if(body.includes("<body>"))
            {
                body = body.replace( "<body>" , `
  
            <body>
            <script>


             
            //   ----------------------------------------
     
 

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
                if( path == "/billing/invoices" || path.includes("/billing/subscription") )
                {
                    window.location.replace("https://surfer.bundledseo.com/drafts");
        
                }
            })
        
            let pathh = window.location.pathname;
                 if( pathh == "/billing/invoices" || pathh.includes("/billing/subscription") )
                {
                    window.location.replace("https://surfer.bundledseo.com/drafts");
        
                }
         
  
            </script>`)
            }


  
          }
  
          return newBody ? newBody : body;
        });
      }
    }
  
  }


const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

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

const checkForAccess2 = (db, id, productID) => {
  //" + productID);
  return new Promise(async(resolve, reject) => {

    let counter =0 ;
     await db.query(`SELECT  *FROM am_user_status WHERE user_id = ${id} `, (err, result) => 
     {
        if(err) {
          console.log(err);
          reject();
          return;
        }
        
        if(result.length > 0)
        {
          for( let i =0 ; i < result.length ; i++ )
          {
            if(result[i].status == 1)
            {
              let pid = result[i].product_id;
              pid = parseInt(pid);
              if(productID.includes(pid))
              {
                counter++;
              }
            }
          }
       }
       if(counter > 0)
       {
         return resolve(true);
       }
       else
       {
         return resolve(false);
       }
        
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

  console.log("base ==" + req.baseUrl);


  const toolData = connectionData[toolID]; 
  
  let userID ;


   const accessAllData = JSON.parse(await getAsync("loginData"));
  let accessTool = accessAllData[toolID];

  if(req.baseUrl == "/app1.js")
  {
    next();
    return;
  }

  if(req.baseUrl == "/connect/tokens/refresh")
  {
    req.token = accessTool.cookie;
    req.def_token = accessTool.proxy;
    next();  
    return;
  }


  // if(isProduction) {
  //   if(!toolData) {
  //     res.redirect("https://access.bundledseo.com");
  //     return;
  //   }

  //   if(!req.cookies["PHPSESSID"]) {
  //     res.redirect("https://access.bundledseo.com");
  //     return;
  //   }

  //   userID = await getUserID(db, req.cookies["PHPSESSID"]);

  //   if(!userID) {
  //     res.redirect("https://access.bundledseo.com");
  //     return;
  //   }

  //   const hasAccess = await checkForAccess(db, userID, toolData.productID);

  //   if(!hasAccess) {
  //     res.redirect("https://access.bundledseo.com");
  //     return;
  //   }

  //   const hasAccess2 = await checkForAccess2(db, userID, toolData.productID);

  //   if(!hasAccess2) {
  //     res.send("Your Subscription has been expired.");
  //     return;
  //   }

  // }



 if(isProduction) {
  if(toolData.blockedRoutes.length) {
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
  }
}


  let agent = toolData.withAgent ? proxyingAgent.create("http://mraza02:PFg6vh70@45.4.205.21:29842", toolData.address) : null;
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
     //  cookie : ` ajs_user_id=%229fc76d9144767eeb8db078b6%22; ajs_anonymous_id=%225ea4fd08-0afb-4889-86fc-c3ef21ec45f1%22; _hjid=182b5194-c1d5-4248-8597-f43dcd4f677f; _hjSessionUser_649208=eyJpZCI6IjcxMWJhYmFlLTE4MWEtNWVlMC1iMDEyLWI2ZmZhOGExYzJiZSIsImNyZWF0ZWQiOjE2NDY3NTgxNDYwMTUsImV4aXN0aW5nIjp0cnVlfQ==; __stripe_mid=225631a4-3797-4350-9545-229d0d877b97d1206e; intercom-id-svodmmgx=0462cdaf-7cc4-4eed-9565-c881b27b33f3; _BEAMER_FIRST_VISIT_MgtcvpNB36920=2022-03-08T16:31:12.412Z; _BEAMER_USER_ID_MgtcvpNB36920=c64b2392-d7ea-4f59-a9f1-f9497a14acbd; _gid=GA1.2.511543640.1652383606; __stripe_sid=5f02edde-ab18-452c-912a-99f8a7e0c5bcd47550; _hjIncludedInSessionSample=0; _hjSession_649208=eyJpZCI6IjU0ODkxMGQwLWM5MzYtNDU4Yi05NDlhLWU3YmY3NWY2ZDViYyIsImNyZWF0ZWQiOjE2NTIzODM2MTk0NjYsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=1; _BEAMER_USER_ID_MgtcvpNB36920=c64b2392-d7ea-4f59-a9f1-f9497a14acbd; _BEAMER_FILTER_BY_URL_MgtcvpNB36920=false; _BEAMER_FILTER_BY_URL_MgtcvpNB36920=false; _BEAMER_LAST_UPDATE_MgtcvpNB36920=1652383985375; _BEAMER_LAST_PUSH_PROMPT_INTERACTION_MgtcvpNB36920=1652384037243; _kseo_web_key=SFMyNTY.g3QAAAABbQAAAAtfY3NyZl90b2tlbm0AAAAYd0dvc3JpQkFnYU51LUl3Ukt2LWZFcm05.1L55ZlaZg0l0m8TAhQFve3pfkJCOD10qHxiEaBKDJ24; _hjCachedUserAttributes=eyJhdHRyaWJ1dGVzIjp7ImFjdGl2ZV9wbGFuX25hbWUiOiJGcmVlbWl1bSIsImJyb3dzZXIiOiJDaHJvbWUiLCJjYW5jZWxlZF9hdCI6bnVsbCwiY3JlYXRlZF9hdCI6IjIwMjItMDEtMjFUMDc6MDE6MDAuMDAwWiIsImRhdGVfc2luY2VfYmVjYW1lX2N1c3RvbWVyIjowLCJlbWFpbCI6Im5hbmN5Y2hyaXN0b3BoZXI0Mi45QGdtYWlsLmNvbSIsImZpcnN0X3BheW1lbnRfZGF0ZSI6IjIwMjItMDUtMTJUMTk6NDE6NTcuNDI4WiIsImhhc19rZXl3b3JkX3N1cmZlciI6ZmFsc2UsImxhc3RfcGF5bWVudF9kYXRlIjpudWxsLCJuYW1lIjpudWxsLCJuZXh0X3BheW1lbnRfZGF0ZSI6bnVsbCwib3JnYW5pemF0aW9uX2lkIjoxNDQ5ODAsInBsYW5fcGVyaW9kIjoxLCJwcmljZSI6MCwic2NyZWVuX3Jlc29sdXRpb24iOiIxNDQwIHggOTAwIn0sInVzZXJJZCI6IjlmYzc2ZDkxNDQ3NjdlZWI4ZGIwNzhiNiJ9; _BEAMER_LAST_UPDATE_MgtcvpNB36920=1652384517998; _ga_V5R5J2E38G=GS1.1.1652383604.1.1.1652384581.0; _ga=GA1.2.2028871104.1646758146; _gat_gtag_UA_107688874_1=1; intercom-session-svodmmgx=dnNnSzhIVHQ4RlZDdkxreW1rTTduK3NISXIxdnRzZFN4SFg5a200ckFwY3l2RUxVNm9HcVd6K1czVjBBbTkyZi0tSENRcHBlb2MyQ0dvVnU0T3AyZk9TQT09--ca9e2d48d1572c53b3ece903dca6513a3a60bac5`,
        host: toolData.host,
        origin: toolData.origin,
    },
  })(req, res, next);


});

client.on("ready", async (err) => {
  if(isProduction) {
    try {

        const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
        await setAsync("loginData", content);
      console.log("Storage populated...");

      await connectToDB()
      console.log("Connected to MySQL.....");


      console.log(" under.......")
      
      app.listen(porrt, (err) => {
        if(err) {
          console.log(err);
          return;
        }

        console.log("Server running on: http://127.0.0.1:" + porrt);
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


app.get("/app1.js",  async(request, response) => {

  script_name = script_name.replace("'" , "")
  script_name = script_name.replace("'" , "")
  script_name = script_name.split("=")
  script_name = script_name[1]
  console.log("subb ->>>>>>>>>>>>>>>>>>>>>>>" + script_name);
  const https = require('https')
  const options = {
  hostname: 'app.surferseo.com',
  path: script_name,
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
    response.setHeader("access-control-allow-origin", urrl)

      if(contents.includes(`window.location.hostname+":"+window.location.port;`))
      {
        console.log(" found ====== ==== ==== ")
          contents = contents.replace(`window.location.hostname+":"+window.location.port;` , `"surws.bundledseo.com";`)
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

app.post("/connect/tokens/refresh",  async(request, response) => {



  console.log("subb ->>>>>>>>>>>>>>>>>>>>>>>" );
  const https = require('https')
  const options = {
  hostname: 'connect.surferseo.com',
  path: '/tokens/refresh',
  method: 'POST',
  headers: {
    'origin' : 'https://app.surferseo.com',
    'content-type': 'application/json',
    'cookie' : '_surfer_auth_key=' + request.token + ';' + 'guardian_default_token='+request.def_token+';' ,
}
  }

  const req = https.request(options,  res => {
  console.log(`statusCode of connect.surferseo.com : ${res.statusCode}`)

  var contents = "";
  res.on('data', async d => {
    //process.stdout.write(d)
    contents += d;

  })

  res.on('end', async() => {
  // console.log(contents);
   if(res.statusCode == 200)
   { 

    if(res.headers['set-cookie'])
    {
      let str = res.headers['set-cookie'];
      str = str[0].split("=")
      str = str[1].split(";")
      str = str[0]
      saveCookies(str)
      response.setHeader("set-cookie",res.headers['set-cookie']);
    }
    else
    {
      response.cookie('_surfer_auth_key',request.token);
    }
    response.setHeader("content-type", "application/json; charset=utf-8")
    response.setHeader("Access-Control-Allow-Credentials", "true")
    response.setHeader("access-control-allow-origin", urrl)

  
    response.send(contents);
   }
  });

  })


  req.on('error', error => {
  console.error(error)
  })

  req.end();
});
