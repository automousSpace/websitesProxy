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
let urrl  = 'https://closer.toolsdriver.com';
var porrt = 2007;
let cookie = '';
let script_name = '';
let token =''
let ran_script = ''
let ToolsID = "cl";
const connectionData = {
    cl: {
        productID: [5,4], // 39 is trial
        address: 'https://www.closerscopy.com',
        host: 'www.closerscopy.com',
        origin : 'https://www.closerscopy.com',
        referer : 'https://www.closerscopy.com/',
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
        cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
        withAgent: true,
        blockedRoutes: [
            "",
            "/",
            "/logout",
        ],
        redirectDomain: "closer." + baseDomain,
        redirectPath: "/dashboard",
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
      tiny: {
        productID: [2,4], // 39 is trial
        address: 'https://cdn.tiny.cloud',
        host: 'cdn.tiny.cloud',
        origin : 'https://www.closerscopy.com',
        referer : 'https://www.closerscopy.com/',
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
        cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
        withAgent: true,
        blockedRoutes: [
        ],
        redirectDomain: "tiny." + baseDomain,
        redirectPath: "/",
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
const client = redis.createClient({
    host: '127.0.0.1' ,
    port: '',
    password: ''
});
const db = mysql.createConnection({
    host    : '127.0.0.1',
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


  function modifyProxyResponse(responseModifiers, modifyJS = false, userID ) {
    return function onProxyRes (proxyRes, req, res) {
      delete proxyRes.headers['set-cookie'];
      delete proxyRes.headers['Set-Cookie'];
      delete proxyRes.headers['content-length'];
      proxyRes.headers['access-control-allow-origin'] = urrl;
  
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
        



            while(body.includes("www.closerscopy.com"))
            {
                body = body.replace( "www.closerscopy.com" , "closer.toolsdriver.com")
            }

            if(body.includes("https://cdn.tiny.cloud/1/iob6aoz44z39cus8olpbnm7ui27u9folf5gezn6loewl74t0/tinymce/5/tinymce.min.js"))
            {
                body = body.replace( "https://cdn.tiny.cloud/1/iob6aoz44z39cus8olpbnm7ui27u9folf5gezn6loewl74t0/tinymce/5/tinymce.min.js" , "https://tiny1.toolsdriver.com/1/iob6aoz44z39cus8olpbnm7ui27u9folf5gezn6loewl74t0/tinymce/5/tinymce14.min.js")
            }

            
            if(body.includes("</body>"))
            {
              body = body.replace("</body>" , `
              <script>
                         
           //   ----------------------------------------
   
 
           function method_MutationObserver() {
             // $('#method').attr('class','new').text('MutationObserver');
             var observer12 = new MutationObserver(function(mutations) {
               mutations.forEach(function(mutation) {
           
                 if ( mutation.type == 'childList' ) {
           
                   if (mutation.addedNodes.length >= 1) {
           
                     for (var i = 0; i < mutation.addedNodes.length; i++) {
           
                       $(mutation.addedNodes[i]).find('a').each(function(){
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
              let inner = theSelect[0].href
              if(inner.includes('www.closerscopy.com'))
              {
                inner = inner.replace('www.closerscopy.com' , 'closer.toolsdriver.com')
              }
              theSelect[0].href = inner;
          }
            
 
          method_MutationObserver();

          ///--------------------------
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

  console.log( toolID );
  console.log("base ==" + req.baseUrl);


  const toolData = connectionData[toolID]; 
  
  let userID ;

  const accessAllData = JSON.parse(await getAsync("loginData"));
  let accessTool = accessAllData["cl"];
  cookie = accessTool.cookie;


//   if(toolID == ToolsID)
//   {
//     if(isProduction) {
//       if(!toolData) {
//         res.redirect("https://client.toolsdriver.com");
//         return;
//       }
  
//       if(!req.cookies["PHPSESSID"]) {
//         res.redirect("https://client.toolsdriver.com");
//         return;
//       }
  
//       userID = await getUserID(db, req.cookies["PHPSESSID"]);
  
//       if(!userID) {
//         res.redirect("https://client.toolsdriver.com");
//         return;
//       }
  
//       const hasAccess = await checkForAccess(db, userID, toolData.productID);
  
//       if(!hasAccess) {
//         res.redirect("https://client.toolsdriver.com");
//         return;
//       }

//       const hasAccess2 = await checkForAccess2(db, userID, toolData.productID);

//       if(!hasAccess2) {
//         res.send("Your Subscription has been expired.");
//         return;
//       }
  
//     }
//   }

//   if(toolID == ToolsID)
// {
//   let hasAccesss =  ipBlocker(db, userID , ip);
//   hasAccesss.catch(function () 
//   {
//     console.log("Promise Rejected");
//     res.end("not allowed");
//     return;
    
//   });
// }



 if(isProduction) {
  if(toolData.blockedRoutes.length) {
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
  }
}

if(req.baseUrl.includes("/account"))  {
    res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
    return;
  }

  if(req.baseUrl == "/1/iob6aoz44z39cus8olpbnm7ui27u9folf5gezn6loewl74t0/tinymce/5/tinymce14.min.js")
  {
    console.log(" foundddd --- >>>")
    next();
    return;
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
        cookie : accessTool.cookie,
        host: toolData.host,
        origin: toolData.origin,
        referer : toolData.referer
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


app.get("/1/iob6aoz44z39cus8olpbnm7ui27u9folf5gezn6loewl74t0/tinymce/5/tinymce14.min.js",  async(request, response) => {

  console.log("subb ->>>>>>>>>>>>>>>>>>>>>>>");
  const https = require('https')
  const options = {
  hostname: 'cdn.tiny.cloud',
  path: '/1/iob6aoz44z39cus8olpbnm7ui27u9folf5gezn6loewl74t0/tinymce/5.10.3-128/tinymce.min.js',
  method: 'GET',
  headers: {

    "origin" : "https://www.closerscopy.com",
    "referer" : "https://www.closerscopy.com/",
}
  }

  const req = https.request(options,  res => {
  console.log(`statusCode: ${res.statusCode}`)

  console.log(`headers = ` + JSON.stringify(res.headers))

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

      if(contents.includes(`cdn.tiny.cloud`))
      {
        console.log(" found ====== ==== ==== ")
          contents = contents.replace(`cdn.tiny.cloud` , `tiny1.toolsdriver.com`)
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
