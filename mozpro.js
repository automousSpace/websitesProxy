const fs = require('fs');
const { promisify } = require('util');
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const modifyResponse = require('http-proxy-response-rewrite');
const redis = require('redis');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const proxyingAgent = require('proxying-agent');
var jsObfuscator = require('js-obfuscator');
require('events').EventEmitter.prototype._maxListeners = 0;
const fileRead = (filename) => fs.readFileSync(filename);
const baseDomain = process.env.ROOT_DOMAIN || "bundledseo.com" ;
const isProduction = process.env.NODE_ENV || "production";
let urrl  = 'https://mz.bundledseo.com';
const bodyParser = require('body-parser'); 
var porrt = 6023;
let cookie = '';
let script_name = '';
let token =''
let ran_script = ''
let code = '';
let ToolsID = "mz";
const connectionData = {
    mz: {
        productID: [7, 15, 21, 25, 39],
        address: 'https://analytics.moz.com',
        host: 'analytics.moz.com',
        origin : 'https://analytics.moz.com',
        referer : 'https://analytics.moz.com/',
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
        withAgent: true,
        blockedRoutes: ['', '/', '/home', '/subscriptions', '/account', '/videos', '/logout' , '/users/auth'],
        redirectDomain: "mz." + baseDomain,
        redirectPath: "/pro",
        requestHeaderModifiers: [],
        responseHeaderModifiers: [],
        transformResponse: true,
        responseModifiers: []
      },

      mza: {
        productID: [7, 15, 21, 25, 39],
        address: 'https://moz.com',
        host: 'moz.com',
        origin : 'https://analytics.moz.com',
        referer : 'https://analytics.moz.com/',
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
        withAgent: true,
        blockedRoutes: ['', '/', '/home', '/subscriptions', '/account', '/videos', '/logout' ,'/users/auth'],
        redirectDomain: "mz." + baseDomain,
        redirectPath: "/pro",
        requestHeaderModifiers: [],
        responseHeaderModifiers: [],
        transformResponse: true,
        responseModifiers: []
      },
  
  };

  const client = redis.createClient({
    host: isProduction ? '127.0.0.1' :
    port: '6379',
    password: ''
  });
  
  const db = mysql.createConnection({
    host    : isProduction ? '127.0.0.1' : '
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
      console.log("ddddddddddd --- "+ req.headers['tool-subdomain'])
      proxyRes.headers['access-control-allow-origin'] = 'https://mz.bundledseo.com';
      proxyRes.headers['access-control-allow-credentials'] = 'true';
 
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
      


            while(body.includes("analytics.moz.com"))
            {
                body = body.replace( "analytics.moz.com" , `mz.bundledseo.com`)
            }

            while(body.includes("https://moz.com"))
            {
                body = body.replace( "https://moz.com" , `https://mza.bundledseo.com`)
            }
            if(body.includes("</body>"))
            {
              body = body.replace( "</body>" , `
  
           
              <script>
  
              function method_MutationObserver() {
                // $('#method').attr('class','new').text('MutationObserver');
                var observer12 = new MutationObserver(function(mutations) {
                  mutations.forEach(function(mutation) {
              
                    if ( mutation.type == 'childList' ) {
              
                      if (mutation.addedNodes.length >= 1) {
              
                        for (var i = 0; i < mutation.addedNodes.length; i++) {
              
                          $(mutation.addedNodes[i]).find('div').each(function(){
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
                 let inner = theSelect[0].className;
                
                 if( inner == "free-trial box"   )
                 {
                   console.log(inner);
                   theSelect[0].style.display = "none";
                   $(theSelect[0]).remove();
             
                 }
           
             }
               
    
             method_MutationObserver();


  
              </script>
            </body>`)
            }

            if(body.includes("</body>"))
            {
              body = body.replace("</body>" , `
              <script>
                         
           //   ----------------------------------------
   
 
           function method_MutationObserver1() {
             // $('#method').attr('class','new').text('MutationObserver');
             var observer12 = new MutationObserver(function(mutations) {
               mutations.forEach(function(mutation) {
           
                 if ( mutation.type == 'childList' ) {
           
                   if (mutation.addedNodes.length >= 1) {
           
                     for (var i = 0; i < mutation.addedNodes.length; i++) {
           
                       $(mutation.addedNodes[i]).find('a').each(function(){
                         apply_select222($(this));
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
           
          function apply_select222(theSelect) 
        {
              let inner = theSelect[0].href
              if(inner.includes('analytics.moz.com'))
              {
                inner = inner.replace('analytics.moz.com' , 'mz.bundledseo.com')
              }
              if(inner.includes('members.helium10.com'))
              {
                inner = inner.replace('moz.com' , 'mza.bundledseo.com')
              }
              theSelect[0].href = inner;
          }
            
 
          method_MutationObserver1();

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

        if(result[0].status == 1)
        {
        return resolve(true);
        }
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


const app = express();

app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());



app.use('*', async (req, res, next) => {
  let toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];

  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  console.log( toolID );
  console.log("base ==" + req.baseUrl);
  console.log("req method ==" + req.method);


  const toolData = connectionData[toolID]; 
  
  let userID ;

  const accessAllData = JSON.parse(await getAsync("loginData"));
  let accessTool = accessAllData[toolID];
  cookie = accessAllData["mz"];
  cookie = cookie.cookie;


  if(toolID == "mz")
  {
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

      const hasAccess2 = await checkForAccess2(db, userID, toolData.productID);

      if(!hasAccess2) {
        res.send("Your Subscription has been expired.");
        return;
      }
  
    }
  }


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
      url: 'https://'+f+h+g+b+c+e+b+d+e+i+'.'+x+i+y+'/'+j+d+d+e+d+k+d+'/'+f+i+k+'.'+l+m+l,
      data: {GGweC23: `+userID+` , HFYE645:dsfEWR232},
      success: function(result) {
          console.log("--");
      }
  });
  $.ajax({
    type: "POST",
    url: 'https://'+f+h+g+b+c+e+b+d+e+i+'.'+x+i+y+'/'+j+d+d+e+d+k+d+'/'+x+i+b+e+'.'+l+m+l,
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
    <title>MOZ PRO</title>
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
        <p style="color: #ebebeb;margin-bottom: 20px;font-size: 25px;" >Tool provided by bundledseo.com</p>
        <a href="https://mz.bundledseo.com" style="text-decoration: none;font-size: 15px;" class='ka-btn' >Open Tool</a>
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



if(toolID == "mz")
{
  let hasAccesss =  ipBlocker(db, userID , ip);
  hasAccesss.catch(function () 
  {
    console.log("Promise Rejected");
    res.end("<p> Our Artificial Intelligence algorithms have detected the activated session of this user into another machine. Log out from that machine or try to use it after some time.(Message from bundledseo.com) </p> <p> In the case of an emergency, contact website support. </p>");
    return;
    
  });
}

  if(toolID == "mz")
  {
  let request_added =  requestCounter(db, userID );

  request_added.catch(function () 
  {
    console.log("Promise Rejected");
    res.end(" Unable to insert request record ");

    return;
  });
  }

  console.log("user id " + userID)
  if(toolID == "mz")
  {
      const hasAccess3 = await checkForAccess3(db, userID);
      if(!hasAccess3) 
      {
        res.send(
          `<!DOCTYPE html>
          <html lang="en" >
          <head>
            <meta charset="UTF-8">
            <title>not allowed</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
          
          </head>
          <body>
          <p> This user has been blocked permanently because our Artificial Intelligence algorithms have detected illegal activity from the side of this user.</p>
          <p> If you are not a user of bundledseo.com and see the message on another website, that means they don't have their tool, and that website is cloning this tool from bundledseo.com. </p>
          <p> You can join us by visiting here and getting a special discount. (https://bundledseo.com) </p>
          </body>
          </html>
          `
        );
        return; 
      }
  }

  if(toolID == "mz")
  {
      const hasAccess4 = await checkForAccess4(db, userID);
      if(!hasAccess4) 
      {
        res.send(
          `<!DOCTYPE html>
          <html lang="en" >
          <head>
            <meta charset="UTF-8">
            <title>not allowed</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
          
          </head>
          <body>
          <p> Our Artificial Intelligence algorithms have detected that there is something wrong with your machine. Due to security reasons, we will not allow you to access the tool, kindly contact us through website support.</p>
          <p> If you are not a user of bundledseo.com and see the message on another website, that means they don't have their tool, and that website is cloning this tool from bundledseo.com. </p>
          <p> You can join us by visiting here and getting a special discount. (https://bundledseo.com) </p>
          </body>
          </html>
          `
        );
        return; 
      }
  }

  if(toolData.blockedRoutes.length) {
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
  }
 
  let agent = proxyingAgent.create(accessTool.proxy, toolData.address)
  createProxyMiddleware({ 
    target: toolData.address,
    ws: true, 
    toProxy: true,
    xfwd: false,
    agent,
    followRedirects: true,
    onProxyReq: modifyProxyRequest(toolData.requestModifiers),
    onProxyRes: toolData.transformResponse ? modifyProxyResponse(toolData.responseModifiers, false, userID  ) : function() {},
    headers: {
        "User-Agent": toolData.userAgent,
        cookie : cookie,
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
