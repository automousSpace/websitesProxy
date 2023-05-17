const fs = require('fs');
const { promisify } = require('util');
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const modifyResponse = require('http-proxy-response-rewrite');
const redis = require('redis');
var formurlencoded = require('form-urlencoded');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
require('events').EventEmitter.prototype._maxListeners = 0;
const fileRead = (filename) => fs.readFileSync(filename);
const baseDomain = process.env.ROOT_DOMAIN || "toolsdriver.com" ;
const isProduction = process.env.NODE_ENV || "production";
const randUserAgent = require('rand-user-agent');
const puppeteer = require('puppeteer'); 
const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));
let urrl  = 'https://matic.resell.tools';
var porrt = 3003;
var acc_limit = 54
let cookie = '';
let script_name = '';
let token =''
let ran_script = ''
let ToolsID = "matic";
const connectionData = {
    matic : {
        productID: [22],  // 39 is trial
        address: 'https://copymatic.ai',
        host: 'copymatic.ai',
        origin : 'https://copymatic.ai',
        referer : 'https://copymatic.ai/',
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
        cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
        withAgent: true,
        blockedRoutes: [
        ],
        redirectDomain: "matic." + baseDomain,
        redirectPath: "/dashboard",
        requestHeaderModifiers: [],
        responseHeaderModifiers: [],
        transformResponse: true,
        responseModifiers: [
          function(body, userID) {
            console.log("matic", "UserID: ", userID);
    
            return body;
          }
        ]
      }
      

  
  };
const client = redis.createClient({
    host: '127.0.0.1' ,
    port: '6379'
});
const db = mysql.createConnection({
    host: '',
    user: '',
    password: '',
    database: '',
    useConnectionPooling : true,
    connect_timeout:100000
  });
  const util = require('util');
const query = util.promisify(db.query).bind(db);

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
      



          
          while(body.includes("https://copymatic.ai/wp-content/themes/copymatic/js/app2.js"))
          {
              body = body.replace( "https://copymatic.ai/wp-content/themes/copymatic/js/app2.js" , "https://matic.resell.tools/myapp16.js")
          }

          while(body.includes("https://copymatic.ai"))
          {
              body = body.replace( "https://copymatic.ai" , "https://matic.resell.tools")
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
	  if (accessCache[id + "+" + productID]) {
		resolve(accessCache[id + "+" + productID]);
		return;
	  }
  
	  db.query(`SELECT status FROM am_user_status WHERE user_id = ${id} AND product_id IN (${productID.join(",")});`, (err, result) => {
		if (err) {
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
  
  const checkForAccess2 = async (db, id, productID) => {
	return new Promise(async (resolve, reject) => {
  
	  let counter = 0;
	//  console.log(" length 111 ---- " + productID.length + "status = " + productID[0])
  
	  for (let i = 0; i < productID.length; i++) {
  
		  try 
		  {
			
			let result = await query(`SELECT  *FROM am_user_status WHERE user_id = ${id} and product_id = ${productID[i]} `);
			
			  if (result.length > 0) 
			  {
				  if (result[0].status == 1) 
				  {
					  counter++;
					 await limitReset(id , productID[i] )
				  }
			  }
  
			  if(i == productID.length - 1 )
			  {
				  if (counter > 0) {
				  return resolve(true);
				  }
				  else {
				  return resolve(false);
				  }
			  }
			
		  } 
		  catch(e) 
		  {
			console.log(" db eror = "+ e)
		  }
	  }
  
  
  
  
	});
  };
  
  const checkForexpire = (db, id, productID) => {
	return new Promise( async (resolve, reject) => {
  
	  for (let i = 0; i < productID.length; i++) 
	  {
		let counter = 0;
		try 
		{
		  
		  let result = await query(`SELECT  *FROM am_access WHERE user_id = ${id} and product_id = ${productID[i]} `);
		  if (result.length > 0) 
		  {
			  for (let j = 0; j < result.length; j++) 
			  {
	
				var tmp_date = new Date(result[j].expire_date),
				mnth = ("0" + (tmp_date.getMonth() + 1)).slice(-2),
				day = ("0" + tmp_date.getDate()).slice(-2);
				exp_date =  [tmp_date.getFullYear(), mnth, day].join("-");
				//console.log( " expire date = " + exp_date)
				exp_date = exp_date.split('-')
				let year = parseInt(exp_date[0])
				let month = parseInt(exp_date[1])
				let ddate = parseInt(exp_date[2])
				var new_expire = new Date(year, month - 1, ddate + 1);
				var today_date = new Date();
	
				if (today_date > new_expire) {
			 //     console.log("Expired ...........")
				}
				else {
			//      console.log("has access .........")
				  counter++;
				}
			  }
		   //   console.log(" final counter -------- " + counter + " id == " + productID[i])
			  if (counter == 0) 
			  {
				  try 
				  {
					await query(`UPDATE am_user_status SET status = 2  WHERE user_id = ${id} and product_id = ${productID[i]}`);
					await query(`UPDATE am_user_status SET status = 2  WHERE user_id = ${id} and product_id = 3`);
					await query(`UPDATE am_user_status SET status = 2  WHERE user_id = ${id} and product_id = 4`);
					
				  } 
				  catch(e) 
				  {
					console.log(" db eror = "+ e)
				  }
			  }
		  }
		  else
		  {
			return  resolve(null);
		  }
		  if(i == productID.length - 1 )
		  {
			return resolve(true);
		  }
		  
		} 
		catch(e) 
		{
			console.log( " error in db "  + e)
			process.exit(1);
			return  resolve(null);
		}
  
	  }
  
	});
  };


const getCookies = ( user, pass) => {
  //" + productID);
  return new Promise(async(resolve, reject) => {

    try
    {
      let windowUserAgent = randUserAgent("desktop" , "win");
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/chromium-browser',
        headless: true,
        ignoreHTTPSErrors: true,
        args: [
          '--disable-features=IsolateOrigins,site-per-process,SitePerProcess',
          '--flag-switches-begin --disable-site-isolation-trials --flag-switches-end',
          "--disable-notifications",
        //  '--force-device-scale-factor=0.3',
          `user-agent= ${windowUserAgent}`,
       //    '--proxy-server=170.83.179.152:12345' ,
      //    `cookie=XSRF-TOKEN=eyJpdiI6Ik9mRGxJTmJyZ3VrNCs4SHRnMTBQcUE9PSIsInZhbHVlIjoiMGM4QjhYRlM1ZHVMWjJXZVJSeGtDWEVCRlZtY1pVS2pPSXZmd3B3T2g4MzUxT1grXC9FMWRYRmlaSUxEb3BnUUNSd1Y1bjZWTjk1d0ZvZlFMRHZlOWZ3PT0iLCJtYWMiOiJjNzQ4ZjU5NzI5YTAwM2IyZmIxZWYyMjM0NjQyYmNjMDI3ZGM2MTlmZTJmZDcyZGQwNzA0NzYzYWY1MjA4Y2M4In0%3D; G_ENABLED_IDPS=google; BSSESSID=DmvjKqeO3K9CPz0hJrqQZeHNZzO%2FMguEQENQkaha; intercom-session-dic5omcp=dHpTZEM1S012MG5PSmF5S0FCM0JHWFVmMW5aRkVDUC9YMFgzN2dIWCszR1pHYXJZTzRjc0NVSytBVVZvSnJsbC0tV1d3SU5qc1FWZXowSlhpMHh0SC95QT09--50c0bfcca0d4d7785319a7822b463e768e3f24df`,
   //       'Proxy-Authorization =Basic dmlwaW5idXJjaG9kYTpFbHdzOTkzNQ==',
         "--no-sandbox",
        ]
      });
    
      const page = await browser.newPage();
     // await page.setViewport({ width: 1024, height: 1200 });
  
  
  
       page.setDefaultNavigationTimeout(10000);
       page.setDefaultTimeout(10000);
  
   
  
          try
          {
              await page.goto('https://copymatic.ai/')

              console.log("user = " + user)
              console.log("pass = " + pass)
              console.log("copymatic opened  ")
                
              await page.waitForSelector('a[data-target="#loginModal"]');
              let trailbtn = await page.$('a[data-target="#loginModal"]');
              await trailbtn.evaluate(b => b.click());
              
              console.log("Trial button clicked")
              
              await page.waitForSelector('form[id="login"]');
              await delay(5000)
  
              await page.waitForSelector('form[id="login"]  input[id="username"]');
              trailbtn = await page.$('input[id="username"]');  
              await trailbtn.evaluate(b => b.click());
              await page.type('form[id="login"] input[id="username"]' , user);
  
              console.log("username entered")
  
              await page.waitForSelector('form[id="login"]  input[id="password"]');
              trailbtn = await page.$('form[id="login"] input[id="password"]');   
              await trailbtn.evaluate(b => b.click());
              await page.type('form[id="login"] input[id="password"]' , pass);
  
              console.log("password entered")
  
  
              await page.waitForSelector(`form[id="login"]  button[type="submit"]`);
              trailbtn = await page.$(`form[id="login"]  button[type="submit"]`);
              await trailbtn.evaluate(b => b.click());
  
              console.log(" Login cliced ")
  
              await page.waitForSelector(`span[id="credit-count"]`);
  
              console.log(" Login sucessfully ")
  
              let cookies = await page.cookies();
  
              let str = ''
              for (let i = 0; i < cookies.length; i++) {
                str = str + cookies[i].name + "=" + cookies[i].value + ";";
              }
  
              cookies = str
             // console.log(cookies)
              await browser.close();
              return resolve(cookies)
              
          }
          catch(e)
          {
           
              console.log(e)
              await browser.close();
              return reject("failedtologin")
          }
          
  
    }
    catch(e)
    {
      console.log(" catch" + e)
      return reject("failedtologin")
    }

});
};





const app = express();

app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

const GiveNewAccount = async ( id , status , count) =>
{
  return await new Promise( async(resolve, reject) => {


    try
    {
      let result = await query(`select *FROM copymatic_store`);
        if( result.length > 0)
        {
          await query(`delete FROM copymatic_store where id = ${result[0].id}`);
          if(status == "new")
          await query(`INSERT INTO copy_account_store (user_id , email , pass , apikey ) VALUES (${id} , '${result[0].user}' , '${result[0].pass}' , '${result[0].apikey}')`);
          if(status == "update")
          await query(`UPDATE copy_account_store SET email = '${result[0].user}'  , pass = '${result[0].pass}', apikey = '${result[0].apikey}' , count = ${count + 1}  WHERE user_id = ${id}`);
          console.log("Account Added :)")
          return resolve([result[0].user, result[0].pass, result[0].apikey]);

        }
        
        else
        {
          console.log("  store empty ...")
          return reject("noinworker")
          
        }
    }
    catch(e)
    {
      console.log(" catch in GiveNewAccount ")
      console.log(e)
      return reject("errorUnknown")

    }


  })
  }

const getapi = async (id) =>
{
  return await new Promise( async(resolve, reject) => {

    try
    {
      db.query(`SELECT  *FROM copy_account_store WHERE user_id = ${id}`, async (err, result) =>{
        if(err) {
          console.log(err);
          reject();
          return;
        }
   
         if(result.length == 1)
         {
             return resolve([result[0].apikey , result[0].count ])
         }
   
       });
    }
    catch(e)
    {
      console.log(" catch in getapi ")
      console.log(e)
      return reject("errorUnknown")

    }


  })
}

const updateAccount = async (id ) =>
{
    return await new Promise( async(resolve, reject) => {

    //date = 2;
    let result = await query(`SELECT  *FROM copy_account_store WHERE user_id = ${id}`);
    if(result.length == 1)
    {
        // give new account with inserti

        if( result[0].count < acc_limit)
        {
          try
          {
            let [user, pass, apikey] = await GiveNewAccount(id , "update" , result[0].count)
            console.log(" Account updated :) " + apikey)

            return resolve(apikey)
          }
          catch(e)
          {
            
            console.log(" catch in update account = 1")
            console.log(e)
            return reject(e)

          }
        }
        else
        {
          return reject("limitend")
        }

    }

    });

};


const AlotAccount = async (id ) =>
{
    return await new Promise( async(resolve, reject) => {

    //date = 2;
     db.query(`SELECT  *FROM copy_account_store WHERE user_id = ${id}`, async (err, result) =>{
     if(err) {
       console.log(err);
       reject();
       return;
     }

     console.log("length ==== "+ result.length)

      if(result.length == 0)
      {
          // give new account with insert
          try
          {
            let [user, pass, apikey] = await GiveNewAccount(id , "new")
            let cookies = await getCookies(user , pass)
            return resolve(cookies)
          }
          catch(e)
          {
            
            console.log(" catch in length = 0")
            console.log(e)
            return reject(e)

          }

      }
      else if (result.length == 1)
      {
        
        try
          {

            let cookies = await getCookies(result[0].email , result[0].pass)
            //let [user, pass, apikey] = await GiveNewAccount(id , "update" , result[0].count)
            return resolve(cookies)
          }
          catch(e)
          {
            
            console.log(" catch in length = 1")
            console.log(e)
            return reject(e)

          }
        // function of same code as like date < created date 
        //so it has been added with that
      }
      else
      {
        console.log("too many samne rows with same user id")
        return reject("toomanyrecord");
      }

    });

    });

};


const contentWriter = async (apikey , request) =>
{
  return await new Promise( async(resolve, reject) => {

    try
    {
      let data = (request.body);
      data = Object.keys(data)
      data = JSON.parse(data)
      data.key = apikey
      data = JSON.stringify(data)
      const https = require('https')
      const options = {
        hostname: 'copymatic.ai',
        path: '/temp-api/',
        method: 'POST',
        headers: {
    
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'origin': 'https://copymatic.ai'
    
        }
      }
    
      const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)
    
        var contents = "";
        res.on('data', async d => {
     //     process.stdout.write(d)
          contents += d;
    
        })
    
        res.on('end', async () => {
          // console.log(contents);
          if (res.statusCode == 200) {
            return resolve(contents)
          }
          else
          {
            console.log(" Response from writing api is not 200")
            return reject("copyapierror")
          }
        });
    
      })
    
    
      req.on('error', error => {
        console.error(error)
      })
      req.write(data)
      req.end();
    }
    catch(e)
    {
      console.log(" catch in getapi ")
      console.log(e)
      return reject("errorUnknown")

    }


  })
}

const saveData = async (userCookies , userid) =>
 {
  return new Promise (async(resolve, reject) => 
  {

    console.log(" save called")
    const parsed = JSON.parse(await getAsync("copymaticLogins"));
       
    parsed["user_id"+(userid)] = { 
        user_id: userid, 
        cookies: userCookies
        };
 
 
    const data = JSON.stringify(parsed);
    
    fs.writeFile((__dirname + '/copymaticLogins.txt'), data,async (err) => {
      if(err) 
      {
        console.log(err)
        return;
      }
      else
      {
        console.log(" sucess save")
        await setAsync("copymaticLogins", data);
        return resolve(true)
      }
    });

  })
}


app.use('*', async (req, res, next) => {
  let toolID = isProduction ? req.headers["tool-subdomain"] : req.subdomains[0];

  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  console.log( toolID );
  console.log("base ==" + req.baseUrl);


  const toolData = connectionData[toolID]; 
  
  let userID;

  if (toolID == "matic") {

      if (!toolData) {
        res.redirect("https://app.resell.tools");
        return;
      }

      if (!req.cookies["PHPSESSID"]) {
        res.redirect("https://app.resell.tools");
        return;
      }

      userID = await getUserID(db, req.cookies["PHPSESSID"]);

      if (!userID) {
        res.redirect("https://app.resell.tools");
        return;
      }

      console.log(" user id = "+ userID)

      const hasAccess = await checkForAccess(db, userID, toolData.productID);

      if (!hasAccess) {
        res.redirect("https://app.resell.tools");
        return;
      }

      await checkForexpire(db, userID, toolData.productID);

      const hasAccess2 = await checkForAccess2(db, userID, toolData.productID);

      if (!hasAccess2) {
        res.send(`
        <center style="margin-top: 200px;">
          <img src="https://resell.tools/assests/warning.png" alt="Subscription expired" style="aspect-ratio: auto;width: 200px;">
          <p style="text-align: center;font-family: sans-serif;"> Your Subscription has been expired. Kindly purchase this product from  <a href="https://app.resell.tools/signup">here </a> </p>
        </center>
        
        `);
        return;
      }

     
  }



if(!( await req.cookies["init"])) 
{
  res.cookie('init', 'yes');
  console.log(" at theeee enddd 1");
//   console.log( "cookies" + accessTool.proxy )
 res.send(`
      
<!DOCTYPE html>
<html lang="en" >
<head>
  <meta charset="UTF-8">
  <title>Jasper Unlimited</title>
  <link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'>
  <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css'>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js"></script>
  <link rel="stylesheet" href="https://resell.tools/assests/style.css">
  <link rel="stylesheet" href="https://resell.tools/assets/css/step3.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
</head>
<body>

<div class="container" style="width: 100%;">

  <div class="content-wrapper"  style="display: flex; justify-content: center; align-items: center;flex-direction: column;">
	<div class="loading"><i></i><i></i><i></i><i></i></div>
	<h1 class="style" style="font-weight: bold;font-size: 40px;margin-top: 80px;" id="heading" ></h1>
	<p style="margin: 0px;font-size: 25px;" >Important Note: Don't Close Or Refresh The Browser</p>
	<p style="margin: 7px;font-size: 25px;" >Always use this tool in incognito tab for best performance.</p>
	<p style="margin: 7px;font-size: 25px;" >Tool Provided By: <span>Resell.tools</span></p>

	<button style="display:none;" id="progress-prev" class="btn" disabled>Prev</button>
	<button style="display:none;" id="progress-next" class="btn">Next</button>
  
  </div>
</div>
<script src="https://resell.tools/assets/js/step2.js"></script>
<script>
	let i = 0;
	let txt = 'System Is Doing Its Initial Setting For You...';
	let speed = 70;

	function typeWriter() {
  if (i < txt.length) 
  {
	document.getElementById("heading").innerHTML += txt.charAt(i);
	i++;
	setTimeout(typeWriter, speed);
	if(i == txt.length)
	{
	  console.log(i)
	  i =1;
	  document.getElementById("heading").innerHTML = "S";
	}
  }
  
}
typeWriter();
$( document ).ready(function() {
  setTimeout(function(){ 
	window.location.reload(); }, 3000);
});
</script>
</body>
</html>
`);


  return;
}


if(!( await req.cookies["script_run"]) &&  req.baseUrl == "") 
{
  try
  {
    console.log(" calling the alot")
    let user_cookies = await AlotAccount( userID );
    await saveData(user_cookies , userID)
    res.cookie('script_run', 'yes');
  }
  catch(e)
  {
    console.log(" catch AlotAccount - " + e);
    // errors handling


    let bdata = ''
    if (e == "toomanyrecord")
      bdata = "There is problem with your account, contact website administration."
    if (e == "failedtologin")
      bdata = "Your account failed to login, contact website administration."
    if (e == "errorUnknown")
      bdata = "Error unknown, contact website administration."
    if (e == "noinworker")
      bdata = "The system will not shift new Jasper account, you have to little Wait for the worker to setup account for you."
    if (e == "limitend")
      bdata = "The system will not shift new Jasper account for you. Because your monthly words limit has been ended. Kindly renew you package from <a href='https://app.resell.tools/signup'> here </a> so that you can continue your work."


    res.clearCookie("init");
    res.clearCookie("script_run");

    res.send(`
    <center style="margin-top: 200px;">
      <img src="https://resell.tools/assests/warning.png" alt="Free trial expired" style="aspect-ratio: auto;width: 200px;">
      <p style="text-align: center;font-family: sans-serif;"> `+ bdata + ` </p>
    </center>
    `);
    return;
  }

}

if( req.baseUrl == "/temp-api")
{
  req.user_id = userID
  next()
  return
}

if( req.baseUrl == "/myapp16.js")
{
  next()
  return
}



 if(isProduction) {
  if(toolData.blockedRoutes.length) {
    if(toolData.blockedRoutes.includes(req.baseUrl))  {
      res.redirect(`${isProduction ? 'https' : 'http'}://${toolData.redirectDomain}${toolData.redirectPath}`);
      return;
    }
  }
}

const AllUserCookies = JSON.parse(await getAsync("copymaticLogins"));
let user_cookies = AllUserCookies["user_id"+(userID)].cookies

//console.log(" user cokkies = " + user_cookies)



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
        cookie : user_cookies,
        host: toolData.host,
        origin: toolData.origin,
        referer : toolData.referer
    },
  })(req, res, next);


});

client.on("ready", async (err) => {
  if(isProduction) {
    try {

      const content = fileRead(__dirname + '/copymaticLogins.txt').toString();
      await setAsync("copymaticLogins", content);
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

app.post("/temp-api", bodyParser.urlencoded({ extended: true }), async (request, response) => {

  response.setHeader("content-type", `application/json; charset=UTF-8`)
  response.setHeader("Access-Control-Allow-Credentials", "true")
  response.setHeader("access-control-allow-origin", "*")
  response.setHeader("access-control-allow-methods", "OPTIONS,POST,GET")

  try
  {
    let [apikey , count] = await getapi(request.user_id)
    let contents = await contentWriter( apikey , request)

    contents = JSON.parse(contents)
    console.log(" apikey = " + apikey)
    if(contents.error == "no_enough_credits")
    {
      console.log("no_enough_credits found")
      try
      {
       // {"success": false, "error": "no_enough_credits"}

        let apikey = await updateAccount(request.user_id)
        contents = await contentWriter( apikey , request)
        contents = JSON.parse(contents)
      }
      catch(e)
      {
        // error handling
        console.log(" catch no_enough_credits " + e)
        if (e == "copyapierror")
        response.send(`{"success": false, "error": "copyapierror"}`);
        if (e == "toomanyrecord")
        response.send(`{"success": false, "error": "toomanyrecord"}`);
        if (e == "failedtologin")
        response.send(`{"success": false, "error": "failedtologin"}`);
        if (e == "errorUnknown")
          response.send(`{"success": false, "error": "errorUnknown"}`);
        if (e == "noinworker")
        response.send(`{"success": false, "error": "noinworker"}`);
        if (e == "limitend")
        response.send(`{"success": false, "error": "limitend"}`);
      }

    }
    // while (contents.includes("beta.jasper.ai")) {
    //   contents = contents.replace("beta.jasper.ai", "jar.resell.tools")
    // }
    if(contents.credits || contents.credits ==0 )
    {
      count--;
      let usedWord = (count * 1500) + (1500 - contents.credits);
      console.log(" usedWord = " + usedWord)
      
      contents.credits = 81000 - usedWord

    }
    if(contents.balance || contents.balance ==0 )
    {
      console.log(contents.balance)
      count--;
      let usedWord = (count * 1500) + (1500 - contents.balance);
      console.log(" usedWord = " + usedWord)
      
      contents.balance = 81000 - usedWord

    }

    contents = JSON.stringify(contents)
    response.send(contents);
  }
  catch(e)
  {
    // error handling
    
    if (e == "copyapierror")
    response.send(`{"success": false, "error": "copyapierror"}`);
    if (e == "toomanyrecord")
    response.send(`{"success": false, "error": "toomanyrecord"}`);
    if (e == "failedtologin")
    response.send(`{"success": false, "error": "failedtologin"}`);
    if (e == "errorUnknown")
      response.send(`{"success": false, "error": "errorUnknown"}`);
    if (e == "noinworker")
    response.send(`{"success": false, "error": "noinworker"}`);
    if (e == "limitend")
    response.send(`{"success": false, "error": "limitend"}`);
    

  }
 
});


app.get("/myapp16.js", async (request, response) => {

  console.log("myapp1 ->>>>>>>>>>>>>>>>>>>>>>>");

  response.setHeader("content-type", `application/javascript; charset=utf-8`)
  response.setHeader("Access-Control-Allow-Credentials", "true")
  response.setHeader("access-control-allow-origin", "https://matic.resell.tools")
  response.send(`
  
  //document.querySelector('div[class="upgrade-row"]').remove();
var cf_api_url = '/temp-api/';
jQuery(document).ready(function ($) {
	$('[data-toggle="popover"]').popover({ trigger: "hover", html: true });
	$('.ideabuttons > div').click(function () {
		$('.ideabuttons > div').removeClass('active');
		var className = $(this).attr('class');
		if (!$(this).hasClass('active')) {
			$(this).addClass('active');
		}
		$('.ideacontent > div').hide();
		$('.ideacontent > .' + className).show();
	});
	$('#description, #sentence, #text_to_rewrite, #postdescription, #topic, #blog_description, #video_description, #video_title, #quora_question, #business_description, #project_description').on('keyuUpgradep', function () {
		var len = $(this).val().length;
		$('.char-cnt').text(len);
	});
	$('#description, #sentence, #text_to_rewrite, #postdescription, #topic, #blog_description, #video_description, #video_title, #quora_question, #business_description, #project_description').bind("change input", function () {
		var len = $(this).val().length;
		$('.char-cnt').text(len);
	});
	$('#text_to_summarize').on('keyuUpgradep', function (e) {
		var maxwords = $(this).data('maxwords');
		var len = 0;
		if ($(this).val() != '') {
			len = $(this).val().split(' ').length;
		}
		$('.char-cnt').text(len);
		if (len > maxwords) {
			$(this).val(truncate_by_words($(this).val(), maxwords));
			$('.char-cnt').text(maxwords);
			if (event.keyCode == 46 || event.keyCode == 8) {// Allow backspace and delete buttons
			} else {//all other buttons
				e.preventDefault();
			}
		}
	});
	$('#text_to_summarize').bind("change input", function (e) {
		var maxwords = $(this).data('maxwords');
		var len = 0;
		if ($(this).val() != '') {
			len = $(this).val().split(' ').length;
		}
		$('.char-cnt').text(len);
		if (len > maxwords) {
			$(this).val(truncate_by_words($(this).val(), maxwords));
			$('.char-cnt').text(maxwords);
			if (event.keyCode == 46 || event.keyCode == 8) {// Allow backspace and delete buttons
			} else {//all other buttons
				e.preventDefault();
			}
		}
	});
	$('#text_to_summarize').keydown(function (e) {
		var maxwords = $(this).data('maxwords');
		var len = 0;
		if ($(this).val() != '') {
			len = $(this).val().split(' ').length;
		}
		$('.char-cnt').text(len);
		if (len > maxwords) {
			$(this).val(truncate_by_words($(this).val(), maxwords));
			$('.char-cnt').text(maxwords);
			if (event.keyCode == 46 || event.keyCode == 8) {// Allow backspace and delete buttons
			} else {//all other buttons
				e.preventDefault();
			}
		}
	});
	function truncate_by_words(str, no_words) {
		return str.split(" ").splice(0, no_words).join(" ");
	}
	$('.outputs_cnt .up').click(function (e) {
		var v = parseInt($('.outputs_cnt #n').val());
		if (v < 8) {
			v++;
			$('.outputs_cnt #n').val(v);
		}
	});
	$('.outputs_cnt .down').click(function (e) {
		var v = parseInt($('.outputs_cnt #n').val());
		if (v > 1) {
			v--;
			$('.outputs_cnt #n').val(v);
		}
	});
	$('#aifields').on("submit", function (e) {
		e.preventDefault();
		if ($('.big-icon').length) {
			$('.height-align').empty();
		}
		$('.ideacontent .favs').hide();
		if (model != 'image-generator') {
			$('.loading-results').show();
		}
		$('#aifields .submit-form button').prop('disabled', true);
		if (model == 'youtube-tag-generator' || model == 'instagram-hashtag-generator') {
			$('.height-align').removeClass('text-center');
		}
		/*var data = $(this).serialize() + '&model=' + model;
		if($('.outputs_cnt #n').val()){
			var n = parseInt($('.outputs_cnt #n').val());
			data = data + '&n='+n;
		}*/
		$('.ideacontent').animate({ scrollTop: (0) }, 'slow');
		const form = new FormData(e.target);
		const data_ = Object.fromEntries(form.entries());
		data_.key = cf_key;
		data_.model = model;
		if (typeof team_key !== 'undefined' && team_key != '') {
			data_.team_key = team_key;
		}
		if (model == 'image-generator') {
			var image_placeholders = '';
			var n = $('#n').val();
			$('.height-align').addClass('has-images');
			$('.height-align .idea.loading').remove();
			for (var i = 1; i <= n; i++) {
				$('.height-align').prepend('<div class="idea new loading"></div>');
			}
		}
		$.post(cf_api_url, JSON.stringify(data_), function (data) {
	
			
			$('.loading-results').hide();
			$('#aifields .submit-form button').prop('disabled', false);
			if (data != '') {
				if (data['error']) {
					if (data['error'] == 'membership_expired') {
						var alert = '<p class="text-gray explainer">Generate new ideas by adding info on the left side. Press "Generate" to generate copy.</p><div class="big-icon warning"><i class="mdi mdi-alert-circle-outline"></i></div><h2>Free Trial Expired</h2><p class="description">Your Free Trial has expired. Please upgrade if you want to keep using Copymatic.</p>';
						$('.height-align').append(alert);
					} else if (data['error'] == 'no_enough_credits') {
						var alert = '<p class="text-gray explainer">Generate new ideas by adding info on the left side. Press "Generate" to generate copy.</p><div class="big-icon warning"><i class="mdi mdi-alert-circle-outline"></i></div><h2>Insufficient Credits</h2><p class="description">You don\t have enough credits. Please consider upgrading your account for more credits: <a href="/upgrade/">Upgrade my account</a></p>';
						$('.height-align').append(alert);
						$('#aifields .submit-form button').prop('disabled', true);
					}
					else if (data['error'] == 'service_saturated') {
						$('#aifields .submit-form button').prop('disabled', true);
					} else if (data['error'] == 'sensitive_content') {
						if (model == 'image-generator') {
							$('.idea.loading').remove();
						}
						var alert = '<p class="text-gray explainer">Generate new ideas by adding info on the left side. Press "Generate" to generate copy.</p>';
						$('.height-align').append(alert);
					}
					trigger_error(data['error']);
				} else if (data['results']) {
					$('.height-align').show();
					$('.height-align .idea:not(.loading)').removeClass('new');
					var ideas = data['results'];
					var cnt = 1;
					if (data['balance'] || data['balance'] == 0) {
						$('#credit-count').text(data['balance'].toLocaleString('us'));
					}
					if (data['plan_id'] == 3) {
						handle_free_trial_bar(data['balance']);
					}
					if (model != 'youtube-tag-generator' && model != 'instagram-hashtag-generator') {
						var html_ideas = '';
						$.each(ideas, function (index, text) {
							var t_length = text.length;
							var warning = '';
							var warning_text = '<p class="warning"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg><strong>' + t_length + ' characters</strong></p>';
							if (model == 'google-headlines') {
								if (t_length > 96) {
									warning = warning_text;
								}
							} else if (model == 'google-descriptions') {
								if (t_length > 180) {
									warning = warning_text;
								}
							} else if (model == 'meta-descriptions' || model == 'meta-descriptions-url') {
								if (t_length > 160) {
									warning = warning_text;
								}
							} else if (model == 'grammar-rewriter') {
								if (text == $('#sentence').val()) {
									swal("Grammatically correct", "Your sentence has not been rewritten as the grammar is in perfect English!", "success");
								}
							}
							if (model != 'image-generator') {
								var plagia_btn = '';
								var words = text.split(" ");
								if (words.length > 15) {
									plagia_btn = '<button class="btn white rounded shadow-sm btn-sm check-plagiarism"><i class="mdi mdi-magnify"></i> Check Plagiarism</button>';
								}
								html_ideas += '<div class="idea new"><p>' + text + '</p>' + warning + '<div class="btn-ideas">' + plagia_btn + '<button class="btn white rounded shadow-sm btn-sm copy"><i class="mdi mdi-content-copy"></i> Copy</button><button class="btn white rounded shadow-sm btn-sm fav"><i class="mdi mdi-heart-outline"></i> Save</button></div></div>';
							} else {
								var key = index - 1;
								var image_box = $('.height-align .idea.loading').eq(key);
								image_box.removeClass('loading');
								var download_link = 'https://copymatic.ai/api/image-downloader.php?url=' + encodeURIComponent(text.url);
								image_box.append('<img src="' + text.url + '"><div class="btn-ideas"><button class="btn white rounded shadow-sm btn-sm copy-img"><i class="mdi mdi-content-copy"></i> Copy</button><a href="' + download_link + '" class="btn white rounded shadow-sm btn-sm download-img" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.878,18.122a3,3,0,0,0,4.244,0l3.211-3.211A1,1,0,0,0,15.919,13.5l-2.926,2.927L13,1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1l-.009,15.408L8.081,13.5a1,1,0,0,0-1.414,1.415Z"/><path d="M23,16h0a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V17a1,1,0,0,0-1-1H1a1,1,0,0,0-1,1v4a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V17A1,1,0,0,0,23,16Z"/></svg> Download</a><button class="btn white rounded shadow-sm btn-sm save-image"><i class="mdi mdi-heart-outline"></i> Save</button></div>');
							}
							cnt++;
						});
						$('.height-align').prepend(html_ideas);
					} else {
						$('.height-align').empty().show();
						$.each(ideas, function (index, text) {
							$('.height-align').append('<div class="idea new"><p>' + text + '</p><div class="btn-ideas"><button class="btn white rounded shadow-sm btn-sm copy"><i class="mdi mdi-content-copy"></i> Copy</button></div></div>');
						});
					}
				}
				/*if(ideas['membership_expired']){
					var alert = '<p class="text-gray explainer">Generate new ideas by adding info on the left side. Press "Generate" to generate copy.</p><div class="big-icon warning"><i class="mdi mdi-alert-circle-outline"></i></div><h2>Free Trial Expired</h2><p class="description">Your Free Trial has expired. Please upgrade if you want to keep using Copymatic.</p>';
					$('.height-align').append(alert);
				}else if(ideas['no_enough_credits']){
					var alert = '<p class="text-gray explainer">Generate new ideas by adding info on the left side. Press "Generate" to generate copy.</p><div class="big-icon warning"><i class="mdi mdi-alert-circle-outline"></i></div><h2>Insufficient Credits</h2><p class="description">You don\t have enough credits. Please consider upgrading your account for more credits: <a href="/upgrade/">Upgrade my account</a></p>';
					$('.height-align').append(alert);
					$('#aifields .submit-form button').prop('disabled', true);
					swal({
						title: "Upgrade your account",
						text: "Resell Tools. Please upgrade your account to unlock unlimited content creation.",
						icon: "warning",
						button: "Upgrade",
					}).then(function(button) {
						if(button){
							window.location.href = "/upgrade/";
						}
					});
				}else if(ideas['service_saturated']){
					swal({
						title: "Error",
						text: "For some reasons we have not been able to generate content, please try again or contact support.",
						icon: "warning"
					});
					$('#aifields .submit-form button').prop("disabled", true);
				}else if(ideas['sensitive_content']){	
					swal("Disallowed content", "We don't allow any political, religious, sexual or legal content.", "error");
					var alert = '<p class="text-gray explainer">Generate new ideas by adding info on the left side. Press "Generate" to generate copy.</p>';
					$('.height-align').append(alert);
				}else if(ideas['fair_use_exceeded']){	
					swal("Fair Use Exceeded", "You have exceeded your fair use limit for this month.", "error");
				}else{
					if(current_plan!=2){
						var current_credits = parseInt($('#credit-count').text());
						var new_credit = current_credits-model_price;
						if(new_credit<0){
							new_credit = 0;
						}
						$('#credit-count').text(new_credit);
					}
					if(current_plan==3){
						var out_of = 10 - new_credit;
						var percentage = out_of * 10;
						$('.plan_words span').text(out_of);
						$('.progress-bar').css('width', percentage+'%');
					}
					$('#aifields .submit-form .submit-name').text('Generate more');
					if(model!='youtube-tag-generator' && model!='instagram-hashtag-generator'){
						$.each(ideas, function (index, text) {
							setTimeout(function() {
								var t_length = text.length;
								var warning = '';
								var warning_text = '<p class="warning"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg><strong>'+t_length+' characters</strong></p>';
								if(model=='google-headlines'){
									if(t_length>96){
										warning = warning_text;
									}
								}else if(model=='google-descriptions'){
									if(t_length>180){
										warning = warning_text;
									}
								}else if(model=='meta-descriptions' || model=='meta-descriptions-url'){
									if(t_length>160){
										warning = warning_text;
									}
								}else if(model=='grammar-rewriter'){
									if(text==$('#sentence').val()){
										swal("Grammatically correct", "Your sentence has not been rewritten as the grammar is in perfect English!", "success");
									}
								}
								var plagia_btn = '';
								var words = text.split(" ");
								if(words.length > 15){
									plagia_btn = '<button class="btn white rounded shadow-sm btn-sm check-plagiarism"><i class="mdi mdi-magnify"></i> Check Plagiarism</button>';
								}
								$('.height-align').append('<div class="idea"><p>'+text+'</p>'+warning+'<span class="index">'+cnt+'</span><div class="btn-ideas">'+plagia_btn+'<button class="btn white rounded shadow-sm btn-sm copy"><i class="mdi mdi-content-copy"></i> Copy</button><button class="btn white rounded shadow-sm btn-sm fav"><i class="mdi mdi-heart-outline"></i> Save</button></div></div>');
								cnt++;
							}, 500*index); 
						});
					}else{
						$.each(ideas, function (index, text) {
							$('.height-align').append('<div class="idea"><p>'+text+'</p><div class="btn-ideas"><button class="btn white rounded shadow-sm btn-sm copy"><i class="mdi mdi-content-copy"></i> Copy</button></div></div>');
						});
					}
				}*/
			}
		});
	});


	function trigger_error(error_type) {
		console.log(" trigger_error -- " + error_type);
		if (error_type == 'no_enough_credits') {
			swal({
				title: "Insufficient credits",
				text: "You don't have enough credits to generate more content. Please upgrade your account to unlock unlimited content writing.",
				icon: "warning",
				buttons: ['Got it', 'Upgrade'],
			}).then(function (button) {
				if (button) {
					window.location.href = "/upgrade/";
				}
			});
		} 
		else if (error_type == 'toomanyrecord') {
			swal({
			  title: "Message from Resell Tools",
			  text: "There is problem with your account, contact website administration.",
			  icon: "warning",
			  buttons: ['Got it', 'Contact Us'],
			}).then(function (button) {
			  if (button) {
				window.location.href = "https://app.resell.tools";
			  }
			});
		  }
	
		  else if (error_type == 'failedtologin') {
			swal({
			  title: "Message from Resell Tools",
			  text: "Your account failed to login, contact website administration.",
			  icon: "warning",
			  buttons: ['Got it', 'Contact Us'],
			}).then(function (button) {
			  if (button) {
				window.location.href = "https://app.resell.tools";
			  }
			});
		  }
	
		  else if (error_type == 'errorUnknown') {
			swal({
			  title: "Message from Resell Tools",
			  text: "Error unknown, contact website administration.",
			  icon: "warning",
			  buttons: ['Got it', 'Contact Us'],
			}).then(function (button) {
			  if (button) {
				window.location.href = "https://app.resell.tools";
			  }
			});
		  }
	
		  else if (error_type == 'noinworker') {
			swal({
			  title: "Message from Resell Tools",
			  text: "The system will not shift new Jasper account, you have to little Wait for the worker to setup account for you.",
			  icon: "warning",
			  buttons: ['Got it', 'Contact Us'],
			}).then(function (button) {
			  if (button) {
				window.location.href = "https://app.resell.tools";
			  }
			});
		  }
	
		  else if (error_type == 'limitend') {
			swal({
			  title: "Message from Resell Tools",
			  text: "Your monthly words limit has been ended. Kindly renew you package.",
			  icon: "warning",
			  buttons: ['Got it', 'Renew Now'],
			}).then(function (button) {
			  if (button) {
				window.location.href = "https://app.resell.tools/signup";
			  }
			});
		  }

		else if (error_type == 'membership_expired') {
			swal({
				title: "No active plan",
				text: "You don't have any active plan. Please upgrade your account to unlock unlimited content writing.",
				icon: "warning",
				buttons: ['Got it', 'Upgrade'],
			}).then(function (button) {
				if (button) {
					window.location.href = "/upgrade/";
				}
			});
		} else if (error_type == 'error-occurred') {
			swal({
				title: "Error",
				text: "An error occurred on our side. Please try to rewrite again.",
				icon: "warning"
			});
		} else if (error_type == 'fair_use_exceeded' || error_type == 'fair-use-exceeded') {
			swal({
				title: "Fair Use Exceeded",
				text: "You have exceeded your fair use limit for this month.",
				icon: "warning"
			});
		} else if (error_type == 'service_saturated') {
			swal({
				title: "Error",
				text: "For some reasons we have not been able to generate content, please try again or contact support.",
				icon: "warning"
			});
		} else if (error_type == 'sensitive_content') {
			swal("Disallowed content", "We don't allow any political, religious, sexual or legal content.", "error");
		} else if (error_type == 'amazon_product_error') {
			swal("An error occurred", "We were not able to fetch the details of this product, please try again or try with another product.", "error");
		} else if (error_type == 'invalid_amazon_url') {
			swal("Invalid Amazon URL", "It looks like the URL you entered is not a valid Amazon product URL as we were not able to determine the ASIN code.", "error");
		} else if (error_type == 'website_content_error') {
			swal("Invalid Website Content", "We couldn't fetch the content of this URL, please try again or try with another URL.", "error");
		}
	}
	async function getImageBlobFromUrl(url) {
		const fetchedImageData = await fetch('https://copymatic.ai/image-fetcher/', {
			mode: "no-cors",
			headers: { 'Access-Control-Allow-Origin': '*' },
			method: "POST",
			body: JSON.stringify({ "url": url })
		}
		);
		const blob = await fetchedImageData.blob()
		return blob
	}
	async function copyImage(url) {
		try {
			var blob = await getImageBlobFromUrl(url);
			await navigator.clipboard.write([
				new ClipboardItem({
					['image/png']: blob
				})
			])
			$('.copy-img').find('i').removeClass('mdi-loading mdi-spin').addClass('mdi-content-copy');
			swal("Image copied!", "The image has been copied to your clipboard.", "success");
		} catch (err) {
			console.error(err.name, err.message);
			swal("Error", "An error occurred while trying to copy the image. Please try again or contact support.", "warning");
		}
	}
	$(document).on('click', '.copy-img', function (e) {
		var imageElem = $(this).parent().parent().find('img');
		var url = imageElem.attr("src");
		$(this).find('i').removeClass('mdi-content-copy').addClass('mdi-loading mdi-spin');
		copyImage(url);
	});
	/*$(document).on('click', '.download-img', function(e) {
		var imageElem = $(this).parent().parent().find('img');	
		var url = imageElem.attr("src");
			var a = document.createElement('a');
		a.href = url;
		a.download = '';
		a.click();
		//a.remove();
	});*/
	$(document).on('click', '.copy', function () {
		var elem = $(this).parents('.idea').find('p');
		copyToClipboard(elem);
		$(this).html('<i class="mdi mdi-check"></i>');
	});
	function copyToClipboard(element) {
		var $temp = $("<input>");
		$("body").append($temp);
		$temp.val($(element).text()).select();
		document.execCommand("copy");
		$temp.remove();
	}
	function copyToClipboardTexts(text) {
		var $temp = $("<textarea>");
		$("body").append($temp);
		$temp.val(text).select();
		document.execCommand("copy");
		$temp.remove();
	}
	$(document).on('click', '.fav', function () {
		var $this = $(this);
		var idea_block = $(this).parents('.idea');
		var elem = $(this).parents('.idea').find('p');
		var idea_text = elem.text();
		var fav_cnt = parseInt($('.fav_nbr').text());
		$.post(app_object.ajax_url, { action: "fav_idea", idea: idea_text, model: model }, function (data) {
			if (data != '0') {
				$this.html('<i class="mdi mdi-check"></i>');
				var new_post_id = parseInt(data);
				var last_nbr = parseInt($(".favs .idea").last().find('.index').text());
				if (isNaN(last_nbr)) {
					last_nbr = 1;
				}
				last_nbr++;
				fav_cnt++;
				idea_block.addClass('faved');
				$('.fav_nbr').text(fav_cnt);
				$('.ideacontent .favs .explainer').hide();
				var idea_html = '<div class="idea" data-id="' + new_post_id + '"><p>' + idea_text + '</p><span class="index">' + last_nbr + '</span><div class="btn-ideas"><button class="btn white rounded shadow-sm btn-sm copy"><i class="mdi mdi-content-copy"></i><span>Copy</span></button><button class="btn white rounded shadow-sm btn-sm unfav"><i class="mdi mdi-delete"></i><span>Delete</span></button></div></div>';
				$('.ideacontent .favs').prepend(idea_html);
			}
		});
	});
	$(document).on('click', '#save-all-images', function (e) {
		e.preventDefault();
		var $this = $(this);
		$this.append('<i class="mdi mdi-loading mdi-spin" style="margin-left: 5px;margin-right: -2px;opacity: 0.5;"></i>');
		var ideas_count = $(".idea.selected").length;
		var fav_cnt = parseInt($('.fav_nbr').text());
		fav_cnt = fav_cnt + ideas_count;
		$('.fav_nbr').text(fav_cnt);
		var i = 1;
		$(".idea.selected").each(function () {
			var idea_block = $(this);
			var elem = $(this).find('img');
			var url = elem.attr("src");
			$.post(app_object.ajax_url, { action: "save_image", url: url }, function (data) {
				if (data != '0') {
					idea_block.addClass('faved');
					$('.ideacontent .favs .explainer').hide();
					var idea_html = '<div class="idea new"><img src="' + url + '"><div class="btn-ideas"><button class="btn white rounded shadow-sm btn-sm copy-img"><i class="mdi mdi-content-copy"></i> Copy</button><a href="https://copymatic.ai/api/image-downloader.php?url=' + encodeURIComponent(url) + '" class="btn white rounded shadow-sm btn-sm download-img" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.878,18.122a3,3,0,0,0,4.244,0l3.211-3.211A1,1,0,0,0,15.919,13.5l-2.926,2.927L13,1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1l-.009,15.408L8.081,13.5a1,1,0,0,0-1.414,1.415Z"></path><path d="M23,16h0a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V17a1,1,0,0,0-1-1H1a1,1,0,0,0-1,1v4a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V17A1,1,0,0,0,23,16Z"></path></svg> Download</a><button class="btn white rounded shadow-sm btn-sm unsave-image"><i class="mdi mdi-delete"></i><span>Delete</span></button></div></div>';
					$('.ideacontent .favs').prepend(idea_html);
					if (i == ideas_count) {
						$('#save-all-images i').remove();
						$('.idea').removeClass('selected');
					}
					i++;
				}
			});
		});
	});
	$(document).on('click', '.save-image', function (e) {
		e.stopPropagation();
		var $this = $(this);
		var idea_block = $(this).parents('.idea');
		var elem = $(this).parents('.idea').find('img');
		var url = elem.attr("src");
		var fav_cnt = parseInt($('.fav_nbr').text());
		$this.find('i').removeClass('mdi-heart-outline').addClass('mdi-loading mdi-spin');
		$.post(app_object.ajax_url, { action: "save_image", url: url }, function (data) {
			if (data != '0') {
				$this.html('<i class="mdi mdi-check"></i>');
				var new_post_id = parseInt(data);
				var last_nbr = parseInt($(".favs .idea").last().find('.index').text());
				if (isNaN(last_nbr)) {
					last_nbr = 1;
				}
				last_nbr++;
				fav_cnt++;
				idea_block.addClass('faved');
				$('.fav_nbr').text(fav_cnt);
				$('.ideacontent .favs .explainer').hide();
				var idea_html = '<div class="idea new"><img src="' + url + '"><div class="btn-ideas"><button class="btn white rounded shadow-sm btn-sm copy-img"><i class="mdi mdi-content-copy"></i> Copy</button><a href="https://copymatic.ai/api/image-downloader.php?url=' + encodeURIComponent(url) + '" class="btn white rounded shadow-sm btn-sm download-img" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9.878,18.122a3,3,0,0,0,4.244,0l3.211-3.211A1,1,0,0,0,15.919,13.5l-2.926,2.927L13,1a1,1,0,0,0-1-1h0a1,1,0,0,0-1,1l-.009,15.408L8.081,13.5a1,1,0,0,0-1.414,1.415Z"></path><path d="M23,16h0a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H3a1,1,0,0,1-1-1V17a1,1,0,0,0-1-1H1a1,1,0,0,0-1,1v4a3,3,0,0,0,3,3H21a3,3,0,0,0,3-3V17A1,1,0,0,0,23,16Z"></path></svg> Download</a><button class="btn white rounded shadow-sm btn-sm unsave-image"><i class="mdi mdi-delete"></i><span>Delete</span></button></div></div>';
				$('.ideacontent .favs').prepend(idea_html);
			}
		});
	});
	$(document).on('click', '.unsave-image', function () {
		var $this = $(this);
		var idea_block = $(this).parents('.idea');
		var elem = $(this).parents('.idea').find('img');
		var url = elem.attr("src");
		var fav_cnt = parseInt($('.fav_nbr').text());
		$.post(app_object.ajax_url, { action: "unsave_image", url: url }, function (data) {
			if (data != '0') {
				idea_block.remove();
				fav_cnt--;
				$('.fav_nbr').text(fav_cnt);
				if (fav_cnt == 0) {
					$('.ideacontent .favs .explainer').show();
				}
			}
		});
	});
	$(document).on('click', '.unfav', function () {
		var $this = $(this);
		var idea_block = $(this).parents('.idea');
		var idea_id = idea_block.data('id');
		var fav_cnt = parseInt($('.fav_nbr').text());
		$.post(app_object.ajax_url, { action: "unfav_idea", idea_id: idea_id }, function (data) {
			if (data == '1') {
				idea_block.remove();
				fav_cnt--;
				$('.fav_nbr').text(fav_cnt);
				idea_block.removeClass('faved');
				if (fav_cnt == 0) {
					$('.ideacontent .favs .explainer').show();
				}
			}
		});
	});
	$(document).on('click', '#select-all', function () {
		var _this = $(this);
		_this.hide();
		$('.secondary-buttons').show();
		$('.height-align .idea').each(function (i, obj) {
			$(this).removeClass('faved');
			$(this).addClass('selected');
		});
	});
	$(document).on('click', '#deselect-all', function () {
		$('.secondary-buttons').hide();
		$('#select-all').show();
		$('.height-align .idea').each(function (i, obj) {
			$(this).removeClass('selected');
		});
	});
	$(document).on('click', '#copy-all', function () {
		var content = '';
		var _this = $(this);
		$('.idea.selected p').each(function (i, obj) {
			content += $(this).text() + '';
		});
		copyToClipboardTexts(content);
		_this.text('Copied!');
		setTimeout(function (_this) {
			$('#copy-all').text('Copy All');
		}, 1500);
	});
	$(document).on('click', '.check-plagiarism', function () {
		var $this = $(this);
		if ($(this).parent().parent().hasClass('opts')) {
			var parent = $(this).closest('.editor-section');
			var elem = parent.find('textarea');
			var idea_text = elem.val();
		} else if ($(this).parent().hasClass('rewriter-center')) {
			var parent = $(this).closest('.rewrite-row');
			var elem = parent.find('.rewritten');
			var idea_text = elem.val();
		} else {
			var idea_block = $(this).parents('.idea');
			var elem = idea_block.find('p');
			var idea_text = elem.text();
		}
		if (idea_text != "") {
			var loading_html = document.createElement("div");
			loading_html.innerHTML = '<div class="dot-opacity-loader" style="margin-top: 40px;margin-bottom:0px;"><span></span><span></span><span></span></div><div class="swal-title">Checking Plagiarism</div><div class="swal-text">Please wait, this can take a few seconds.</div>';
			swal({
				content: loading_html,
				buttons: false,
				closeOnClickOutside: false,
				className: "plagiarism-check-loading"
			});
			$.post(app_object.ajax_url, { action: "check_plagiarism", idea: idea_text }, function (data) {
				swal.close();
				if (data != '0') {
					var json = $.parseJSON(data);
					if (json['not-enough-credits']) {
						swal({
							title: "Insufficient credits",
							text: "You ran out of word credits to check for plagiarism. This text has " + json['wordcount'] + " words and you have " + json['balance'] + " word credits left. You can purchase more credits by clicking on the link below.",
							icon: "warning",
							button: "Purchase credits",
							className: "plagiarism-modal"
						}).then(function (button) {
							if (button) {
								window.location.href = "/plagiarism-credits/";
							}
						});
					} else if (json['upgrade-needed']) {
						swal({
							title: "Upgrade your account",
							text: "The plagiarism checker is available to our paid users. Please upgrade your account by clicking on the link below:",
							icon: "warning",
							button: "Upgrade",
							className: "plagiarism-modal"
						}).then(function (button) {
							if (button) {
								window.location.href = "/upgrade/";
							}
						});
					} else {
						var results_word = "result";
						if (json['results'] > 1) {
							results_word += 's';
						}
						if (json['rate'] > 10) {
							swal('High Rate', "The plagiarism rate of this text is " + json['rate'] + "% which is very high: " + json['results'] + " " + results_word + " found for " + json['wordcount'] + " words.", "error");
						} else if (json['rate'] < 10 && json['rate'] > 5) {
							swal('Fair Rate', "The plagiarism rate of this text is " + json['rate'] + "% which is fair but it could be better: " + json['results'] + " " + results_word + " found for " + json['wordcount'] + " words.", "warning");

						} else if (json['rate'] < 5 && json['rate'] > 0) {
							swal('Very Good Rate', "The plagiarism rate of this text is " + json['rate'] + "% which is very good: " + json['results'] + " " + results_word + " found for " + json['wordcount'] + " words. Try to rewrite it to make it 100% original.", "success");

						} else if (json['rate'] == 0) {
							swal({
								title: 'Perfect Rate',
								text: "Congrats! The plagiarism rate of this text is " + json['rate'] + "% so your text is completely original: 0 result found for " + json['wordcount'] + " words.",
								icon: 'success'
							});
						} else {
							swal("Error", "An error occurred while trying to check the plagiarism. Please try again or contact support.", "error");
						}
					}
				} else {
					swal("Error", "An error occurred while trying to check the plagiarism of your text. Please try again or contact support.", "error");
				}
			});
		} else {
			swal("Error", "The text you are trying to check is empty.", "error");
		}
	});
	$('#tool-search').keyup(function () {
		var _val = $(this).val().toLowerCase();
		if (_val.length > 0) {
			$(".main-menu .model-box h4").each(function (index) {
				if ($(this).text().toLowerCase().search(_val) < 0) {
					$(this).parent().parent().hide();
				}
			});
		} else {
			$(".main-menu .model-box").show();
		}
	});
	$('.navbar-toggler').click(function () {
		var main_menu = $('.main-menu');
		if (main_menu.hasClass('open')) {
			$('.main-menu').removeClass('open');
		} else {
			$('.main-menu').addClass('open');
		}
	});
	$("#news-trigger").click(function (e) {
		e.preventDefault();
		$('.news-frame').addClass('visible');
		$.post("/actions-api/", { action: "mark_news_as_read" }, function () {
			$('#news-trigger .pulse-indicator').hide();
		});
	});
	$(".news-overlay, .news-close-icon").click(function (e) {
		e.preventDefault();
		$('.news-frame').removeClass('visible');
	});
	$(".projects-overlay, .projects-close-icon").click(function (e) {
		e.preventDefault();
		$('.projects-frame').removeClass('visible');
	});
	var initial_data = {};
	initial_data.key = cf_key;
	initial_data.action = "get_user_details";
	if (typeof team_key !== 'undefined' && team_key != '') {
		initial_data.team_key = team_key;
	}
	$.post(cf_api_url, JSON.stringify(initial_data), function (data) {
		
		if (data['error']) {
			console.log("error called");
			trigger_error(data['error']);
		}
		if (data) {
			var credits = data.credits;
			var plan_credits = data.plan_credits;
			var total_words = data.total_words;
			var total_items = data.total_items;
			var saved_hours = Math.ceil((total_words * 2) / 500);
			$('#credit-count, #credit-count-bar, .credits_cnt').text(credits.toLocaleString('us'));
			$('.plan_credits').text(plan_credits.toLocaleString('us'));
			$('.user_total_words').text(total_words.toLocaleString('us'));
			$('.user_total_items').text(total_items.toLocaleString('us'));
			$('.saved_hours').text(saved_hours.toLocaleString('us'));
			if (data.extra_credits && data.extra_credits > 0) {
				var extra_credits = data.extra_credits;
				$('.extra_credits').text(extra_credits.toLocaleString('us'));
			}
			if (data.plan_id == 3) { // free trial
				handle_free_trial_bar(credits);
			}
		}
	});
	$(document).on('click', '.dropdown-menu .projects-btn button', function (e) {
		e.stopPropagation();
		$('.projects-frame').addClass('visible');
	});
	$(document).on('click', '.project-actions .delete-project', function (e) {
		e.stopPropagation();
		var project = $(this).closest('.project');
		var project_id = project.data('id');
		swal({
			title: "Delete project",
			text: "Are you sure you want to delete this project and ALL its contents?",
			icon: "error",
			showCancelButton: false,
			showConfirmButton: false,
			closeOnConfirm: false,
			closeOnCancel: false,
			className: "delete-proj",
			buttons: [
				'Cancel',
				'Delete'
			],
		}).then(function (isConfirm) {
			if (isConfirm) {
				$.post(app_object.ajax_url, { action: "delete_project", id: project_id }, function (data) {
					if (data != '0') {
						if (project.hasClass('.active')) {
							$('.projects-all .project:first-child').addClass('active');
							$('.projects-all .project:first-child .project-avatar span').html('<i class="mdi mdi-check"></i>');
						}
						project.remove();
					}
				});
			}
		});
	});
	$(document).on('click', '.project-actions .edit-project', function (e) {
		e.stopPropagation();
		var project = $(this).closest('.project');
		var project_id = project.data('id');
		var project_name = project.find('.project-name span:first-child').text();
		var project_domain = project.find('.project-domain').text();
		var project_html = document.createElement("div");
		project_html.innerHTML = '<div><div class="form-row"><label>Name<span style="color:red">*</span></label><input type="text" name="project_name" placeholder="Project Name" id="project_name" value="' + project_name + '" required></div><div class="form-row"><label>Domain name (optional)</label><input type="text" name="project_domain" placeholder="google.com" id="project_domain" value="' + project_domain + '"></div></div>';
		swal({
			title: 'Edit Project',
			content: project_html,
			className: "new_project_modal",
			buttons: [
				'Cancel',
				'Save'
			],
			closeOnConfirm: false
		}).then(function (result) {
			var name = $('#project_name').val();
			var domain = $('#project_domain').val();
			if (name) {
				$.post(app_object.ajax_url, { action: "update_project", id: project_id, name: name, domain: domain }, function (data) {
					if (data != '0') {
						var json = JSON.parse(data);
						var edited_project = $('.project[data-id="' + json['id'] + '"]');
						$('.project[data-id="' + json['id'] + '"] .project-name span:first-child').text(json['name']);
						if (json['domain']) {
							$('.project[data-id="' + json['id'] + '"] .project-domain').text(json['domain']);
						}
						if (!edited_project.hasClass('active')) {
							$('.project[data-id="' + json['id'] + '"] .project-avatar span').text(json['acronym']);
						}
					}
				});
			}
		});
	});
	$(document).on('click', '.projects-add button', function (e) {
		var new_project = document.createElement("div");
		new_project.innerHTML = '<div><div class="form-row"><label>Name<span style="color:red">*</span></label><input type="text" name="project_name" placeholder="Project Name" id="project_name" required></div><div class="form-row"><label>Domain name (optional)</label><input type="text" name="project_domain" placeholder="google.com" id="project_domain"></div></div>';
		swal({
			title: 'Create Project',
			content: new_project,
			className: "new_project_modal",
			buttons: [
				'Cancel',
				'Save'
			],
			closeOnConfirm: false
		}).then(function (result) {
			var project_name = $('.new_project_modal #project_name').val();
			var project_domain = $('.new_project_modal #project_domain').val();
			if (project_name) {
				$.post(app_object.ajax_url, { action: "create_project", name: project_name, domain: project_domain }, function (data) {
					if (data != '0') {
						var json = JSON.parse(data);
						var project_html = '<div class="project" data-id="' + json['id'] + '"><div class="project-left"><div class="project-avatar"><span>' + json['acronym'] + '</span></div><div class="project-name"><span>' + json['name'] + '</span>';
						if (project_domain) {
							project_html += '<span class="project-domain">' + json['domain'] + '</span>';
						}
						project_html += '</div></div><div class="project-actions"><button class="edit-project btn white rounded shadow-sm btn-sm" type="button"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500 group-hover:text-gray-600"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg></button><button class="delete-project btn white rounded shadow-sm btn-sm"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-gray-500 group-hover:text-gray-600"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></div>';
						$('.projects-all').append(project_html);
					}
				});
			}
		});
	});
	$(document).on('click', '.project', function (e) {
		var project = $(this);
		if (!project.hasClass('active')) {
			var project_id = $(this).data('id');
			$.post(app_object.ajax_url, { action: "switch_current_project", id: project_id }, function (data) {
				if (data != '0') {
					$('.project').removeClass('active');
					project.addClass('active');
					project.find('.project-avatar span').html('<i class="mdi mdi-check"></i>');
					location.reload();
				}
			});
		}
	});
	$('.projects-search input').keyup(function (e) {
		var value = $(this).val().toLowerCase();
		if (value) {
			$(".project").each(function () {
				var name = $(this).find('.project-name span:first-child').text().toLowerCase();
				var domain = $(this).find('.project-domain').text().toLowerCase();
				if (name.indexOf(value) >= 0 || domain.indexOf(value) >= 0) {
					$(this).show();
				} else {
					$(this).hide();
				}
			});
		} else {
			$(".project").show();
		}
	});
	$('.teams-btn button').click(function (e) {
		$('.teams-btn button').prop('disabled', false);
		$('.teams-btn button svg').remove();
		$(this).prop('disabled', true);
		var team_id = $(this).data('teamid');
		$(this).append('<svg viewBox="0 0 14 14"><polygon fill="currentColor" points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"></polygon></svg>');
		$.post(app_object.ajax_url, { action: "switch_current_team", team_id: team_id }, function (data) {
			if (data != '0') {
				location.reload();
			}
		});
	});
})
function acronym(text) {
	var a = text.split(/\s/).reduce(function (accumulator, word) { return accumulator + word.charAt(0); }, '');
	var aa = a.slice(0, 2);
	return aa;
}
function remove_numbers_start(str) {
	return str.replace(/^[0-9]+/g, '').replace('  ', ' ').trim();
}
function trim_point(str) {
	return str.replace(/^[.]+/, '').replace(/[.]+$/, '').trim();
}
function handle_free_trial_bar(credits) {

	$('.upgrade-row .plan_name span').text("Remaning data");
  $('.upgrade-row .plan_words').text( credits.toLocaleString('us') + " of 81,000 words used");
	// calculate percentage
	var percentage = (credits * 100) / 81000;
	var w_p = 100 - percentage;
	$('.upgrade-row .progress-bar').css('width', w_p + '%');
	$('a[href="/upgrade/"]').remove();
  var trial_text = '<p><strong>Resell Tools</strong>. Enjoy market best and fully automated Group-buy Copymatic.</p><p class="mobile"><strong>Resell Tools</strong>, Enjoy market best and fully automated Group-buy Copymatic. 🚀</p>';
	$('.upgrade-row .upgrade-left p').html(trial_text);
}
  `);


  
});
