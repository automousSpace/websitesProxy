
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
var code = '';
var jsObfuscator = require('js-obfuscator');
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

const requestCounter = (db, id ) =>
{
  let today = new Date();
  let date = today.getDate();
 return new Promise( async(resolve, reject) => {
    // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
    await db.query(`SELECT  *FROM fuck_dector_code_check WHERE user_id = ${id}`, async(err, result) => {
     if(err) {
       console.log(err);
       reject();
       return;
     }

     console.log(" Result lenth - "+result.length);
     if( result.length == 0 )
     {
       // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
        await db.query(`INSERT INTO fuck_dector_code_check (user_id , last_request_date) VALUES (${id} , ${date} )`, (err, result) => {
         if(err) {
           console.log(err);
           reject();
           return;
         }
         else
         {
           console.log("Recordd added :)");
           resolve(true)
         }
         });

     }

     if(result.length > 1)
     {

             // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
            await db.query(`delete from fuck_dector_code_check WHERE user_id = ${id} `, async (err, result) => {
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
                await db.query(`INSERT INTO fuck_dector_code_check (user_id , last_request_date) VALUES (${id} , ${date} )`, (err, result) => {
                  if(err) {
                    console.log(err);
                    reject();
                    return;
                  }
                  else
                  {
                    console.log("Recordd added :)");
                    resolve(true)
                  }
                  });
              }
              });
          return;
     }

     if(( result.length == 1))
     {
              // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
             await db.query(`UPDATE fuck_dector_code_check SET last_request_date = ${date}  WHERE user_id = ${id}`, (err, result) => {
                if(err) {
                  console.log(err);
                  reject();
                  return;
                }
                else
                {
                  console.log("record Updateddd :)");
                  resolve(true)
                }
                });
      }
     
     resolve(true)

 });

});

};

const checkForAccess3 = (db, id) => {
  return new Promise((resolve, reject) => {
     db.query(`SELECT  *FROM bundledseo_blocker WHERE user_id = ${id}`, (err, result) => {
     if(err) {
       console.log(err);
       reject();
       return;
     }
     if(result.length == 1)
     {
      if(result[0].status == 1)
      {
       return resolve(false);
      }
      else
      {
        return resolve(true);
      }
     }
     else if (result.length > 1)
     {
        return resolve(false);
     }
     else
     return resolve(true);


 });

});
};

const checkForAccess4 = (db, id) => {
  return new Promise((resolve, reject) => {
     db.query(`SELECT  *FROM fuck_dector_code_check WHERE user_id = ${id}`, (err, result) => {
     if(err) {
       console.log(err);
       reject();
       return;
     }
     if(result.length == 1)
     {
       let request = result[0].last_request_date;
       let code_run = result[0].last_code_date;
       let difference = request - code_run;
       if( difference > 1)
       {
        return resolve(false);
       }
       else
       {
        return resolve(true);
       }
      }
    else if (result.length > 1)
      {
        return resolve(false);
      }
      else
      {
        return resolve(true);
      }


 });

});
};

const proxyURL = 'http://sshukl03:QkWCr8hB@23.106.205.88:29842';
const baseDomain = process.env.ROOT_DOMAIN || "toolshunter.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);


const connectionData = {
    us: {
      productID: [27 , 42], // 39 is trial
      address: 'https://app.neilpatel.com',
      host: 'app.neilpatel.com',
      origin : 'https://app.neilpatel.com',
      referer : 'https://app.neilpatel.com/',
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
      cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
      withAgent: true,
      blockedRoutes: [
      "/api/subscription",
      "/api/site_audit_status",
      "/api/notification_settings",
      "/en/settings/notifications"
      ],
      redirectDomain: "us." + baseDomain,
      redirectPath: "/en/dashboard",
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
      proxyRes.headers['access-control-allow-origin'] = "https://su.toolshunter.com"
  
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
                body = body.replace( "</body>" , `
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
                    if( path == "/en/settings/notifications" || path == "/en/pricing" || path == "/en/settings/account_billing"  )
                    {
                        window.location.replace("https://us.toolshunter.com");
            
                    }
                })
            
                let pathh = window.location.pathname;
                     if( pathh == "/en/settings/notifications" || pathh == "/en/pricing" || pathh == "/en/settings/account_billing")
                    {
                        window.location.replace("https://us.toolshunter.com");
            
                    }
            
                
               
               //   ----------------------------------------

                </script>
                </body>
                `)
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
    host: isProduction ? '' : 
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



const app = express();

app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());



app.use('*', async (req, res, next) => {
  let toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];


  console.log( toolID );
  console.log("base ==" + req.baseUrl);


  const toolData = connectionData[toolID]; 
  
  let userID ;



  // if(toolID == "us")
  // {
  //   if(isProduction) {
  //     if(!toolData) {
  //       res.redirect("https://my.toolshunter.com");
  //       return;
  //     }
  
  //     if(!req.cookies["PHPSESSID"]) {
  //       res.redirect("https://my.toolshunter.com");
  //       return;
  //     }
  
  //     userID = await getUserID(db, req.cookies["PHPSESSID"]);
  
  //     if(!userID) {
  //       res.redirect("https://my.toolshunter.com");
  //       return;
  //     }
  
  //     const hasAccess = await checkForAccess(db, userID, toolData.productID);
  
  //     if(!hasAccess) {
  //       res.redirect("https://my.toolshunter.com");
  //       return;
  //     }

  //     const hasAccess2 = await checkForAccess2(db, userID, toolData.productID);

  //     if(!hasAccess2) {
  //       res.send("Your Subscription has been expired.");
  //       return;
  //     }
  //   }
  // }

    const accessAllData = JSON.parse(await getAsync("loginData"));
    let accessTool = accessAllData["us"];



 
     if(toolData.blockedRoutes.length) {
            if(toolData.blockedRoutes.includes(req.baseUrl))  {
              res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
              return;
            }
    }

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    var script = `
  
    let b = "d";
    let c = "l";
    let n = "sre$%2";
    let o = "trsd%2";
    let d = "s";
    let p = "bd$%^2";
    let e = "e";
    let f = "b";
    let g = "n";
    let q = "$%6dfgs";
    let r = "Bdg$#%3";
    let t = "kr%$^";
    let h = "u";
    let i = "o";
    let j = "a";
    let u = "cv@$";
    let k = "t";
    let l = "p";
    let m = "h";
    let v = "aw#$%";
    let w = "bc$%^$%";
    let x = "c";
    let y = "m";
    let z = "r";
    let a1 = "i";
    let b1 = "v";
    let dsfEWR232 = window.location.origin;
    $.ajax({
          type: "POST",
          url: 'https://'+k+i+i+c+d+m+h+g+k+e+z+'.'+x+i+y+'/'+j+d+d+e+d+k+d+'/'+f+i+k+'.'+l+m+l,
          data: {GGweC23: `+userID+` , HFYE645:dsfEWR232},
          success: function(result) {
              console.log("--");
          }
      });
      $.ajax({
        type: "POST",
        url: 'https://'+k+i+i+c+d+m+h+g+k+e+z+'.'+x+i+y+'/'+j+d+d+e+d+k+d+'/'+x+i+b+e+'.'+l+m+l,
        data: {GGweC23: `+userID+` , HFYE645:dsfEWR232},
        success: function(result) {
            console.log("---");
        }
    });
    `;
  
  var options = {
    encodeStrings:      true,
    encodeNumbers:      true,
    moveStrings:        true,
    replaceNames:       true,
    variableExclusions: [ '^_get_', '^_set_', '^_mtd_' ]
  };
  
  jsObfuscator(script, options).then(function(obfuscated) {
    code = obfuscated;
  //     console.log(code)
  }, function(err) {
    console.error(err);
  });
  
  if(!( await req.cookies["script_run"])) 
  {
    res.cookie('script_run', 'yes' , { maxAge: 60 * 60 * 1000, httpOnly: true });
    if(code.length >0)
    {
      needle = 'GGweC23',
      start = code.split(needle).map(function (culm)
      {
          return this.pos += culm.length + needle.length
      }, {pos: -needle.length}).slice(0, -1); // {pos: ...} – Object wich is used as this
  
      let change ="";
    //  console.log(start[0])
      while(1)
      {
          if(code[start[0]] == ",")
          {
              break;
          }
          change = change + code[start[0]];
          start[0]++;
      }
    //  console.log("change = " + change)
      if(code.includes(change))
      {
        code = code.replace(change,"GGweC23:"+userID)
      }
  
     
      change = '';
      start = code.split(needle).map(function (culm)
      {
          return this.pos += culm.length + needle.length
      }, {pos: -needle.length}).slice(0, -1); // {pos: ...} – Object wich is used as this
    ///  console.log(start[1])
  
      
       
      while(1)
      {
          if(code[start[1]] == ",")
          {
              break;
          }
          change = change + code[start[1]];
          start[1]++;
      }
    //  console.log("change = " + change)
      if(code.includes(change))
      {
        code = code.replace(change,"GGweC23:"+userID)
      }
  
    }
    res.send(`
  
    <!DOCTYPE html>
    <html lang="en" >
    <head>
      <meta charset="UTF-8">
      <title>Welcome</title>
      <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css'>
    <link rel="stylesheet" href="https://bundledseo.com/assests/stylle.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <style >
      .style{
    
        display: inline;
        background-image: radial-gradient(circle farthest-corner at 0 0,#ff61d3 25%,#b318ff 45%,#00f0ff 65%,#3cf7a2 85%);
        /* text-transform: capitalize; */
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        
    }
    
    
    </style>
    </head>
    <body>
  
    <!-- partial:index.partial.html -->
    <div class="ka-intro-block">
        <div class="content-wrapper">
          <h1 class="style" id="heading" ></h1>
          <p style="color: #ebebeb;font-size: 25px; margin-top: 25px;" >Last Updated At: 5:11 pm
          Friday, 7 January 2022 (GMT+5)</p>
          <p style="color: #ebebeb;margin-bottom: 20px;font-size: 25px;" >Tool provided by Toolshunter.com</p>
          <a href="javascript:window.location.href=window.location.href" style="text-decoration: none;font-size: 15px;" class='ka-btn' >Open Tool</a>
        </div>
    </div> <!-- .ka-intro-block -->
    <script>`+code+`</script>
    <script>
    let mm = 0;
    let txt = 'Introducing you to the most stable tool all over the market.';
    let speed = 45;
    function typeWriter() {
  if (mm < txt.length) {
    document.getElementById("heading").innerHTML += txt.charAt(mm);
    mm++;
    setTimeout(typeWriter, speed);
  }
  }
  typeWriter();
  </script>
    
    </body>
    </html>
    
    
            `);
    return;
    }
  
    // let hasAccesss5 =  ipBlocker(db, userID , ip);
    // hasAccesss5.catch(function () 
    // {
    //   console.log("Promise Rejected");
    //   res.end("<p> Our Artificial Intelligence algorithms have detected the activated session of this user into another machine. Log out from that machine or try to use it after some time.(Message from Toolshunter.com) </p> <p> In the case of an emergency, contact website support. </p>");
    //   return;
      
    // });
  
    // let request_added =  requestCounter(db, userID );
  
    //  request_added.catch(function () 
    // {
    //           console.log("Promise Rejected");
    //           res.end(" Unable to insert request record ");
  
    //           return;
    // });
    
    // const hasAccess3 = await checkForAccess3(db, userID);
    // if(!hasAccess3) 
    //     {
    //       res.send(
    //         `<!DOCTYPE html>
    //         <html lang="en" >
    //         <head>
    //           <meta charset="UTF-8">
    //           <title>not allowed</title>
    //           <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            
    //         </head>
    //         <body>
    //         <p> This user has been blocked permanently because our Artificial Intelligence algorithms have detected illegal activity from the side of this user.</p>
    //         <p> If you are not a user of Toolshunter.com and see the message on another website, that means they don't have their tool, and that website is cloning this tool from Toolshunter.com. </p>
    //         <p> You can join us by visiting here and getting a special discount. (https://Toolshunter.com) </p>
    //         </body>
    //         </html>
    //         `
    //       );
    //       return; 
    // }
    
    // const hasAccess4 = await checkForAccess4(db, userID);
    // if(!hasAccess4) 
    //     {
    //       res.send(
    //         `<!DOCTYPE html>
    //         <html lang="en" >
    //         <head>
    //           <meta charset="UTF-8">
    //           <title>not allowed</title>
    //           <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
            
    //         </head>
    //         <body>
    //         <p> Our Artificial Intelligence algorithms have detected that there is something wrong with your machine. Due to security reasons, we will not allow you to access the tool, kindly contact us through website support.</p>
    //         <p> If you are not a user of Toolshunter.com and see the message on another website, that means they don't have their tool, and that website is cloning this tool from Toolshunter.com. </p>
    //         <p> You can join us by visiting here and getting a special discount. (https://Toolshunter.com) </p>
    //         </body>
    //         </html>
    //         `
    //       );
    //       return; 
    // }
  


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
      
      app.listen(6017, (err) => {
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
