const fs = require('fs');
const { promisify } = require('util');
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
require('events').EventEmitter.prototype._maxListeners = 0;
const baseDomain = process.env.ROOT_DOMAIN || "seotoolsrush.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);
const proxyURL = 'http://akhan72:46xgqCJz@23.110.166.9:29842';


const logData = (payload) => {
  fs.appendFile('./access-data.txt', JSON.stringify(payload) + "\n", function (err) {
    if (err) console.log(err);
    console.log('Saved!');
  });
};

const getDomain = subdomain => {
  return isProduction ? `https://${subdomain}.${baseDomain}` : `http://${subdomain}.${baseDomain}`;
};

const findFromAliases = id => {
  const aliases = {
    cdnah: "ahx",
    ahelp: "ahx",
    stah: "ahx"
  };

  return aliases[id];
};

const connectionData = {

    sr: {
        productID: [4,5,6],
        address: 'https://www.semrush.com',
        host: 'www.semrush.com',
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
        cookie: 'localization=%7B%22locale%22%3A%22en%22%7D; ref_code=__default__; refer_source=""; _ga=GA1.2.1371536908.1613819135; _gcl_au=1.1.1952834132.1613819135; _fbp=fb.1.1613819135346.120283621; _cat=CAT1.3.961915424.1613819135394; mindboxDeviceUUID=684e2dbe-ccac-4865-85a5-bcbd8ec500ec; directCrm-session=%7B%22deviceGuid%22%3A%22684e2dbe-ccac-4865-85a5-bcbd8ec500ec%22%7D; _pin_unauth=dWlkPU5ETmxOamczT1RBdE1qWmxPUzAwTm1RNUxXSmtNR0V0TXpZME5qTmlaR05qWVdGbQ; cookie_banner_exp=cookie_banner_exp.nothing; GCLB=CKqTmreZuOeDtAE; visit_first=1614846361825; _gid=GA1.2.449946265.1614846362; _rdt_uuid=1614846440320.530b5fe3-deaa-4efe-b738-1e4f07e35f6f; site_csrftoken=9IWAHz3bSkmQtSza08aCUtyqKxbUYu7ZcPl7aT6RRhFWVpgUMwhSgBznb946Cfjd; G_ENABLED_IDPS=google; last_sidebar_tk=management; lux_uid=161486845399872699; PHPSESSID=fabbd75bca59e82a408d0148eb00ffe7; SSO-JWT=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJmYWJiZDc1YmNhNTllODJhNDA4ZDAxNDhlYjAwZmZlNyIsImlhdCI6MTYxNDg2ODQ4NCwiaXNzIjoic3NvIiwidWlkIjo4MDQ5NzI4fQ.GaBf4m7wEXw4zt_DEey5ncO3I5td0vNuQ5UHchKzgYKm3Z-dPrQdR0SuE2fxe0sw6GYEPxHkCqgOJi6BPVBWtg; sso_token=7df6a04f57cbac80986222a905ad076f8e524045c02cb141bcaadac51c5c40b3; _uetsid=6fbec2107cc311eba9fffbdc2f45503d; _uetvid=6fbefcb07cc311eb8519a9b640f2d029; __insp_wid=117404642; __insp_slim=1614868494626; __insp_nv=true; __insp_targlpu=aHR0cHM6Ly93d3cuc2VtcnVzaC5jb20vZGFzaGJvYXJkLw%3D%3D; __insp_targlpt=RGFzaGJvYXJkIHwgU2VtcnVzaA%3D%3D; __insp_norec_howoften=true; __insp_norec_sess=true; intercom-session-cs07vi2k=TG5Bamt4RkhBS25VTDd0Tkl2dGRrMVdMczh3aFVuUHIxQVBNR2kwYUxZeFlIRElXTW4rUmlKUkdRQ3hUSW9aQi0tWG9iS3QydExqUmZiKzZOdEtvWXZOQT09--7bb3c4bc92a37031523c4d581519ace5d243844f',
        withAgent: true,
        blockedRoutes: [
          '',
          '/',
          '/dashboard',
          '/accounts/profile',
          '/billing-admin/profile/subscription',
          '/corporate/account',
          '/product/payments/index.html',
          '/accounts/queries',
          '/user',
          '/user/',
          '/api-documentation',
          '/api-documentation/',
          '/sso/logout',
          '/prices',
          '/features',
          '/company',
          '/company/careers',
          '/company/stories',
          '/company/trusted-data-provider',
          '/company/contacts',
          '/stats',
          '/company/request-demo',
          '/company/custom-reports',
          '/sensor',
        ],
        redirectDomain: "xemrush." + baseDomain,
        redirectPath: "/position-tracking",
        requestHeaderModifiers: [],
        responseHeaderModifiers: [],
        transformResponse: true,
        responseModifiers: [
          function(body, userID) {
            console.log("SEMRush", "UserID: ", userID);
            body = body.replace("Your browser is out of date.", `
              <script>
                setInterval(function() {
                  const navRight = document.querySelector(".srf-navbar__right");
                  if(navRight) { navRight.remove(); }
                });
              </script>
            `);
    
            body = body.replace(/window.intercomSettings.*};/gm, '');
            //body = body.replace(/window.sm2.user.*};/gm, '');
            return body;
          }
        ]
      },
    

};

function modifyProxyRequest(requestModifiers) {
  return function onProxyReq(proxyReq, req, res) {


  }
}

function modifyProxyResponse(responseModifiers, modifyJS = false, userID) {
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

    console.log(userID);

    if(proxyRes.headers['content-type'] && (proxyRes.headers['content-type'].includes('html') || modifyJS)) {
      modifyResponse(res, proxyRes.headers['content-encoding'], function (body) {
        let newBody = '';

        if (body) {

        
          newBody = responseModifiers.reduce((acc, modifier) => {
            acc = modifier(acc || body, userID);
            return acc;
          }, '');
        }

        return newBody ? newBody : body;
      });
    }
  }

}

const client = redis.createClient({
  host: isProduction ? '127.0.0.1' :
  port: '6379',
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const db = mysql.createConnection({
  host    : isProduction ? '127.0.0.1' : 
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

const checkForlimitAccess = (db, id, toolName , toolLink , target) =>
 {
  return new Promise((resolve, reject) => {
     // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
      db.query(`SELECT  *FROM ahref_limit WHERE user_id = ${id}`, (err, result) => {
      if(err) {
        console.log(err);
        reject();
        return;
      }

      console.log(" Result lenth - "+result.length);
      if( result.length ==0 )
      {
        // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
          db.query(`INSERT INTO ahref_limit (user_id , site_count , site_last_word) VALUES (${id} , 1 , '${target}' )`, (err, result) => {
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

      if(( result.length == 1) && (result[0].site_last_word != target ))
      {

        if(result[0].site_count > 5)
        {
          db.query(`UPDATE ahref_limit SET  site_last_word = 'limit_ended' WHERE user_id = ${id}`, (err, result) => {
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
          db.query(`UPDATE ahref_limit SET site_count = ${result[0].site_count + 1} , site_last_word = '${target}' WHERE user_id = ${id}`, (err, result) => {
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

}
  

const app = express();
app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

app.get("/authenticationsetter", async (req, res) => {
  const auth = await getAsync("ahref");
  res.render("pages/sessions", { sessions: JSON.parse(auth) });
});

app.get("/abusers", async (req, res) => {
  const file = fs.readFile("./access-data.txt", (err, data) => {
    if(err) res.status(400).end();
    if(!data) res.status(400).end();

    if(data && data.toString) {
      res.send(data.toString());
    } else {
      res.status(400).end();
    }
  });
});

app.post('/event', bodyParser.json(), async (req, res) => {
  logData(req.body);
  res.status(200).end();
});

app.post("/setsessions", bodyParser.json(), async (req, res) => {
  try { 
    const { tool, proxy, cookie } = req.body;
    const auth = await getAsync("ahref");
    const parsed = JSON.parse(auth);

    parsed[tool] = { 
      name: parsed[tool]["name"], 
      proxy, 
      cookie 
    };

    const forSave = JSON.stringify(parsed);
    await setAsync("ahref", forSave);

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

app.use('*', async (req, res, next) => {
  const toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];
  const toolData = connectionData[toolID]; 

  let userID;


  console.log(" Request query --- " + req.query);
 // console.log(" Base URL --- " + req.baseUrl);

  // if( req.baseUrl.includes("site-explorer"))
  // {

  //   let target = req.query.target;
  //   console.log(" Base URL --- " + target);
  //       if(target != null)
  //       {
  //         let hasAccess =  checkForlimitAccess(db, 4, "ahref" , "site" , target);

  //         hasAccess.catch(function () 
  //         {
  //           console.log("Promise Rejected");
  //           res.send(" Your limited for ahref site-exploror is ended");
  //           return;
  //         });

  //         console.log(hasAccess);
  //       }

  // }



  if(isProduction) {
    if(!toolData) {
      res.send("Access Denied. 1");
      return;
    }

    if(!req.cookies["PHPSESSID"]) {
      res.send("Access Denied. 2");
      return;
    }

    userID = await getUserID(db, req.cookies["PHPSESSID"]);

    if(!userID) {
      res.send("Access Denied. 3");
      return;
    }

    const hasAccess = await checkForAccess(db, userID, toolData.productID);

    if(!hasAccess) {
      res.send("Access Denied. 4");
      return;
    }
  }


  if(toolData.blockedRoutes.length) {
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
  }

  let agent;
  let accessTool;

  if(isProduction) {
    const accessAllData = JSON.parse(await getAsync("ahref"));
    if ( accessAllData == null)
    {
      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("ahref", content);
      console.log("Storage populated  again ...");
      accessAllData = JSON.parse(await getAsync("ahref"));
    }

    accessTool = accessAllData[toolID];

    if(!accessTool) {
      accessTool = accessAllData[findFromAliases(toolID)];
    }

    if(!accessTool) {
      res.send("Access forbidden. You need to purchase first.");
      return;
    }


    agent = toolData.withAgent ? proxyingAgent.create(accessTool.proxy, toolData.address) : null;

  } 

  createProxyMiddleware({ 
    target: toolData.address,
    ws: true, 
    agent,
    toProxy: true,
    changeOrigin: true,
    "secure": false,
    xfwd: false,
    followRedirects: true,
    onProxyReq: modifyProxyRequest(toolData.requestModifiers),
    onProxyRes: toolData.transformResponse ? modifyProxyResponse(toolData.responseModifiers, false, userID) : function() {},
    headers: {
      "User-Agent": toolData.userAgent,
      cookie: isProduction ? accessTool.cookie : toolData.cookie,
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
      await setAsync("ahref", content);
      console.log("Storage populated...");

      await connectToDB()
      console.log("Connected to MySQL...");

      app.listen(6001, (err) => {
        if(err) {
          console.log(err);
          return;
        }

        console.log("Server running on: http://127.0.0.1:6001");
      });
    } catch(err) {
      console.log(err);
    }
  } else {
    app.listen(6001, (err) => {
      if(err) {
        console.log(err);
        return;
      }

      console.log("Server running on: http://127.0.0.1:6001");
    });
  }
});

