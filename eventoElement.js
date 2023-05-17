
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

const proxyURL = 'http://sshukl03:QkWCr8hB@23.106.205.88:29842';
const baseDomain = process.env.ROOT_DOMAIN || "toolshunter.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);


const connectionData = {
    ee: {
      productID: [27 , 42], // 39 is trial
      address: 'https://elements.envato.com',
      host: 'elements.envato.com',
      origin : 'https://elements.envato.com',
      referer : 'https://elements.envato.com/',
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
      cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
      withAgent: true,
      blockedRoutes: [
          "/",
          "",
          "/account",
          "/account/update",
          "/account/password",
          "/credits/add/",
          "/account/logout",
          "/settings/pbn-hosting/",
          "/settings/ahrefs/"
      ],
      redirectDomain: "ee." + baseDomain,
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
      proxyRes.headers['access-control-allow-origin'] = "https://ee.toolshunter.com"
  
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


            if(body.includes("<body>"))
            {
                body = body.replace( "<body>" ,`
                
                <body>
                <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
                <script>
                $("body").on("click", "button[data-test-selector='item-card-download-button']", function(){
             
                console.log("clicked found");
                fetch('https://ee.toolshunter.com/checklimit', {
                  method: 'GET',
                })
                .then(response=>response.json())
                .then(data => 
                  {
                    if(data.fail) 
                    {
                      
                      alert("Your Daily Download Limit has been ended. Please come after "+data.date+" hour(s).");
                    } else 
                    {
                     // alert("Failed saving...");
                    }
                  });
                
              });

              </script>
                
                `)
            }

     
  
          }
  
          return newBody ? newBody : body;
        });
      }
    }
  
  }

  const client = redis.createClient({
    host: isProduction ? '' : '',
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

const checkForSitelimitAccess = (db, id , target) =>
{
  let today = new Date();
  let date = today.getDate();
 return new Promise(async (resolve, reject) => {
    // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
     db.query(`SELECT  *FROM envanto_limit WHERE user_id = ${id}`, async (err, result) => {
     if(err) {
       console.log(err);
       reject();
       return;
     }

     console.log(" Result lenth - "+result.length);
     if( result.length ==0 )
     {
       // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
        await db.query(`INSERT INTO envanto_limit (user_id , count , last_word , date) VALUES (${id} , 1 , '${target}' , ${date} )`, (err, result) => {
         if(err) {
           console.log(err);
           reject();
           return;
         }
         else
         {
           console.log("limit added :)");
           resolve(true)
         }
         });

     }

     if(result.length > 1)
     {

             // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
           await  db.query(`delete from envanto_limit WHERE user_id = ${id} `, async (err, result) => {
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
               await db.query(`INSERT INTO envanto_limit (user_id , count , last_word , date) VALUES (${id} , 1 , '${target}' , ${date} )`, (err, result) => {
                  if(err) {
                    console.log(err);
                    reject();
                    return;
                  }
                  else
                  {
                    console.log("limit added :)");
                    resolve(true)
                  }
                  });
              }
              });
          return;
     }

     if(( result.length == 1) && (result[0].date != date))
     {
              // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
              db.query(`UPDATE envanto_limit SET count = 1 , last_word = '${target}' , date = ${date}  WHERE user_id = ${id}`, (err, result) => {
                if(err) {
                  console.log(err);
                  reject();
                  return;
                }
                else
                {
                  console.log("limit Updateddd :)");
                  resolve(true)
                }
                });
     }

     else if(( result.length == 1) && (result[0].last_word != target )  && (result[0].date == date) )
     {

       if(result[0].count > 20)
       {
        await db.query(`UPDATE envanto_limit SET  last_word = 'limit_ended' WHERE user_id = ${id}`, (err, result) => {
           if(err) {
             console.log(err);
             reject();
             return;
           }
           });
         reject();
         return ;
       }
       // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
        await db.query(`UPDATE envanto_limit SET count = ${result[0].count + 1} , last_word = '${target}' WHERE user_id = ${id}`, (err, result) => {
         if(err) {
           console.log(err);
           reject();
           return;
         }
         else
         {
           console.log("limit Updateddd :)");
           resolve(true)
         }
         });

     }
     resolve(true)

 });

});

};

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

app.get("/checklimit", async (req, res) => {

    console.log("Account limit checker on... ");
    let userID = await getUserID(db, req.cookies["PHPSESSID"]);
    let today = new Date();
    let date = today.getHours();
    date = 24 - date;
    if(date == 0)
    {
      date = 1;
    }
  
    if(!userID) {
      res.send("Access forbidden. 3");
      return;
    }
    let userid  = userID;
    db.query(`SELECT  *FROM envanto_limit WHERE user_id = ${userid}`, async (err, result) =>{
      if(err) {
        console.log(err);
        reject();
        return;
      }
      else
      {
        
        if(result.length == 1 && result[0].count > 20)
        {
          res.json({ fail: true , date : date });
          return;
        }
        else
        {
          res.json({ fail: false });
          return;
        }
      }
    });
  
  });

app.use('*', async (req, res, next) => {
  let toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];

  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;


  console.log( toolID );
  console.log("base ==" + req.baseUrl);


  const toolData = connectionData[toolID]; 
  
  let userID ;



  if(toolID == "ee")
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

  if(toolID == "ee")
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
    let accessTool = accessAllData["ee"];


    if(req.baseUrl.includes("download"))
    {
        let data = req.baseUrl.split('/');
        let target = data[4];
        console.log(" target  --- " + target);
            if(target != null)
            {
              let hasAccess =  checkForSitelimitAccess(db, userID , target);
      
              hasAccess.catch(function () 
              {
                console.log("Promise Rejected");
                res.end(" Your daily download limit is ended.. ");
                return;
              });
            }
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
      
      app.listen(6014, (err) => {
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
