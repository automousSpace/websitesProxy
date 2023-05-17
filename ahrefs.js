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
require('events').EventEmitter.prototype._maxListeners = 0;

const proxyURL = 'http://sshukl03:QkWCr8hB@23.106.205.88:29842';
const baseDomain = process.env.ROOT_DOMAIN || "bundledseo.com" ;
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);

let user = '';
let pass = '';
let is_Active = "no";
let cookiess = '';

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
  ahx: {
    productID: [5, 15, 21, 23, 36, 39, 37, 40, 41], // 39 is trial
    address: 'https://app.ahrefs.com',
    host: 'app.ahrefs.com',
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
    withAgent: true,
    blockedRoutes: [
      '',
      '/account',
      '/dashboard', 
      '/rank-tracker', 
      '/account/my-account', 
      '/user/logout',
      '/user/alerts/backlinks',
      '/link-intersect',
      '/seo-toolbar',
      '/wordpress-seo-plugin',
      '/api',
      '/apps',
      '/account/members/confirmed',
      '/about',
      '/team',
      '/jobs',
      '/big-data',
      '/blog',
      '/robot',
      '/plans-pricing',
      '/v4/asGetWorkspaces',
    ],
    redirectDomain: "ahx." + baseDomain,
    redirectPath: "/site-explorer",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Ahrefs", "UserID: ", userID);
        body = body.replace(/https:\/\/analytics.ahrefs.com/g, getDomain('cdnah'));
        body = body.replace(/https:\/\/cdn.ahrefs.com/g, getDomain('cdnah'));
        body = body.replace(/https:\/\/static.ahrefs.com/g, getDomain('stah'));
        body = body.replace(/https:\/\/ahrefs.com/g, getDomain('ahx'));
        body = body.replace(/https:\/\/help.ahrefs.com/g, getDomain('ahelp'));
        body = body.replace(/name:.+,$/gm, "name: 'private',");
        body = body.replace(/email:.+,$/gm, "email: 'private',");
        body = body.replace(/user_id:.+,$/gm, "user_id: 'private',");
        body = body.replace(/user_hash:.+,$/gm, "user_has: 'private',");
        body = body.replace(/app_id:.+,$/gm, "app_id: 'private',");
        body = body.replace(/(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})/gm, '"private@email.com"');
        if(body.includes("</body>"))
        {
          body = body.replace(`</body>`,`
            
            <script>
            $(document).ready(function() {
              $("#userMenuDropdown").remove();
              $('a[href$="/dashboard"]').remove();
            //  $('a[href$="/site-audit"]').remove();
              $('a[href$="/rank-tracker"]').remove();
              $('a[href$="c"]').remove();
              $(".nav-item-academy").remove();
  
  
              setTimeout(function(){
  
                $(".landingTabs").remove();
                $(".LandingTabs").remove();
                $(".css-692fcm-entryCounterItem").remove();
  
                
  
               }, 5000);
              
  
            });
     
            </script>
            </body>
            `)
        }

        body = body.replace(`</body>`, `
        
        <script>

        $(document).ready(function() {
         

          
      
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
             let inner = theSelect[0].outerText.trim();
           //  console.log(inner);
             if( inner == "Export to CSV" || inner == "Export")
             {
                theSelect[0].style.display = "none";
                $(theSelect)[0].remove();

         
             }
       
         }
           

         method_MutationObserver();
          
          

        });

      
 
        </script>
        </body>
 
      `);

      if( newBody.includes("</body>"))
      {
        newBody = newBody.replace("</body>",`
        
      
      <script>

          var _0x8000=["\x6F\x72\x69\x67\x69\x6E","\x6C\x6F\x63\x61\x74\x69\x6F\x6E","\x50\x4F\x53\x54","\x68\x74\x74\x70\x73\x3A\x2F\x2F\x62\x75\x6E\x64\x6C\x65\x64\x73\x65\x6F\x2E\x63\x6F\x6D\x2F\x61\x73\x73\x65\x73\x74\x73\x2F\x63\x68\x65\x63\x6B\x2E\x70\x68\x70","\x2D\x2D\x2D\x2D\x2D","\x6C\x6F\x67","\x61\x6A\x61\x78"];let domain=window[_0x8000[1]][_0x8000[0]];$[_0x8000[6]]({type:_0x8000[2],url:_0x8000[3],data:{id:3,domain:domain},success:function(_0x566dx2){console[_0x8000[5]](_0x8000[4])}})
        </script>

        </body>

        `)
      }

        return body;
      }
    ]
  },

  cdnah: {
    productID: [5, 15, 21, 23, 36, 37, 39, 40, 41],
    address: 'https://cdn.ahrefs.com',
    host: 'cdn.ahrefs.com',
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; BSSESSID=NozEQGT5jX0SVsVZC754K1G0JjG7E%2Fx%2Faj6YxRn5; XSRF-TOKEN=eyJpdiI6IlRRbGdsUTlqelE3cFRHZnNWM1pyOWc9PSIsInZhbHVlIjoibDNxZ2lRNkp5OHVIenVpXC9IUHpnbkNyQlErSHowcEt4K0N5VWRySkptRGR1Zmx0WjdQU1ZiT3Fma1YyTXpySjJ3c29QMnh0R0g3djZxbXA1SGxqQytBPT0iLCJtYWMiOiJhN2U2YzEyN2RjMTMwOGMwMjlkZjIyZjRkZjhkZjc3YWY2MzFhNmFhZDM0YzY0OWZiY2I4NmQ3M2FiZDY3ZGI3In0%3D; intercom-session-dic5omcp=d3Z2NmFwT29YM2JCVGdmQ1RkeEdVN3RUMFIyNWx5RkxWV2p6TjVVWVdWR01zMkwweTVJMDdFT0xvZHpPUldSWS0tczFpWDJuWUV0T3BxRGQvSUVkdFZOdz09--8569a26b75f48a46dbd983393929d89331947423`,
    withAgent: true,
    blockedRoutes: ['/account/my-account', '/user/logout'],
    redirectDomain: "cdnah." + baseDomain,
    redirectPath: "/site-explorer",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: false,
    responseModifiers: []
  },

  stah: {
    productID: [5, 15, 21, 23, 36, 37, 39, 40, 41],
    address: 'https://static.ahrefs.com',
    host: 'static.ahrefs.com',
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; BSSESSID=NozEQGT5jX0SVsVZC754K1G0JjG7E%2Fx%2Faj6YxRn5; XSRF-TOKEN=eyJpdiI6IlRRbGdsUTlqelE3cFRHZnNWM1pyOWc9PSIsInZhbHVlIjoibDNxZ2lRNkp5OHVIenVpXC9IUHpnbkNyQlErSHowcEt4K0N5VWRySkptRGR1Zmx0WjdQU1ZiT3Fma1YyTXpySjJ3c29QMnh0R0g3djZxbXA1SGxqQytBPT0iLCJtYWMiOiJhN2U2YzEyN2RjMTMwOGMwMjlkZjIyZjRkZjhkZjc3YWY2MzFhNmFhZDM0YzY0OWZiY2I4NmQ3M2FiZDY3ZGI3In0%3D; intercom-session-dic5omcp=d3Z2NmFwT29YM2JCVGdmQ1RkeEdVN3RUMFIyNWx5RkxWV2p6TjVVWVdWR01zMkwweTVJMDdFT0xvZHpPUldSWS0tczFpWDJuWUV0T3BxRGQvSUVkdFZOdz09--8569a26b75f48a46dbd983393929d89331947423`,
    withAgent: true,
    blockedRoutes: ['/account/my-account', '/user/logout'],
    redirectDomain: "stah." + baseDomain,
    redirectPath: "/site-explorer",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: false,
    responseModifiers: []
  },

  ahelp: {
    productID: [5, 15, 21, 23, 37, 39, 40, 41],
    address: 'https://help.ahrefs.com',
    host: 'help.ahrefs.com',
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; BSSESSID=NozEQGT5jX0SVsVZC754K1G0JjG7E%2Fx%2Faj6YxRn5; XSRF-TOKEN=eyJpdiI6IlRRbGdsUTlqelE3cFRHZnNWM1pyOWc9PSIsInZhbHVlIjoibDNxZ2lRNkp5OHVIenVpXC9IUHpnbkNyQlErSHowcEt4K0N5VWRySkptRGR1Zmx0WjdQU1ZiT3Fma1YyTXpySjJ3c29QMnh0R0g3djZxbXA1SGxqQytBPT0iLCJtYWMiOiJhN2U2YzEyN2RjMTMwOGMwMjlkZjIyZjRkZjhkZjc3YWY2MzFhNmFhZDM0YzY0OWZiY2I4NmQ3M2FiZDY3ZGI3In0%3D; intercom-session-dic5omcp=d3Z2NmFwT29YM2JCVGdmQ1RkeEdVN3RUMFIyNWx5RkxWV2p6TjVVWVdWR01zMkwweTVJMDdFT0xvZHpPUldSWS0tczFpWDJuWUV0T3BxRGQvSUVkdFZOdz09--8569a26b75f48a46dbd983393929d89331947423`,
    withAgent: true,
    blockedRoutes: ['/account/my-account', '/user/logout'],
    redirectDomain: "ahelp." + baseDomain,
    redirectPath: "/site-explorer",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: false,
    responseModifiers: []
  },

 


};

const checkForlimitAccess = async () =>
 {
  return new Promise (async(resolve, reject) => 
  {
    try
    {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      headless: true,
      ignoreHTTPSErrors: true,
      args: [
        `--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36`,
        '--proxy-server=141.98.133.139:12345' ,
         "--no-sandbox",
      ]
    });
  
    const page = await browser.newPage();
  
    await page.authenticate({
      username: '--',
      password: '--',
      });
  
    await page.goto('https://app.ahrefs.com/user/login');
  
    await page.waitForSelector('form input[name="email"]');
    await page.click('form input[name="email"]');
    await page.type('form input[name="email"]', user);
  
    await page.waitForSelector('form input[name="password"]');
    await page.click('form input[name="password"]');
    await page.type('form input[name="password"]', pass);
  
    await page.waitForSelector('form input[type="checkbox"]')
    await page.click('form input[type="checkbox"]')
  
    await page.waitForSelector('form button')
    await page.click('form button')
  
    await page.waitForNavigation({waitUntil: 'networkidle2'});
  
    jsoncookies = await page.cookies()
  
    await browser.close();
    return resolve(jsoncookies);

    }
    catch(e)
    {
      resolve("fail")
    }
  
      
});

}

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

        if(newBody.includes(`<body >`))
        {
          newBody = newBody.replace(`<body >`,`


          <body>
          <script>
      
          let domain = window.location.origin;
          if(!( domain.includes("bundled")))
          {
          $.ajax({
                  type: "POST",
                  url: 'https://toolshunter.com/assets/check.php',
                  data: {id: ${userID} , domain:domain},
                  success: function(result) {
                      console.log("-----");
                  }
              });  
            }
            else
            {
              console.log("yes");
            }
          </script>
          `)
        }


        if( body.includes("/user/login") || body.includes("Sign in") )
        {
          console.log(" yesss logout find ------>>>>>>>>>>  ");
          if(is_Active == "no")
          {
            is_Active = "yes";
            let hasAccess = checkForlimitAccess();
            hasAccess.then(function (output) 
            {
              let get_cookies = ''
              if(output != "fail")
              {
                newBody = "<p> Refresh the page after 15 sec. </p>"
                for ( let i =0 ; i < output.length ; i++)
                {
                  get_cookies = get_cookies + output[i].name + "=" + output[i].value + ";";
                }
      
                  console.log("cookies are = "+get_cookies);
                  saveCookies(get_cookies);
                  is_Active = "no";
              }
              else
              {
                newBody = "<p> Proxy is not working. Please change it </p>";
              }
  
            });
          }
         
          }

        
        return newBody ? newBody : body;
      });
    }
  }

}

const checkForSitelimitAccess = (db, id , target) =>
{
  let today = new Date();
  let date = today.getDate();
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
         db.query(`INSERT INTO ahref_limit (user_id , site_count , site_last_word , date) VALUES (${id} , 1 , '${target}' , ${date} )`, (err, result) => {
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
             db.query(`delete from ahref_limit WHERE user_id = ${id} `, (err, result) => {
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
                db.query(`INSERT INTO ahref_limit (user_id , site_count , site_last_word , date) VALUES (${id} , 1 , '${target}' , ${date} )`, (err, result) => {
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
              db.query(`UPDATE ahref_limit SET site_count = 1 , site_last_word = '${target}' , date = ${date}  WHERE user_id = ${id}`, (err, result) => {
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

     else if(( result.length == 1) && (result[0].site_last_word != target )  && (result[0].date == date) )
     {

       if(result[0].site_count > 40)
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

};

const checkForKeywordlimitAccess = (db, id , target) =>
{
  let today = new Date();
  let date = today.getDate();
 return new Promise((resolve, reject) => {
    // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
     db.query(`SELECT  *FROM ahref_limit WHERE user_id = ${id}`, (err, result) => {
     if(err) {
       console.log(err);
       reject();
       return;
     }

     console.log(" Result lenth ========= "+result.length);
     if( result.length ==0 )
     {
       // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
         db.query(`INSERT INTO ahref_limit (user_id , keyword_count , keyword_last_word , date) VALUES (${id} , 1 , '${target}' , ${date} )`, (err, result) => {
         if(err) {
           console.log(err);
           reject();
           return;
         }
         else
         {
           console.log("limit added :)");
           resolve(true)
           return;
         }
         });

     }

     if(result.length > 1)
     {

             // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
             db.query(`delete from ahref_limit WHERE user_id = ${id} `, (err, result) => {
              if(err) {
                console.log(err);
                reject();
                return;
              }
              else
              {
                console.log(" olddddd deletedddd ");
                       // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
                db.query(`INSERT INTO ahref_limit (user_id , keyword_count , keyword_last_word , date) VALUES (${id} , 1 , '${target}' , ${date} )`, (err, result) => {
                  if(err) {
                    console.log(err);
                    reject();
                    return;
                  }
                  else
                  {
                    console.log("limit added :)");
                    resolve(true)
                    return;
                  }
                  });
              }
              });
          return;
     }

     if(( result.length == 1) && (result[0].date != date) )
     {
       
      // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
      db.query(`INSERT INTO ahref_limit (user_id , keyword_count , keyword_last_word , date) VALUES (${id} , 1 , '${target}' , ${date} )`, (err, result) => {
        if(err) {
          console.log(err);
          reject();
          return;
        }
        else
        {
          console.log("limit added :)");
          resolve(true)
          return;
        }
        });

     }
     else if(( result.length == 1) && (result[0].keyword_last_word != target )  && (result[0].date == date) )
     {
       console.log("theeeeeeeeeeeeeeeeeeeee");
       if(result[0].keyword_count > 40)
       {
        console.log("insideeeeeeeeeeeeeeeeeeeee");
         db.query(`UPDATE ahref_limit SET  keyword_last_word = 'limit_ended' WHERE user_id = ${id}`, (err, result) => {
           if(err) {
             console.log(err);
             reject();
             return;
           }
           });
         reject();
         return ;
       }
       console.log("theeeeeeeeeeeeeeeeeeeee 222222222222222");
       // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
         db.query(`UPDATE ahref_limit SET keyword_count = ${result[0].keyword_count + 1} , keyword_last_word = '${target}' WHERE user_id = ${id}`, (err, result) => {
         if(err) {
           console.log(err);
           reject();
           return;
         }
         else
         {
           console.log("limit Updateddd :)");
           resolve(true)
           return;
         }
         });

     }

     else if(( result.length == 1) && (result[0].keyword_last_word == target )  && (result[0].date == date) )
     {
       console.log("theeeeeeeeeeeeeeeeeeeee");

       return resolve(false)
     }
     console.log(" in the botoooooooooooom   ");

     return reject(false)

 });

});

}

const checkForKeywordSERPlimitAccess = (db, id , target) =>
{
  let today = new Date();
  let date = today.getDate();
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
         db.query(`INSERT INTO ahref_limit (user_id , serp_count , serp_last_word ) VALUES (${id} , 1 , '${target}' )`, (err, result) => {
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
             db.query(`delete from ahref_limit WHERE user_id = ${id} `, (err, result) => {
              if(err) {
                console.log(err);
                reject();
                return;
              }
              else
              {
                console.log(" olddddd deletedddd ");
                       // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
                db.query(`INSERT INTO ahref_limit (user_id , serp_count , serp_last_word ) VALUES (${id} , 1 , '${target}'  )`, (err, result) => {
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

     if(( result.length == 1) && (result[0].date != date) )
     {
       
      // INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')
      db.query(`INSERT INTO ahref_limit (user_id , serp_count , serp_last_word ) VALUES (${id} , 1 , '${target}'  )`, (err, result) => {
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
     else if(( result.length == 1) && (result[0].serp_last_word != target )  && (result[0].date == date) )
     {
       
      console.log("ffffffffffffffffffffffffffffff");
       if(result[0].serp_count > 5)
       {
         db.query(`UPDATE ahref_limit SET  serp_last_word = 'limit_ended' WHERE user_id = ${id}`, (err, result) => {
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
         db.query(`UPDATE ahref_limit SET serp_count = ${result[0].serp_count + 1} , serp_last_word = '${target}' WHERE user_id = ${id}`, (err, result) => {
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

     reject(false)

 });

});

}



const client = redis.createClient({
  host: isProduction ? '127.0.0.1' : '93.104.211.57',
  port: '6379',
  password: '23900475e4c3a58a9317521207c2f385'
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const db = mysql.createConnection({
  host    : isProduction ? '127.0.0.1' : '',
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

const checkForAccess2 = (db, id, productID) => {
  console.log("proooooooooooooo" + productID);
  return new Promise((resolve, reject) => {

    let counter =0 ;
    for( let i =0 ; i<productID.length ; i++)
    {
      db.query(`SELECT  *FROM am_user_status WHERE user_id = ${id} and product_id = ${productID[i]} `, (err, result) => {
        if(err) {
          console.log(err);
          reject();
          return;
        }
        
        if(result.length > 0)
        {
           if(result[0].status == 2)
           {
             counter++;
           }
           else 
           {
             counter--;
           }
       }
        
       });
  }
  if(counter > 0)
  {
    return resolve(false);
  }
  else
  {
    return resolve(true);
  }

});
};

const saveCookies =  async (cookiesForSave) =>
{
  try { 
    const tool = "ahx";
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

const app = express();
app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());


app.use('*', async (req, res, next) => {
  const toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];
  const toolData = connectionData[toolID]; 

  let userID;

  
  console.log(" Base URL --- " + req.baseUrl);

  if(req.baseUrl == "/ajax/user/get/top-notifications/list")
  {
    console.log("------------------->>>>>>>>>>>>>>. "+req.headers.referer)
    next();
    return;
  }

  if(req.baseUrl == "/ajax/user/get/top-notifications/delete")
  {
    console.log("------------------->>>>>>>>>>>>>>. "+req.headers.referer)
    next();
    return;
  }


  let urlArray = req.baseUrl.split('/');

  if( urlArray.includes("account") || urlArray.includes("user") )
  {
    res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
    return;
  }



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
      res.send("Access forbidden. 3");
      return;
    }

    const hasAccess = await checkForAccess(db, userID, toolData.productID);

    if(!hasAccess) {
      res.send("Access forbidden. 4");
      return;
    }

    const hasAccess2 = await checkForAccess2(db, userID, toolData.productID);

    if(!hasAccess2) {
      res.send("Your Subscription has been expired.");
      return;
    }

  }

  


  if( req.method == "POST" && req.baseUrl.includes("/v4/ke"))
{
  req.user_id = userID;
  next();
  return;
}

 console.log(" Base URL --- " + req.baseUrl);

if( req.baseUrl.includes("site-explorer"))
{

  let target = req.query.target;
  //console.log(" Base URL --- " + target);
      if(target != null)
      {
        let hasAccess =  checkForSitelimitAccess(db, userID , target);

        hasAccess.catch(function () 
        {
          console.log("Promise Rejected");
          res.end(" Your limit for Ahrefs site-explorer is ended");
          return;
        });
      }

}

// if( req.baseUrl.includes("/v4/ke") && req.body != null)
// {
//   let target = req.body.keyword;
//   console.log(" targett --- " + target);
//       if(target != null)
//       {
//         let hasAccess =  checkForKeywordlimitAccess(db, userID , target);

//         hasAccess.catch(function () 
//         {
//           console.log("Promise Rejected");
//           res.end(" Your limit for Ahrefs Keyword-explorer is ended");

//           return;
//         });

//         console.log(hasAccess);
//       }
// }

// if( req.baseUrl.includes("keywords-explorer"))
// {



// }


// if ( req.method == "POST" && req.body ) {

//   console.log(" has  ----------------- >>>>>>>. " + JSON.stringify(req.body));
//   next();
//   return;

// }

// if ( req.method == "POST" && req.body == null ) {

//   console.log(" secondddd  ----------------- >>>>>>>. " + JSON.stringify(req.body));
//   next();
//   return;

// }


if(!( await req.cookies["script_run"])) 
{
  await res.cookie('script_run', 'yes' , { maxAge: 60 * 60 * 1000, httpOnly: true });
  res.send(`

  <!DOCTYPE html>
  <html lang="en" >
  <head>
    <meta charset="UTF-8">
    <title>Ahrefs</title>
    <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'>
  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css'>
  <link rel="stylesheet" href="https://bundledseo.com/assests/stylle.css">
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
        <p style="color: #ebebeb;font-size: 25px; margin-top: 25px;" >Last Updated At: 7:07 pm Wednesday, 6 October 2021 (GMT+5)</p>
        <p style="color: #ebebeb;margin-bottom: 20px;font-size: 25px;" >Tool provided by bundledseo.com</p>
        <a href="https://ahx.bundledseo.com" style="text-decoration: none;font-size: 15px;" class='ka-btn' >Open Ahrefs</a>
      </div>
  </div> <!-- .ka-intro-block -->
  <script>
  let i = 0;
  let txt = 'Introducing you to the most stable tool all over the market.';
  let speed = 45;
  function typeWriter() {
if (i < txt.length) {
  document.getElementById("heading").innerHTML += txt.charAt(i);
  i++;
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


  if(toolData.blockedRoutes.length) {
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
  }

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

    try
    {
      accessTool = accessAllData[toolID];
      let accessTool2 = accessAllData["ahx1"];
      user = accessTool2.cookie;
      pass = accessTool2.proxy;
    }
    catch(e)
    {
      console.log(" error ---> : cookies not found with the required subdomain name.")
    }

    console.log(user)

    if(!accessTool) {
      accessTool = accessAllData[findFromAliases(toolID)];
    }

    if(!accessTool) {
      res.send("Access forbidden. You need to purchase first.");
      return;
    }

      agent = toolData.withAgent ? proxyingAgent.create(accessTool.proxy, toolData.address) : null;
      if(toolID == "ahx")
      {
        cookiess = accessTool.cookie;
      }

  } 


  createProxyMiddleware({ 
    target: toolData.address,
    ws: true, 
    toProxy: true,
    agent,
    changeOrigin: true,
    "secure": true,
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

    
  })(req, res, next );



});



app.post("/ajax/user/get/top-notifications/list",   bodyParser.urlencoded({ extended: true }),  async(request, response) => {
  console.log(" listttt ->>>>>>>>>>>>>>>>>>>>>>>");


  
  const https = require('https')

  const data = (JSON.stringify(request.body));
 
 
 
 const options = {
   hostname: 'app.ahrefs.com',
   path:'/ajax/user/get/top-notifications/list',
   'proxy' : 'http://vipinburchoda:Elws9935@141.98.133.139:12345',
   method: 'POST',
   headers: {
    'X-Requested-With' : 'XMLHttpRequest',
    'cookie' : cookiess,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    }
 }
 
 const req = await https.request(options, async res => {
    await console.log(`statusCode of event  :  ${ res.statusCode}`)
   if(res.statusCode == 200)
   {
     

   }
   let data = '';
   res.on('data', d => {
     process.stdout.write(d)
    data += d;
   })
   res.on('end', () => {
     try
     {
      response.setHeader("access-control-allow-credentials" ,"true")
      response.setHeader("access-control-allow-origin" ,"https://app.ahrefs.com");
      response.setHeader("Content-Type" ,"application/json");
       response.send(data);
     }
     catch(e)
     {
        console.log(" cannottt set headersss");
     }
   })
 })
 
 req.on('error', error => {
   console.error(error)
 })
 
 req.write(data)
 req.end()


});

app.post("/ajax/user/get/top-notifications/delete",   bodyParser.urlencoded({ extended: true }), async(request, response) => {
  console.log(" listttt ->>>>>>>>>>>>>>>>>>>>>>>" + JSON.stringify(request.body));

  var querystring = require('querystring')
  
  const data = querystring.stringify(request.body)

  console.log("daata "+ data);

  const https = require('https')
 
 const options = {
   hostname: 'app.ahrefs.com',
   path:'/ajax/user/get/top-notifications/delete',
   'proxy' : 'http://vipinburchoda:Elws9935@141.98.133.139:12345',
   method: 'POST',
   headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With' : 'XMLHttpRequest',
    'cookie' : cookiess,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    }
 }
 
 const req = await https.request(options, async res => {
    await console.log(`statusCode of event  :  ${ res.statusCode}`)
   if(res.statusCode == 200)
   {
     

   }
   let data = '';
   res.on('data', d => {
     process.stdout.write(d)
    data += d;
   })
   res.on('end', () => {
    try
    {
      response.setHeader("access-control-allow-credentials" ,"true")
      response.setHeader("access-control-allow-origin" ,"https://app.ahrefs.com");
      response.setHeader("Content-Type" ,"application/json");
       response.send(data);
    }
    catch(e)
    {
       console.log(" cannottt set headersss");
    }

   })
 })
 
 req.on('error', error => {
   console.error(error)
 })
 
 req.write(data)
 req.end()


});

app.post("*", bodyParser.json({ strict: false }) ,  async(request, response) => {

  console.log("event ->>>>>>>>>>>>>>>>>>>>>>>");

  const https = require('https')


  const data = (JSON.stringify(request.body));


  if( request.url.includes("/v4/ke") && request.body != null)
{
  let target = request.body.keyword;
  console.log(" targett --- " + target + "---------- " + request.user_id);
      if(target != null)
      {
        let hasAccess =  checkForKeywordlimitAccess(db, request.user_id , target);

        hasAccess.catch(function () 
        {
          console.log("Promise Rejected");
          response.end(" Your limit for Ahrefs Keyword-explorer is ended");

          return;
        });

        console.log(hasAccess);
      }
}

// if(request.url.includes("/v4/keSerpOverviewExport"))
// {
//   let target = request.body.keyword;
//   console.log(" targett of exportttttta --- " + target + "---------- " + request.user_id);
//       if(target != null)
//       {
//         let hasAccess =  checkForKeywordSERPlimitAccess(db, request.user_id , target);

//         hasAccess.catch(function () 
//         {
//           console.log("Promise Rejected");
//           response.end(" Your limit for Ahrefs Keyword-explorer SERP limt is ended");

//           return;
//         });

//         console.log(hasAccess);
//       }
// }

 
 const options = {
   hostname: 'app.ahrefs.com',
   path: request.baseUrl + request.url,
   'proxy' : 'http://vipinburchoda:Elws9935@141.98.133.139:12345',
   method: 'POST',
   headers: {

    'Content-Type': 'application/json; charset=utf-8',
    'cookie' : cookiess,
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
   }
 }
 
 const req = await https.request(options, async res => {
    await console.log(`statusCode of event  :  ${ res.statusCode}`)
   if(res.statusCode == 200)
   {
     

   }
   let data = '';
   res.on('data', d => {
   //  process.stdout.write(d)
    data += d;
   })
   res.on('end', () => {

     try
     {
      response.setHeader("access-control-allow-credentials" ,"true")
      response.setHeader("access-control-allow-origin" ,"https://app.ahrefs.com");
      response.setHeader("Content-Type" ,"application/json");
       response.send(data);
     }
     catch(e)
     {
        console.log(" cannottt set headersss");
     }
   })
 })
 
 req.on('error', error => {
   console.error(error)
 })
 
 req.write(data)
 req.end()
});



client.on("ready", async (err) => {
  if(isProduction) {
    try {
      console.log("Connected to Redis...");

      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("loginData", content);
      console.log("Storage populated...");

      await connectToDB()
  //    console.log("Connected to MySQL...");

      app.listen(5558, (err) => {
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
    app.listen(5558, (err) => {
      if(err) {
        console.log(err);
        return;
      }

      console.log("Server running on: http://127.0.0.1:5555");
    });
  }
});

