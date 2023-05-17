const fs = require('fs');
const { promisify, isObject } = require('util');
require('events').EventEmitter.defaultMaxListeners = 0
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const modifyResponse = require('http-proxy-response-rewrite');
const proxyingAgent = require('proxying-agent');
const redis = require('redis');
const baseDomain = process.env.ROOT_DOMAIN || "triopacks.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);


const findFromAliases = id => {
  const aliases = {
    cdnah: "ahx",
    ahelp: "ahx",
    stah: "ahx"
  };

  return aliases[id];
};

const connectionData = {
  test: {
    productID: [18, 15, 21, 34, 39],
    address: 'https://www.Keepa.com',
    host: 'Keepa.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `wordpress_test_cookie=WP%20Cookie%20check; _ga=GA1.2.2075759154.1626536058; _gid=GA1.2.1909652908.1626536058; wordpress_logged_in_6f60789958aae2c5f56fbe5f26559866=jokerseo3%7C1627745684%7CYClowVfQFvVXRLn1eDjpMVrdvOlUnvD6Hcw4JvVY3KM%7C7c339d9e55e472de45e8112831df9346c3989146226cab0f9f7ae4ad7f687b62; _gat_UA-2823791-31=1; _uetsid=73501c60e71411ebb1f2ffa59d0f9a8a; _uetvid=73507750e71411ebbfcb39b1e0967b88`,
    withAgent: true,
    blockedRoutes: [
    ],
    redirectDomain: "test." + baseDomain,
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

  //  console.log( " origin of dox ======  "+  JSON.stringify(req.headers));
  }
}

function modifyProxyResponse(responseModifiers, modifyJS = false, userID=343) {
  return function onProxyRes (proxyRes, req, res) {
    delete proxyRes.headers['set-cookie'];
    delete proxyRes.headers['Set-Cookie'];
    delete proxyRes.headers['content-length'];

    if(proxyRes.headers['content-encoding'] === 'br') {
      return;
    }

        if(proxyRes.headers['content-encoding'] === 'deflate') {
      console.log("here 222");
      return;
    }


    if(!userID) return;

    console.log("modddddddddd"+userID);

    if(proxyRes.headers['content-type'] && (proxyRes.headers['content-type'].includes('html') || modifyJS)) {
      modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
        let newBody = '';

        console.log(body)

        if (body) {

          body = body.replace("<body>" , "<body>  <script> localStorage.setItem('token', '8ev5p57mjhfaug7qvqlcvc3j588gq20s62rf0vhejjdq5dsq4hcqpl0cpfaboqq0');  </script>");
        }

        return newBody ? newBody : body;
      });
    }
  }

}

const client = redis.createClient({
  host: isProduction ? '127.0.0.1' : 
  port: '6379',
  password: ''
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);


const app = express();




app.use('*', async (req, res, next) => {
  const toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];
  const toolData = connectionData[toolID]; 


     const CircularJSON = require('flatted');
      const json = CircularJSON.stringify(req);
    // console.log("stringgg ->>>>>>>>>>>>>>>>>>>>>>>" +json);

  console.log( " tool id = " + toolID );

  console.log( " base url  = " + req.baseUrl );


//   if(  req.baseUrl == "")
//   {
//       res.setHeader( "Access-Control-Allow-Credentials" , "true")
//       res.setHeader( "Access-Control-Allow-Origin" , "*")    
//       res.end(`<!DOCTYPE html>
//       <html lang="en">
//       <head>
//           <meta charset="UTF-8">
//           <meta http-equiv="X-UA-Compatible" content="IE=edge">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Document</title>
//       </head>
//       <body>
//       <script>
//       document.cookie = "JSESSIONID=WLqQm9--E8SAO1I3n4Tbcw; mvt1=0; _gcl_au=1.1.1917301106.1628964979; _ga=GA1.2.291234402.1628964979; _gid=GA1.2.730931769.1628964979; __zlcmid=15ZkFsosQOR9cZC; affiliateId=amzfbacalc; __cf_bm=15157fffd0438655d894d41ef4dca1aa468746cb-1628968861-1800-AVJ+AO/tpsX0U9rVbdIymp+7XSBNplupejYwpxuuVNwRIXsOy5v1/xvRoFXxOCTv0kR2LLReEDhBQLlhgjIDk16CHvYkU0myVXJlpTbYvQotvPdzNXwD61yLjo0Fo8EzTc/LJk8/t7x++Bc/DD5TQwM+NgB1Y6AwP+MxNZPZ2NBz; _gat_https%3A%2F%2Fwww.merchantwords.com%2Flogin=1; _gat=1; mp_1102b81d424da9270ca275eb2e01a038_mixpanel=%7B%22distinct_id%22%3A%20%2217b45e100a43f7-04197a30716bfc-2343360-144000-17b45e100a5524%22%2C%22%24device_id%22%3A%20%2217b45e100a43f7-04197a30716bfc-2343360-144000-17b45e100a5524%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%2C%22%24search_engine%22%3A%20%22google%22%7D; ubId=f561181a79at5UfH_ubid";
//       fetch('https://www.merchantwords.com/amzcalc' ,   {
//         "body": null,
//   "method": "GET",
//   "mode": "cors",
//   "credentials": "include",

//   headers : {
//     'cookie' : 'JSESSIONID=WLqQm9--E8SAO1I3n4Tbcw; mvt1=0; _gcl_au=1.1.1917301106.1628964979; _ga=GA1.2.291234402.1628964979; _gid=GA1.2.730931769.1628964979; __zlcmid=15ZkFsosQOR9cZC; affiliateId=amzfbacalc; __cf_bm=15157fffd0438655d894d41ef4dca1aa468746cb-1628968861-1800-AVJ+AO/tpsX0U9rVbdIymp+7XSBNplupejYwpxuuVNwRIXsOy5v1/xvRoFXxOCTv0kR2LLReEDhBQLlhgjIDk16CHvYkU0myVXJlpTbYvQotvPdzNXwD61yLjo0Fo8EzTc/LJk8/t7x++Bc/DD5TQwM+NgB1Y6AwP+MxNZPZ2NBz; _gat_https%3A%2F%2Fwww.merchantwords.com%2Flogin=1; _gat=1; mp_1102b81d424da9270ca275eb2e01a038_mixpanel=%7B%22distinct_id%22%3A%20%2217b45e100a43f7-04197a30716bfc-2343360-144000-17b45e100a5524%22%2C%22%24device_id%22%3A%20%2217b45e100a43f7-04197a30716bfc-2343360-144000-17b45e100a5524%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%2C%22%24search_engine%22%3A%20%22google%22%7D; ubId=f561181a79at5UfH_ubid',
//     'origin' : 'https://www.merchantwords.com'
//   }
    
//     }
//     )
// .then(response => response.text())
//   .then(data => console.log(data))
//       .catch(function(err) {
//         console.log('Fetch Error :-S', err);
//       });



      
//   </script>
//       </body>
//       </html>`)
//       return;
//   }
//   else
//   {
//     console.log("noooooooooooo")

//   }

//console.log(JSON.stringify(req.headers))

  let userID;

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

  if(isProduction) {
    const accessAllData = JSON.parse(await getAsync("loginData"));
    if ( accessAllData == null)
    {
      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("loginData", content);
      console.log("Storage populated  again ...");
      accessAllData = JSON.parse(await getAsync("loginData"));
    }

    accessTool = accessAllData[toolID];

  //  console.log ( await accessTool);

    if(!accessTool) {
      accessTool = accessAllData[findFromAliases(toolID)];
    }

    if(!accessTool) {
      res.send("Access forbidden. You need to purchase first.");
      return;
    }

    agent = toolData.withAgent ? proxyingAgent.create("http://62.33.210.34:58918", toolData.address) : null;

    
  } else {
    agent = toolData.withAgent ? proxyingAgent.create(proxyURL, toolData.address) : null;
  }
  createProxyMiddleware({ 
    target: toolData.address,
    ws: true,
    toProxy: true,
    xfwd: false,
    onProxyReq: modifyProxyRequest(toolData.requestModifiers),
    onProxyRes: toolData.transformResponse ? modifyProxyResponse(toolData.responseModifiers, false, userID) : function() {},
    headers: {
      "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
      cookie: `mvt1=0; _gcl_au=1.1.1917301106.1628964979; _ga=GA1.2.291234402.1628964979; _gid=GA1.2.730931769.1628964979; __zlcmid=15ZkFsosQOR9cZC; affiliateId=amzfbacalc; JSESSIONID=gT3ex69W-g1WwEOqBjPMuw; _gat_https%3A%2F%2Fwww.merchantwords.com%2Flogin=1; _gat_https%3A%2F%2Fwww.merchantwords.com%2Fmy-account=1; __cf_bm=26870bcb6c207c9ff3761dc051d5a7ec4d9d3d86-1629057866-1800-AYPaJ2ymjsboL5m6mD/4XwisPpZWrsERJjZhLLi8pnI5cHsjAeDtApLNeSwIAKCkvTriLJCivULk+zVonV6JkMw+X+VvTgF5Q2rGgV1GbXqxO/X9qYUrKb/2/7Z1EuvCWk7nL6NV/HJjQmSJDGrtLLeMEeucWxssmI7MqZxVJHRq; _gat_https%3A%2F%2Fwww.merchantwords.com%2F=1; mp_1102b81d424da9270ca275eb2e01a038_mixpanel=%7B%22distinct_id%22%3A%20%22richardvaugh72%40outlook.com%22%2C%22%24device_id%22%3A%20%2217b45e100a43f7-04197a30716bfc-2343360-144000-17b45e100a5524%22%2C%22%24initial_referrer%22%3A%20%22%24direct%22%2C%22%24initial_referring_domain%22%3A%20%22%24direct%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22__mps%22%3A%20%7B%7D%2C%22__mpso%22%3A%20%7B%7D%2C%22__mpus%22%3A%20%7B%7D%2C%22__mpa%22%3A%20%7B%7D%2C%22__mpu%22%3A%20%7B%7D%2C%22__mpr%22%3A%20%5B%5D%2C%22__mpap%22%3A%20%5B%5D%2C%22%24user_id%22%3A%20%22richardvaugh72%40outlook.com%22%2C%22Email%22%3A%20%22richardvaugh72%40outlook.com%22%2C%22ubid%22%3A%20%22f561181a79at5UfH_ubid%22%2C%22userId%22%3A%20%22sL611600c5KACsxB_usr%22%7D; ubId=rm61197360DhypkM_ubid`,
      Host: toolData.host,
      host: toolData.host,
      Referer: toolData.address + req.path,
      Origin: toolData.address + req.path,
      referer: toolData.address + req.path,
      origin: toolData.address + req.path,
    },
  })(req, res, next);

});

client.on("ready", async (err) => {
  if(isProduction) {
    try {
      console.log("Connected to Redis...");

      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("loginData", content);
      console.log("Storage populated...");

   //   await connectToDB()
      console.log("Connected to MySQL...");

      app.listen(3337, (err) => {
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
    app.listen(3337, (err) => {
      if(err) {
        console.log(err);
        return;
      }

      console.log("Server running on: http://127.0.0.1:5555");
    });
  }
});


