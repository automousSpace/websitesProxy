const fs = require('fs');
const { promisify } = require('util');
const puppeteer = require('puppeteer'); 
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const modifyResponse = require('http-proxy-response-rewrite');
const redis = require('redis');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
require('events').EventEmitter.prototype._maxListeners = 0;

const baseDomain = process.env.ROOT_DOMAIN || "toolsdriver.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);


const connectionData = {
    su: {
      productID: [1], // 39 is trial
      address: 'https://app.peppertype.ai',
      host: 'app.peppertype.ai',
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
      cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
      withAgent: true,
      blockedRoutes: [
          "/",
          ""
      ],
      redirectDomain: "su." + baseDomain,
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
    api: {
      productID: [1], // 39 is trial
      address: 'https://api.peppertype.ai',
      host: 'api.peppertype.ai',
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
      cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
      withAgent: true,
      blockedRoutes: [
  
      ],
      redirectDomain: "api." + baseDomain,
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
  
  function modifyProxyResponse(responseModifiers, modifyJS = false, userID , tokenn) {
    return function onProxyRes (proxyRes, req, res) {
      delete proxyRes.headers['set-cookie'];
      delete proxyRes.headers['Set-Cookie'];
      delete proxyRes.headers['content-length'];
      proxyRes.headers['access-control-allow-origin'] = "https://su.toolsdriver.com"
  
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
  
          
            newBody = responseModifiers.reduce((acc, modifier) => {
              acc = modifier(acc || body, userID);
              return acc;
            }, '');

            let script = ''
            if(body.includes("/_next/static/chunks/pages/_app-"))
            {
              let start = body.indexOf("/_next/static/chunks/pages/_app-")
              
              while(true)
              {
                  if(body[start] == '"')
                  {
                    break;
                  }
                  script = script + body[start];
                  start++;
              }
            }
            //////
            /////////

              if(newBody.includes(script) && newBody.includes("/_next/static/chunks/pages/_app-") )
              {
                newBody = newBody.replace(script , "https://su.toolsdriver.com/app.js")
              }

      

            ////////////

            // if(newBody.includes("<head>"))
            // {
            //     newBody = newBody.replace("<head>",`
            //     <head>
            //     <script>
            //     localStorage.setItem("idToken", "eyJraWQiOiJqNWVVQ2F5Qjl5K3NWNEZuZEV5WlQ2TVFpeWx6bWFpVzhXY1lTeVpXOUdnPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI5NGM4MmQ3Ny1lMGM4LTQ2OTAtOTAxMC03MWY2M2UwYzg4OTYiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmFwLXNvdXRoLTEuYW1hem9uYXdzLmNvbVwvYXAtc291dGgtMV8xNWdJWHhDdUYiLCJjb2duaXRvOnVzZXJuYW1lIjoiOTRjODJkNzctZTBjOC00NjkwLTkwMTAtNzFmNjNlMGM4ODk2IiwiZ2l2ZW5fbmFtZSI6Ik1yIiwiYXVkIjoiM21qdWVldTE4N3FwZnAydWJidnZrOGttNmoiLCJldmVudF9pZCI6ImUyZTRiMmRmLTc5M2YtNDA4Zi05YWZiLTEyYmFiMTEyMTA0MCIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjM5NTA3MDU3LCJuYW1lIjoiTXIgSHVudGVyIiwiZXhwIjoxNjQxMDMwMTg1LCJpYXQiOjE2NDA5NDM3ODUsImZhbWlseV9uYW1lIjoiSHVudGVyIiwiZW1haWwiOiJhdWVva2xAYWxpbG90LmNvbSJ9.eNi8-HgJey_O_H2NYGOWimDZTb7hEM4nK7Gi2jxvUItLP7HeBd6yzc08RAbtADpCvLkkx7IrBYF_38FTUhckezTsMQFobLPnCzvFlJbWEs7jxz5vgHCbXDR_jta0ty1bZUDEKrCqRyp1nntIKFahaVV1bvk4VNS8ygY7hGFEWSwIZpnLvZIKLJlqDEO8rGzIs5xif_YMCVd0xC3zC1-HsmmUWB5IFuROgiTHbWSTDF4-qvV_N-hrYwPuJvD9x_iDlsB4S2A78AYM-DB0Pqi0V4rts0U3IeWCMKVHtYxgRhg4R_TGwmxyMtb-89Mnx16cC3X4ACANfrQ9n4mW29PYHw");
            //   </script>
                
            //     `)
            // }

            if(newBody.includes("</body>"))
            {
              newBody = newBody.replace( "</body>" , `
  
           
              <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>
  
        
              <script>
  
  
              //////------------------------------------
  
  
             
              var saveLogin = function(data)
              {
                localStorage.setItem("idToken", data.login);
                console.log("--done" + data.login)
              }
  
              ////----------------------------------------
  
              $("body").on("click", "button[type='submit']", function()
              {

                  let str = $(this).text();
                  console.log("-----"+str);
                  var xx = localStorage.getItem("idToken");
                  fetch('https://api.toolsdriver.com/gpt/user', {
                    method: 'GET', 
                    headers: {
                    'origin': 'https://app.peppertype.ai',
                    'authorization' : 'Bearer '+ xx,
                    } 
                    })
                    .then(response=>response.json())
                    .then(data=>
                      {
                        let id = data.data.teams[0].gsi3_pk;
                        id = id.split('#');
                        id = id[1];
                        console.log(id);
                        fetch('https://api.toolsdriver.com/gpt/subscription?teamId='+id, {
                          method: 'GET', 
                          headers: {
                          'origin': 'https://app.peppertype.ai',
                          'authorization' : 'Bearer '+ xx,
                          } 
                          })
                          .then(response=>response.json())
                          .then(data1=>{
                      
                            console.log(JSON.stringify(data1.data.remaining))
                            let rem = data1.data.remaining;
                                      rem = rem - 200;
                                      console.log(rem);
                                      if(rem < 9000)
                                      {
                                
                                        fetch("/mrblack", 
                                        {
                                        method: "GET",
                                        headers: { "Content-Type": "application/json" },
                                        })
                                        .then(res => res.json())
                                        .then(data => 
                                          {
                                            if(data.success) 
                                            {
                                              //  console.log("Login updated...");
                                              saveLogin(data);
                                            } else 
                                            {
                                            alert("Failed saving...");
                                            }
                                          });
                                          ////
                              
                                      }
                      
                                });
                                ///
                      
                      })
              });
         
              ////----------------------------------------

              $("body").on("click", "button[data-id='generate-more-button']", function()
              {

                  let str = $(this).text();
                  console.log("-----"+str);
                  var xx = localStorage.getItem("idToken");
                  fetch('https://api.toolsdriver.com/gpt/user', {
                    method: 'GET', 
                    headers: {
                    'origin': 'https://app.peppertype.ai',
                    'authorization' : 'Bearer '+ xx,
                    } 
                    })
                    .then(response=>response.json())
                    .then(data=>
                      {
                        let id = data.data.teams[0].gsi3_pk;
                        id = id.split('#');
                        id = id[1];
                        console.log(id);
                        fetch('https://api.toolsdriver.com/gpt/subscription?teamId='+id, {
                          method: 'GET', 
                          headers: {
                          'origin': 'https://app.peppertype.ai',
                          'authorization' : 'Bearer '+ xx,
                          } 
                          })
                          .then(response=>response.json())
                          .then(data1=>{
                      
                            console.log(JSON.stringify(data1.data.remaining))
                            let rem = data1.data.remaining;
                                      rem = rem - 200;
                                      console.log(rem);
                                      if(rem < 9000)
                                      {
                                
                                        fetch("/mrblack", 
                                        {
                                        method: "GET",
                                        headers: { "Content-Type": "application/json" },
                                        })
                                        .then(res => res.json())
                                        .then(data => 
                                          {
                                            if(data.success) 
                                            {
                                              //  console.log("Login updated...");
                                              saveLogin(data);
                                            } else 
                                            {
                                            alert("Failed saving...");
                                            }
                                          });
                                          ////
                              
                                      }
                      
                                });
                                ///
                      
                      })
              });
  
              ////////-----------------------------------------------------
  

             
             //   ----------------------------------------
     
 
  
  
              </script>
            </body>`)
            }


           //   console.log(body)
  
  /////////////////////////////
  
          }
  
          return newBody ? newBody : body;
        });
      }
    }
  
  }

  const client = redis.createClient({
    host: '127.0.0.1' ,
    port: '',
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


let accessCache = {};

setInterval(() => {
  accessCache = {};
}, 120000);




const app = express();

app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());


app.get("/mrblack", bodyParser.json(), async (req, res) => {

  console.log("Account changerrr ");
  let userID = await getUserID(db, req.cookies["PHPSESSID"]);
  
  if(!userID) {
    res.send("Access forbidden. 3");
    return;
  }
  let userid  = userID;
  try
  { 
    let [token , words ,  user] = await AlotAccount(db, userid , "new" );
    if([token , words ,  user])
    {
      console.log("Promise passeddd...");
      res.json({ success: true , login:token , user:user});
    }
    else
    {
      console.log("Promise Rejected");
            res.end("Wait for the worker to make setup account for you");
            return;
    }
  }
  catch
  {
    console.log("Promise Rejected");
    res.end("Wait for the worker to make setup account for you");
    return;
  }

});


app.use('*', async (req, res, next) => {
  let toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];

  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  console.log( toolID );
  console.log("base ==" + req.baseUrl);


  const toolData = connectionData[toolID]; 
  
  let userID ;


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
    onProxyRes: toolData.transformResponse ? modifyProxyResponse(toolData.responseModifiers, false, userID , tokenn ) : function() {},
    headers: {
      "User-Agent": toolData.userAgent,
      Host: toolData.host,
      host: toolData.host,
      referer: "https://app.peppertype.ai/",
      origin: "https://app.peppertype.ai",
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
      
      app.listen(2001, (err) => {
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
