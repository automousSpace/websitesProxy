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
const baseDomain = process.env.ROOT_DOMAIN || "amztoolsrush.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);
var cookies = '';
var webname = "helium10.amztoolsrush.com";

const findFromAliases = id => {
  const aliases = {
    cdnah: "ahx",
    ahelp: "ahx",
    stah: "ahx"
  };

  return aliases[id];
};

const connectionData = {
  helium: {
    productID: [3,4,5,6],
    address: 'https://members.helium10.com',
    host: 'members.helium10.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
      "/profits",
      "/account/notifications",
      "/subscribe",
      "/user/signout",
      "/trendster",
      "/scribbles",
      "/audience",
      "/profits",
      "/inventory-protector",
      "/alerts",
      "/profile/index",
      "/user/change-pass",
      "/user/change-email",
      "/profile/index",
      
    ],
    redirectDomain: "helium10." + baseDomain,
    redirectPath: "",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("test", "UserID: ", userID);
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

function modifyProxyResponse(responseModifiers, modifyJS = false, userID=343) {
  return function onProxyRes (proxyRes, req, res) {
     proxyRes.headers['set-cookie'];

    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['content-security-policy-report-only'];
 
  var newBody ='';

    if(proxyRes.headers['content-encoding'] === 'br') {
      console.log("here");
      return;
    }


    if(proxyRes.headers['content-encoding'] === 'deflate') 
    {
      return;
     
    }



    if(proxyRes.headers['content-type'] && (proxyRes.headers['content-type'].includes('html') || modifyJS)) {
      modifyResponse(res, proxyRes.headers['content-encoding'], function (body) 
      {

        if (body) {

       
            while(body.includes("members.helium10.com"))
            {
                body = body.replace("members.helium10.com" , webname);

            }

   

            if(body.includes("https://re-cdn.helium10.com/common/lib/1.1.23/common.umd.js"))
            {
              body = body.replace("https://re-cdn.helium10.com/common/lib/1.1.23/common.umd.js" , "https://access.amztoolsrush.com/assests/common_3.umd.js")
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
              if(inner.includes('members.helium10.com'))
              {
                inner = inner.replace('members.helium10.com' , 'helium10.amztoolsrush.com')
              }
              theSelect[0].href = inner;
          }
            
 
          method_MutationObserver();

          ///--------------------------
              </script>
              </body>
              `)
            }

  
      
          console.log("in body")

        }
        return  body;
      });
    }
  }

}

const client = redis.createClient({
  host: isProduction ? '127.0.0.1',
  port: '',
  password: ''
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

let accessCache = {};



const db = mysql.createConnection({
  host    :  '12',
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
const app = express();

app.get("/authenticationsetter", async (req, res) => {
  const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
  await setAsync("amztoolsrush", content);
  const auth = await getAsync("amztoolsrush");
  res.render("pages/sessions", { sessions: JSON.parse(auth) });
});


app.post("/setsessions", bodyParser.json(), async (req, res) => {
  try { 
    const { tool, proxy, cookie } = req.body;
    const auth = await getAsync("amztoolsrush");
    const parsed = JSON.parse(auth);

    parsed[tool] = { 
      name: parsed[tool]["name"], 
      proxy, 
      cookie 
    };

    const forSave = JSON.stringify(parsed);
    await setAsync("amztoolsrush", forSave);

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

app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
//app.use(express.json());


//app.use(bodyParser.urlencoded({ extended: true }));
app.use('*', async (req, res, next) => {
  const toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];
  const toolData = connectionData[toolID]; 

  console.log(req.baseUrl);
  console.log(req.url);


  let userID;
  console.log( " tool id = " + toolID );


  let cookies_from_machine = req.headers["cookie"];



  if(isProduction) {
    if(!toolData) {
      res.send("Access forbidden. 1");
      return;
    }

    if(!req.cookies["PHPSESSID"]) {
      res.send("Access forbidden. 2");
      return;
    }

    userID = await getUserID(db, req.cookies["PHPSESSID"]);

    if(!userID) {
      res.send("Access forbidden. 3");""
      return;
    }

    const hasAccess = await checkForAccess(db, userID, toolData.productID);

    if(!hasAccess) {
      res.send("Access forbidden. 4");
      return;
    }
  }


  if( req.baseUrl == "/cerebro/amazon/reverse-search")
  {
    await next();
    return;
  }

//   if( req.baseUrl == "/api/v1/customers/segment-track")
//   {
//     await next();
//     return;
//   }

  if( req.baseUrl == "/magnet2/amazon/reverse-search")
  {
    await next();
    return;
  }

//   if( req.baseUrl == "/cerebro/amazon/balance")
//   {
//     await next();
//     return;
//   }

//   if( req.baseUrl == "/black-box/set-marketplace")
//   {
//     await next();
//     return;
//   }

  if(isProduction) {

    console.log( " second = " + toolID );
  if(toolData.blockedRoutes.length) {
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
  }

  }


console.log( " downnn" );

  let agent;
  let accessTool;
  let accessTool1;

  if(isProduction) {
    const accessAllData = JSON.parse(await getAsync("amztoolsrush"));
    if ( accessAllData == null)
    {
      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("amztoolsrush", content);
      console.log("Storage populated  again ...");
      accessAllData = JSON.parse(await getAsync("amztoolsrush"));
    }

    accessTool = accessAllData[toolID];
    accessTool1 = accessAllData["helium1"];


    if(!accessTool) {
      accessTool = accessAllData[findFromAliases(toolID)];
    }

    if(!accessTool) {
      res.send("Access forbidden. You need to purchase first.");
      return;
    }

    agent = toolData.withAgent ? proxyingAgent.create(accessTool.proxy, toolData.address) : null;


  var output = {};
  cookies_from_machine.split(/\s*;\s*/).forEach(function(pair) {
  pair = pair.split(/\s*=\s*/);
  output[pair[0]] = pair.splice(1).join('=');
  });
  
  output.sid =  accessTool.cookie;
  output._identity =  accessTool1.cookie;
  cookies_from_machine = "";
  for (let [key, value] of Object.entries(output)) {
    cookies_from_machine =  cookies_from_machine + key + "=" + value + ";"
  }
  //console.log(cookies_from_machine);

  cookies = cookies_from_machine;
    
  } else {
    agent = toolData.withAgent ? proxyingAgent.create(proxyURL, toolData.address) : null;
  }

  if( req.baseUrl == "/cerebro/amazon/reverse-search")
  {
    await next();
    return;
  }

  
  if( req.baseUrl == "/magnet2/amazon/reverse-search")
  {
    await next();
    return;
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
      cookie: cookies_from_machine ,
      "host": toolData.host,
      "referer": toolData.address + req.baseUrl + req.url,
      "origin": toolData.address,
    },
  })(req, res, next);

});

app.get("/cerebro/amazon/reverse-search",  async(request, response) => {

  console.log( " base url  = "+request.baseUrl + request.url);
  const https = require('https')
  const options = {
  hostname: 'members.helium10.com',
  path: request.baseUrl + request.url,
  method: 'GET',
  headers: {
  
    //'referer': 'https://members.helium10.com/?accountId=1544474233',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'x-csrf-token': "PkG-VFZlgti6tAUYth-6NZ_BMfZJHKIPyAEqf3RnDCV4EtQ3GwTXrd6CYkfVVPZ9_PV1hwFa51miR1kcNhBvbQ==",
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'cookie' : cookies
  }

  }

  const req = https.request(options,  res => {
  console.log(`statusCode: ${res.statusCode}`)

  if(res.statusCode == 302)
  {
      console.log(JSON.stringify(res.headers))
      let location = res.headers['x-redirect'];
      if ( location.includes("members.helium10.com"))
      {
        location = location.replace("members.helium10.com" , webname);
      }
      response.setHeader("location" ,location)

    

      response.sendStatus(302)
  }

  res.on('data',  d => {
    process.stdout.write(d)
      response.send(d);
  })
  })


  req.on('error', error => {
  console.error(error)
  })

  req.end();
});

app.post("/cerebro/amazon/balance",  async(request, response) => {
  console.log("event ->>>>>>>>>>>>>>>>>>>>>>>"+ request.baseUrl + request.url);

const https = require('https')
const options = {
hostname: 'members.helium10.com',
path: request.baseUrl + request.url,
method: 'POST',
headers: {

  //   'referer': 'https://members.helium10.com/?accountId=1544474233',
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/json; charset=UTF-8',
  'x-csrf-token':'PkG-VFZlgti6tAUYth-6NZ_BMfZJHKIPyAEqf3RnDCV4EtQ3GwTXrd6CYkfVVPZ9_PV1hwFa51miR1kcNhBvbQ==',
  'cookie' : '_gcl_au=1.1.916013767.1633283795; _ga=GA1.3.1112991541.1633283798; _gid=GA1.3.1591838461.1633283798; _fbp=fb.1.1633283804174.1834951603; _pin_unauth=dWlkPU4yTmtORGczWldJdE4yTmpNaTAwTVRBd0xUazRZbU10TkRoa05qWTRPVGt5WlRBMQ; io=LErsI72kPwNIbVisbUTW; _uetsid=42f4d410247311eca2cb0b1aefa718e9; _uetvid=42f58c20247311ec86ebf597465dbfee; AWSALB=TwiqFFbYmogLieUsauSyFzPliyWu38vBXjW3jgl0BThZwjoXmHKNmWYFf+1tNSdEW9eiD8L+2X3AocfTYg0PLfyzEfzymRdshgpsLE7KeZjCKeYk3D0hVqXH7yfQ; AWSALBCORS=TwiqFFbYmogLieUsauSyFzPliyWu38vBXjW3jgl0BThZwjoXmHKNmWYFf+1tNSdEW9eiD8L+2X3AocfTYg0PLfyzEfzymRdshgpsLE7KeZjCKeYk3D0hVqXH7yfQ; _dd_s=logs=1&id=a7889c02-9f0c-4b57-a301-b26cda5a7ddf&created=1633283792595&expire=1633285628038; sid=krpg9mlsh5tkhghegp9utc5ek5; _identity=bc4c9706a34f3519b4150215d21c44c7af19ae1aba89ccd1510906140e087032a%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_identity%22%3Bi%3A1%3Bs%3A112%3A%22%5B1544504064%2C%22_-EqxNh7CSS6sH_6BIcToWCIuGohX3D-%22%2C2592000%2C%22hVdL4Wa6ytFrWDNJ0K17YJeX1rwdy_iT%22%2Cnull%2C%22138.197.140.91%22%5D%22%3B%7D; _csrf=58a39d0d71b0d0fa179c43e05ef45b24fe81584ebf303436e88a70b3e46f63c6a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22FSjcMaUud6g_cKLHc4DqHFEVjFscBwcH%22%3B%7D; sidebar=10e72d2c5fa6bd03252eaf0d9f87e2bc1020bb80d5d174d7a4a3ed09e7a80426a%3A2%3A%7Bi%3A0%3Bs%3A7%3A%22sidebar%22%3Bi%3A1%3Bs%3A0%3A%22%22%3B%7D'
  }
}

const req = https.request(options,  res => {
console.log(`statusCode: ${res.statusCode}`)



res.on('data',  d => {
  process.stdout.write(d)
  response.setHeader("content-type","application/json; charset=UTF-8")
 // response.setHeader("cookie","_identity=2fef2511ccb781265ef10fa986f8ecb8ae1ad8fd497bfc9eb3e3440fdae61d2aa%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_identity%22%3Bi%3A1%3Bs%3A111%3A%22%5B1544504064%2C%22vUQkQBptd2uI-P1U1R8yAqRl2t4_zHDM%22%2C2592000%2C%22SxELIjB0Z35SiIsggW1ZekFmFjbB8mce%22%2Cnull%2C%22134.122.40.64%22%5D%22%3B%7D; expires=Mon, 01-Nov-2021 18:10:44 GMT; Max-Age=2592000; path=/; secure; HttpOnly; SameSite=None")
  // response.setHeader("","")
  // response.setHeader("","")
  response.end(d);
})
})


req.on('error', error => {
console.error(error)
})


req.end();
});

app.get("/magnet2/amazon/reverse-search",  async(request, response) => {

  console.log( " base url  = "+request.baseUrl + request.url);
  const https = require('https')
  const options = {
  hostname: 'members.helium10.com',
  path: request.baseUrl + request.url,
  method: 'GET',
  headers: {
  
 //   'referer': 'https://members.helium10.com/?accountId=1544474233',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
    'x-csrf-token': "PkG-VFZlgti6tAUYth-6NZ_BMfZJHKIPyAEqf3RnDCV4EtQ3GwTXrd6CYkfVVPZ9_PV1hwFa51miR1kcNhBvbQ==",
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json',
    'cookie' : cookies
}
  }

  const req = https.request(options,  res => {
  console.log(`statusCode: ${res.statusCode}`)

  if(res.statusCode == 302)
  {
      console.log(JSON.stringify(res.headers))
      let location = res.headers['x-redirect'];
      if ( location.includes("members.helium10.com"))
      {
        location = location.replace("members.helium10.com" , webname);
      }
      response.setHeader("location" ,location)

    //  response.setHeader("set-cookie" ,res.headers['set-cookie'])
      response.sendStatus(302)
  }

  res.on('data',  d => {
    process.stdout.write(d)
      response.send(d);
  })
  })


  req.on('error', error => {
  console.error(error)
  })

  req.end();
});

app.post("/api/v1/customers/segment-track",  async(request, response) => {
  console.log("event ->>>>>>>>>>>>>>>>>>>>>>>");

  const https = require('https')

  const data = (JSON.stringify(request.body));

  

  const options = {
  hostname: 'members.helium10.com',
  path: request.baseUrl + request.url,
  method: 'POST',
  headers: {
  
 //     'referer': 'https://members.helium10.com/?accountId=1544474233',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
      'x-csrf-token': "PkG-VFZlgti6tAUYth-6NZ_BMfZJHKIPyAEqf3RnDCV4EtQ3GwTXrd6CYkfVVPZ9_PV1hwFa51miR1kcNhBvbQ==",
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      'cookie' : cookies
      }
  }
  
  const req = https.request(options, res => {
  console.log(`statusCode  : ${res.statusCode}`)
  
  res.on('data', d => {
      process.stdout.write(d)
    response.setHeader("access-control-allow-credentials" ,"true")
    response.setHeader("access-control-allow-origin" ,"*");
    response.end(d);
  
  })
  })
  
  req.on('error', error => {
  console.error(error)
  })
  
  req.write(data)
  req.end()
});

app.post("/black-box/set-marketplace",  async(request, response) => {
  console.log("event ->>>>>>>>>>>>>>>>>>>>>>>");

  
    const CircularJSON = require('flatted');
    let json = CircularJSON.stringify(request.body);
    json = JSON.parse(json);
    let market = json[1]
     console.log("stringgg ->>>>>>>>>>>>>>>>>>>>>>>" + market);


  const qs = require('qs');


const https = require('https')
const options = {
hostname: 'members.helium10.com',
path: request.baseUrl + request.url,
method: 'POST',
headers: {

  //   'referer': 'https://members.helium10.com/?accountId=1544474233',
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'x-csrf-token':'PkG-VFZlgti6tAUYth-6NZ_BMfZJHKIPyAEqf3RnDCV4EtQ3GwTXrd6CYkfVVPZ9_PV1hwFa51miR1kcNhBvbQ==',
  'cookie' : '_gcl_au=1.1.916013767.1633283795; _ga=GA1.3.1112991541.1633283798; _gid=GA1.3.1591838461.1633283798; _fbp=fb.1.1633283804174.1834951603; _pin_unauth=dWlkPU4yTmtORGczWldJdE4yTmpNaTAwTVRBd0xUazRZbU10TkRoa05qWTRPVGt5WlRBMQ; io=LErsI72kPwNIbVisbUTW; _uetsid=42f4d410247311eca2cb0b1aefa718e9; _uetvid=42f58c20247311ec86ebf597465dbfee; AWSALB=TwiqFFbYmogLieUsauSyFzPliyWu38vBXjW3jgl0BThZwjoXmHKNmWYFf+1tNSdEW9eiD8L+2X3AocfTYg0PLfyzEfzymRdshgpsLE7KeZjCKeYk3D0hVqXH7yfQ; AWSALBCORS=TwiqFFbYmogLieUsauSyFzPliyWu38vBXjW3jgl0BThZwjoXmHKNmWYFf+1tNSdEW9eiD8L+2X3AocfTYg0PLfyzEfzymRdshgpsLE7KeZjCKeYk3D0hVqXH7yfQ; _dd_s=logs=1&id=a7889c02-9f0c-4b57-a301-b26cda5a7ddf&created=1633283792595&expire=1633285628038; sid=krpg9mlsh5tkhghegp9utc5ek5; _identity=bc4c9706a34f3519b4150215d21c44c7af19ae1aba89ccd1510906140e087032a%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_identity%22%3Bi%3A1%3Bs%3A112%3A%22%5B1544504064%2C%22_-EqxNh7CSS6sH_6BIcToWCIuGohX3D-%22%2C2592000%2C%22hVdL4Wa6ytFrWDNJ0K17YJeX1rwdy_iT%22%2Cnull%2C%22138.197.140.91%22%5D%22%3B%7D; _csrf=58a39d0d71b0d0fa179c43e05ef45b24fe81584ebf303436e88a70b3e46f63c6a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22FSjcMaUud6g_cKLHc4DqHFEVjFscBwcH%22%3B%7D; sidebar=10e72d2c5fa6bd03252eaf0d9f87e2bc1020bb80d5d174d7a4a3ed09e7a80426a%3A2%3A%7Bi%3A0%3Bs%3A7%3A%22sidebar%22%3Bi%3A1%3Bs%3A0%3A%22%22%3B%7D'
  }
}

const req = https.request(options,  res => {
console.log(`statusCode: ${res.statusCode}`)



res.on('data',  d => {
  process.stdout.write(d)
  response.setHeader("content-type","application/json; charset=UTF-8")
  response.end(d);
})
})


req.on('error', error => {
console.error(error)
})

req.write("marketplace="+market);
req.end();
});


  

client.on("ready", async (err) => {
  if(isProduction) {
    try {
      console.log("Connected to Redis...");

      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("amztoolsrush", content);
      console.log("Storage populated...");

      await connectToDB()
      console.log("Connected to MySQL...");

      app.listen(5501, (err) => {
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
    app.listen(7000, (err) => {
      if(err) {
        console.log(err);
        return;
      }

      console.log("Server running on: http://127.0.0.1:5555");
    });
  }
});


