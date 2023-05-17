const fs = require('fs');
const { promisify } = require('util');
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const modifyResponse = require('http-proxy-response-rewrite');
const redis = require('redis');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
require('events').EventEmitter.prototype._maxListeners = 0;
const fileRead = (filename) => fs.readFileSync(filename);
const baseDomain = process.env.ROOT_DOMAIN || "toolsdriver.com" ;
const isProduction = process.env.NODE_ENV || "production";
let cookie = '';
const connectionData = {
    ws: {
        productID: [27 , 42], // 39 is trial
        address: 'https://app.writesonic.com',
        host: 'app.writesonic.com',
        origin : 'https://app.writesonic.com',
        referer : 'https://app.writesonic.com/',
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
        cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
        withAgent: true,
        blockedRoutes: [
    
        ],
        redirectDomain: "ws." + baseDomain,
        redirectPath: "/curated",
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
      delete proxyRes.headers['Set-Cookie'];
      delete proxyRes.headers['content-length'];
      proxyRes.headers['access-control-allow-origin'] = "https://ws.toolsdriver.com"
  
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
        


            if(body.includes("<head>"))
            {
                body = body.replace("<head>",`
                <head>
                <script>
                document.cookie = "Token=${cookie}";
                </script>
                
                `)
            }

           // console.log(body)

            if(body.includes("<body>"))
            {
                body = body.replace( "<body>" , `
  
            <body>
            <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>
            <script>


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
                if( path == "/settings/profile" || path == "/settings/password" || path == "/settings/billing" || path == "/settings/team"  || path == "/feedback"  ||  path.includes("/saved/all") ||  path.includes("/history/all") )
                {
                    window.location.replace("https://ws.toolsdriver.com");
        
                }
            })
        
            let pathh = window.location.pathname;
                 if( pathh == "/settings/profile" || pathh == "/settings/password" || pathh == "/settings/billing" || pathh == "/settings/team" ||  pathh == "/feedback" ||    pathh.includes("/saved/all") ||  pathh.includes("/history/all")  )
                {
                    window.location.replace("https://ws.toolsdriver.com");
        
                }
        
            
           
           //   ----------------------------------------

   
 
           function method_MutationObserver() {
             // $('#method').attr('class','new').text('MutationObserver');
             var observer12 = new MutationObserver(function(mutations) {
               mutations.forEach(function(mutation) {
           
                 if ( mutation.type == 'childList' ) {
           
                   if (mutation.addedNodes.length >= 1) {
           
                     for (var i = 0; i < mutation.addedNodes.length; i++) {
           
                       $(mutation.addedNodes[i]).find('p').each(function(){
                         apply_select22($(this));
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
           
          function apply_select22(theSelect) 
        {
              let inner = theSelect[0].outerText.trim();
              if( inner == '?')
              {
               
               theSelect[0].style.display = "none";
               $(theSelect[0]).remove();
          
              }
        
          }
            
 
          method_MutationObserver();


          ////---------------------
   
  
              </script>`)
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

const db = mysql.createConnection({

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

  const accessAllData = JSON.parse(await getAsync("loginData"));
  let accessTool = accessAllData[toolID];
  cookie = accessTool.cookie;

  if(toolID == "ws")
  {
    if(isProduction) {
      if(!toolData) {
        res.redirect("https://client.toolsdriver.com");
        return;
      }
  
      if(!req.cookies["PHPSESSID"]) {
        res.redirect("https://client.toolsdriver.com");
        return;
      }
  
      userID = await getUserID(db, req.cookies["PHPSESSID"]);
  
      if(!userID) {
        res.redirect("https://client.toolsdriver.com");
        return;
      }
  
      const hasAccess = await checkForAccess(db, userID, toolData.productID);
  
      if(!hasAccess) {
        res.redirect("https://client.toolsdriver.com");
        return;
      }
    }
  }

  if(toolID == "ws")
{
  let hasAccesss =  ipBlocker(db, userID , ip);
  hasAccesss.catch(function () 
  {
    console.log("Promise Rejected");
    res.end("not allowed");
    return;
    
  });
}



 if(isProduction) {
  if(toolData.blockedRoutes.length) {
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
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
      
      app.listen(2002, (err) => {
        if(err) {
          console.log(err);
          return;
        }

        console.log("Server running on: http://127.0.0.1:4003");
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

