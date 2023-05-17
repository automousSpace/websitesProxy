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

const proxyURL = 'http://sshukl03:QkWCr8hB@23.106.205.88:29842';
const baseDomain = process.env.ROOT_DOMAIN || "bundledseo.com";
const isProduction = process.env.NODE_ENV || "production";
const fileRead = (filename) => fs.readFileSync(filename);

const generateYandexMetrica = (userID) => {
  return `
    <script type="text/javascript" >
       (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
       m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
       (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

       ym(72683164, "init", {
            clickmap:true,
            trackLinks:true,
            accurateTrackBounce:true,
            webvisor:true,
            userParams: {
              UserID: ${userID}
            }
       });
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/72683164" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
  `;
};

const generateTrackingScript = (userID) => {
  const code = `
    document.addEventListener("DOMContentLoaded", function(e) {
      fetch('https://tracker.bundledseo.com/event', {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ userID: ${userID}, host: location.hostname })
      })
    });
  `;
  const result = UglifyJS.minify(code);
  return `<script type="text/javascript">${result.code}</script>`;
}

const generateDevToolsOpenScript = (userID) => {
  const code = `
    document.addEventListener("DOMContentLoaded", function(e) {
      var sent = false;
      const div = document.createElement('div');
      let loop;
      let onSuccess;

      Object.defineProperty(div, 'id', {get: function() {
        onSuccess();
      }});


      function startDevToolsListener(onDevToolsOpen) {
        onSuccess = onDevToolsOpen;
        loop = setInterval(function() {
          console.log(div);
          console.clear();
        });
      }

      function stopDevToolsListener() {
        clearInterval(loop);
      };


      function isDevToolsOpened() {
        let result = false;
        const divIsOpened = document.createElement('div');
        Object.defineProperty(divIsOpened, 'id', {get: function() {
          result = true;
        }});
        console.log(divIsOpened);

        return result;
      }

      startDevToolsListener(function(t) {
        if(isDevToolsOpened()) {
          if(!sent) {
            fetch('https://tracker.bundledseo.com/event', {
              headers: { "Content-Type": "application/json" },
              method: "POST",
              body: JSON.stringify({ userID: ${userID}, host: "DEVTOOLS" })
            });
            sent = true;
          }
        }
      })
    });
  `;
  const result = UglifyJS.minify(code);
  return `<script tyle="text/javascript">${result.code}</script>`;
}

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
  ahx: {
    productID: [5, 15, 21, 23, 36, 39, 37, 40, 41], // 39 is trial
    address: 'https://ahrefs.com',
    host: 'ahrefs.com',
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    cookie: `__cfduid=dba2f787fc347d2d448365a31932398f11605907470; intercom-id-dic5omcp=14cb110a-f98c-42b6-b18a-835ffe638677; G_ENABLED_IDPS=google; io=pMnOwlS8TZkSMSlVEbpq; BSSESSID=%2BG%2F9Iy%2BAGSn4ab7%2F62RB1IaiDpYmCRAdEy96AfFt; XSRF-TOKEN=eyJpdiI6IkRWUm5aSWdCOFJFdjhXTXFJOHUzZ3c9PSIsInZhbHVlIjoiQ3loWjJEQk5DZkNVczVhWWtDTzMySHFFYUdIUVg0QmM5ZWdoRXFUV0MxS21QWlgrRmE2MW1RWDEyWlFnZTVrV0xwTks1QlYxdmRxWnBDTWp6aWR4cXc9PSIsIm1hYyI6IjI3OTU2ZTU2MzNlYWY3MDM2ZTUxZjM2YjIwOTI4MWUyZWI1Y2JiNDMwZmFhNzk1MDhlNTcwYjU1Zjc3YWY1NDAifQ%3D%3D; intercom-session-dic5omcp=d1ppVjVCS3JZZmpGdEl2WGNPVmhTMGJQcmNWcnlaQjBaa0Q5WktLZ3JVVEI2cnljYnZCeUEzWmozcXpNRng3Wi0tNTlDQitWM0xoREZLalgxN3J1N2FMZz09--f64dfddbd7c30a9a374d228ad8f88f2cc7812f36`,
    withAgent: true,
    blockedRoutes: [
      '',
      '/account',
      '/dashboard', 
      '/site-audit', 
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

        body = body.replace(/Ahrefs Academy/, `
          <script async="true" src="https://access.bundledseo.com/application/default/views/public/js/ahrefs-script.js"></script>
          ${generateTrackingScript(userID)}
          ${generateYandexMetrica(userID)}
          ${generateDevToolsOpenScript(userID)}
        `);

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
    redirectDomain: "ahx." + baseDomain,
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
    redirectDomain: "ahx." + baseDomain,
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
    redirectDomain: "ah." + baseDomain,
    redirectPath: "/site-explorer",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: false,
    responseModifiers: []
  },

  sr: {
    productID: [6, 15, 21, 24, 36, 37, 39, 40, 41],
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
    redirectDomain: "sr." + baseDomain,
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
          ${generateYandexMetrica(userID)}
          ${generateTrackingScript(userID)}
        `);

        body = body.replace(/window.intercomSettings.*};/gm, '');
        //body = body.replace(/window.sm2.user.*};/gm, '');
        return body;
      }
    ]
  },

  bs: {
    productID: [8, 15, 21, 26, 37, 39, 41],
    address: 'https://app.buzzsumo.com',
    host: 'app.buzzsumo.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    withAgent: true,
    blockedRoutes: [],
    redirectDomain: "bs." + baseDomain,
    redirectPath: "/pro",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("BuzzSummo", "UserID: ", userID);
        body = body.replace(/<meta name="twitter:title" content="BuzzSumo Trending" \/>/g, `
         <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" type="text/javascript"></script>
         <script type="text/javascript">

          window.setInterval(function(){
            console.clear();
            $(".trial-banner.text-center.p-2.d-flex.align-items-center.justify-content-center").remove();
            $("footer.mt-auto.d-print-none").remove();
            $(".menu-item.px-5").remove();
            $("button.ax-button.ax-button--blast-off.ax-button--accent.ax-button--primary.ax-button--rectangle-medium").remove();
            $(".text-center.p-2.d-none.d-md-flex.align-items-center.justify-content-center.charge-failed-banner").remove();
            $(".ax-card.m-auto.px-7.pt-5.pb-7.ax-card--size-medium.ax-card--shade-3.ax-card--border-radius-small").remove();
            $(".d-none.d-md-flex.order-lg-3.align-items-center.user-nav-container").remove(); 
            $('button.ax-button.mt-6.d-block.mx-auto.ax-text--size-large.ax-button--accent.ax-button--tertiary.ax-button--rectangle-medium').remove();
            $("span.ax-text.d-block.mt-3.ax-text--color-subtle").remove();
            $(".ax-card__content.ax-card__content--separator-solid.ax-card__content--size-small").remove();
            $("g").remove();
            $(".ax-card.d-none.d-md-block.ax-card--size-large.ax-card--shade-1.ax-card--border-radius-small.ax-card--shadow").remove();
            $("button.ax-button.mr-3.mr-md-0.ax-button--accent.ax-button--secondary.ax-button--rectangle-small").remove();
            $(".ax-position.ax-position--arrow.pro-tip-position").remove();
            //$("span, p, h1, strong").each(function() {
            //var text = $(this).text();
            //text = text.replace("your free trial is now over", "your billing is now over");
            //$(this).text(text);
            //});
          }, 1);
            $(".dropdown.hidden-xs").html("");
            $(".visible-lg").remove();
            $(".alert.alert-danger.top-app-message").remove();
            $("#pricing-page").remove();

            $('body').mouseover(function() {
              $(".dropdown.hidden-xs").html("");
              $(".visible-lg").remove();
              $(".alert.alert-danger.top-app-message").remove();
              $("#pricing-page").remove();
            });

          </script> 

          ${generateTrackingScript(userID)}
          ${generateYandexMetrica(userID)}
        `);
        return body;
      }
    ]
  },

  wa: {
    productID: [9, 15, 21, 27, 36, 37, 39, 40, 41],
    address: 'https://wai.wordai.com',
    host: 'wordai.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    withAgent: true,
    blockedRoutes: [
      '',
      '/',
      '/users/affiliate.php',
      '/users/account.php',
      '/users/filemanager.php',
      '/users/api.php',
      '/users/contact.php',
      '/blog',
      '/users/logout.php',
      '/account'
    ],
    redirectDomain: "wa." + baseDomain,
    redirectPath: "/rewrite",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("WordAI", "UserID: ", userID);
        body = body.replace(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/g, 'private@email.com');
        body = body.replace(/All rights reserved/, `
        <script>
          $(".footer").remove();
          $(".subfooter").remove();
          $(".Embed").remove();
          $("header").html("<div class='container clearfix'><div class='one-third column clearfix'><div class='logo'><a href='https://wa.bundledseo.com/turing.php'><img src='https://wordai.com/img/logo-word-ai-full.png' alt='via BundledSEO'></a></div></div><div class='two-thirds column clearfix'><div class='subheader'><ul class='sf-menu l_tinynav1 sf-js-enabled sf-shadow'><li></li><li><a href='https://bundledseo.com/' target='_blank'>BundledSEO</a></li><li><a href='https://wa.bundledseo.com/turing.php'>Tuning Spinner</a></li><li><a href='https://wa.bundledseo.com/foreignlanguage.php'>Foreign Language Spinner</a></li></ul></div></div></div>");
          $("input:image").remove();

          $('body').mouseover(function() {
              console.clear();
              $('a[href$="turing-bulk.php"]').remove();
              $(".footer").remove();
              $(".subfooter").remove();
              $(".Embed").remove();
              $("header").html("<div class='container clearfix'><div class='one-third column clearfix'><div class='logo'><a href='https://wa.bundledseo.com/turing.php'><img src='https://wordai.com/img/logo-word-ai-full.png' alt='via BundledSEO'></a></div></div><div class='two-thirds column clearfix'><div class='subheader'><ul class='sf-menu l_tinynav1 sf-js-enabled sf-shadow'><li></li><li><a href='https://bundledseo.com/' target='_blank'>BundledSEO</a></li><li><a href='https://wa.bundledseo.com/turing.php'>Tuning Spinner</a></li><li><a href='https://wa.bundledseo.com/foreignlanguage.php'>Foreign Language Spinner</a></li></ul></div></div></div>");
              $("input:image").remove();
          });
        </script>
        ${generateTrackingScript(userID)}
        ${generateYandexMetrica(userID)}
        `);
        return body;
      }
    ]
  },

  mz: {
    productID: [7, 15, 21, 25, 37, 39, 41],
    address: 'https://analytics.moz.com',
    host: 'analytics.moz.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    withAgent: true,
    blockedRoutes: ['', '/', '/home', '/subscriptions', '/account', '/videos', '/logout'],
    redirectDomain: "mz." + baseDomain,
    redirectPath: "/pro",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Moz", "UserID: ", userID);
        body = body.replace(/https:\/\/analytics.moz.com/g, getDomain("mz"));
        body = body.replace(/https:\/\/moz.com/g, getDomain("mza"));
        body = body.replace(/https:\/\/moz.com\/tracking\/event\//g, getDomain("mza") + "/tracking/event");
        body = body.replace(/Copyright/g, `
         <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" type="text/javascript"></script>
          <script>
$(".mgn-profile.mgn-selectable").html("");
$(".mgn-nav-extra").html("<a href=\'/pro/link-explorer/home\' title=\'Link Explorer\' style=\'position: relative;padding: 3px 10px 0;color: #000000;height: 56px;line-height: 56px;overflow: hidden;font-size: 16px;\'>Link Explorer</a><a href=\'/main-reference/researchtools/fwe/\' title=\'Fresh Web Explorer\' style=\'position: relative;padding: 3px 10px 0;color: #000000;height: 56px;line-height: 56px;overflow: hidden;font-size: 16px;\'>Fresh Web Explorer</a><a href=\'/pro/keyword-explorer\' title=\'Keyword Explorer\' style=\'position: relative;padding: 3px 10px 0;color: #000000;height: 56px;line-height: 56px;overflow: hidden;font-size: 16px;\'>Keyword Explorer</a><a href=\'/pro/research/page-grader\' title=\'On-Page Grader\' style=\'position: relative;padding: 3px 10px 0;color: #000000;height: 56px;line-height: 56px;overflow: hidden;font-size: 16px;\'>On-Page Grader</a><a href=\'/pro/research/crawl\' title=\'On-Page Crawl\' style=\'position: relative;padding: 3px 10px 0;color: #000000;height: 56px;line-height: 56px;overflow: hidden;font-size: 16px;\'>On-Page Crawl</a><a href=\'/main-reference/researchtools/rank-tracker\' title=\'Rank Tracker\' style=\'position: relative;padding: 3px 10px 0;color: #000000;height: 56px;line-height: 56px;overflow: hidden;font-size: 16px;\'>Rank Tracker</a>");
$(document).ready(function(){
    $("body").mouseover(function() {
      // console.clear();
        $(".book-demo-banner-vertical-trial").remove();
        $(".landing").remove();
         $('a[href$="/pro/research/crawl"]').remove();
         $('a[href$="/pro/link-explorer/lists"]').remove();
         $('a[href$="/pro/research/page-grader"]').remove();
         $('a[href$="/pro/local-market-analytics"]').remove();
         $('a[href$="/main-reference/help/guides/link-explorer"]').remove();
         $('a[href$="/main-reference/help/whats-new"]').remove();
        $(".intro-panel").remove();
        $("div#gateway-client-header").remove();
        $(".video-wrapper.hidden-print").html("<center><h2 class='text-xs-center' style='margin-top:50px;color:#555;font-weight:bold;text-align:center;font-size:28px'>You're using Moz via BundledSEO</h2></center>");
        $(".book-demo-banner-horizontal-trial").remove();
        $(".free-trial.box").remove();
        $("p.links-quota").remove();
        $(".book-demo-banner-vertical-trial").remove();
        $(".book-demo-banner-horizontal-trial").remove();
        $(".free-trial.box").remove();
        $(".free-trial.free-trial-vertical").remove();
        $(".subnav .container .subnav-breadcrumbs").html("");
        $(".subnav.container .subnav-primary-items .subnav-dropdown").remove();
        $(".subnav .container .subnav-items").remove();
        $(".kaleidoscope-subnav").html("");
        $("#globalfooter").remove();
        $(".mgn-nav-meta").html("");
    });
});
</script>
        ${generateTrackingScript(userID)}
        ${generateYandexMetrica(userID)}
          `);
        return body;
      },
    ]
  },

  mza: {
    productID: [7, 15, 21, 25, 39],
    address: 'https://moz.com',
    host: 'moz.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    withAgent: true,
    blockedRoutes: ['', '/', '/home', '/subscriptions', '/account', '/videos', '/logout'],
    redirectDomain: "mz." + baseDomain,
    redirectPath: "/pro",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: []
  },

  ax: {
    productID: [10, 15, 21, 28, 37, 39, 41],
    address: 'https://www.alexa.com',
    host: 'www.alexa.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    withAgent: true,
    blockedRoutes: [
      "",
      "/account",
      "/account/paymenthistory",
      "/toolbar",
      "/logout",
      "/logout?mode=logout",
      "/product-tour"
    ],
    redirectDomain: "ax." + baseDomain,
    redirectPath: "/siteinfo",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Alexa", "UserID: ", userID);
        body = body.replace(/Contact us to get started/g, `
          <script type="text/javascript">
            $("a[href='https://try.alexa.com/advanced-plan']").attr('href', 'https://ax.bundledseo.com/');

            window.setInterval(function(){
              $(".menu-tab.AlexaTooltip.support-action").remove();
              $("p.side.manage").remove();
              $(".side.manage").remove();
              $("#alx-footer").remove();
              $(".row-fluid.AgencyUpsell.Hellobar").remove();
              $(".menu-tab.TopnavMenuDropDown.profile").remove();
              $(".menu").remove();
              $(".OrangeBanner").remove();
              $(".menu-tab.blog.AlexaTooltip").remove();
              console.clear();
            }, 1);
          </script>
          ${generateTrackingScript(userID)}
          ${generateYandexMetrica(userID)}
        `)
        return body;
      }
    ]
  },

  kt: {
    productID: [11, 15, 21, 29, 36, 37, 39, 40, 41],
    address: 'https://keywordtool.io',
    host: 'keywordtool.io',
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
    withAgent: true,
    blockedRoutes: [
      '/user'
    ],
    redirectDomain: "kt." + baseDomain,
    redirectPath: "/",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("KT", "UserID: ", userID);
        body = body.replace(/https:\/\/keywordtool.io/g, getDomain('kt'));
        body = body.replace(/<div class="device-xs visible-xs"><\/div>/, `
          <script>
            setInterval(function() {
              const el = document.querySelector("#menu-second");
              if(el) {
                el.remove();
              }
            }, 1);
          </script>
          ${generateYandexMetrica(userID)}
          ${generateTrackingScript(userID)}
        `)
        return body;
      }
    ]
  },

  sf: {
    productID: [12, 15, 21, 30, 37, 39, 41],
    address: 'https://www.spyfu.com',
    host: 'www.spyfu.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    withAgent: true,
    blockedRoutes: [],
    redirectDomain: "sf." + baseDomain,
    redirectPath: "/pro",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("SpyFu", "UserID: ", userID);
        body = body.replace(/<link rel="icon" type="image\/png" href="\/next\/raw_assets\/favicon\/favicon-196x196.png" sizes="196x196" \/>/g, `
          <script src="https://code.jquery.com/jquery-3.4.1.min.js" type="text/javascript"></script>
          <script type="text/javascript">
            setTimeout(function() {
              $(".sf-account").remove();
              $("footer").remove();
              $(".nav.navbar-nav.navbar-right").remove();
              $(".live-chat").remove();
              $('.sf-hq-page').text('');
              $('a[href*="/overview/nacho"]').remove();
              $('body').mouseover(function() {
                $(".sf-account").remove();
                $('a[href*="/overview/nacho"]').remove();
                $("footer").remove();
                $(".nav.navbar-nav.navbar-right").remove();
                $(".live-chat").remove();
                $('.sf-hq-page').text('');
                $(".mb-8.hero.hide-on-export").remove();
                $(".region").remove();
              });

              window.setInterval(function(){
                // console.clear();
                $(".sf-account").remove();
                $('a[href*="/overview/nacho"]').remove();
                $("footer").remove();
                $(".nav.navbar-nav.navbar-right").remove();
                $(".live-chat").remove();
                $('.sf-hq-page').text('');
                $(".mb-8.hero.hide-on-export").remove();
                $(".region").remove();
              }, 1);
            }, 1500);
</script>
          ${generateTrackingScript(userID)}
          ${generateYandexMetrica(userID)}
          `)
        return body;
      }
    ]
  },


  qt: {
    productID: [13, 15, 21, 31, 36, 37, 39, 40, 41],
    address: 'https://www.quetext.com',
    host: 'www.quetext.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    withAgent: false,
    blockedRoutes: [
      "", 
      "/",
      "/account/settings",
      "/account/subscription",
      "/account/billing",
      "/logout"
    ],
    redirectDomain: "qt." + baseDomain,
    redirectPath: "/search",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("Quetext", "UserID: ", userID);
        return body;
      }
    ]
  },

  wr: {
    productID: [14, 15, 21, 33, 37, 39, 41],
    address: 'https://www.woorank.com',
    host: 'www.woorank.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    withAgent: true,
    blockedRoutes: [
      "",
      "/",
      "/en/overview",
      "/en/user/account",
      "/en/pdf-editor",
      "/en/logout",
      "/en/create/project",
    ],
    redirectDomain: "wr." + baseDomain,
    redirectPath: "/en/create/review",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("WooRank", "UserID: ", userID);
        body = body.replace(/<meta charset="utf-8" \/>/g, `
          <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.js" type="text/javascript"></script>
          <script type="text/javascript">
             window.setInterval(function(){
               $('#footer').remove();
               $('a[href$="/en/create/project"]').remove();
               $('a[href$="/api/symbols.svg#question"]').remove();
               $('a[href$="/en/logout"]').remove();
               $('a[href$="/en/user/account"]').remove();
               $('.nr-dropdown-user-email').remove(); //console.clear();
            }, 1);
          </script>
          ${generateTrackingScript(userID)}
          ${generateYandexMetrica(userID)}
          `)

        return body;
      }
    ]
  },

  dc: {
    productID: [14, 15, 39],
    address: 'https://www.domcop.com',
    host: 'www.domcop.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `PHPSESSID=fc1g2tjim8g60vmk9da96r0g36;`,
    withAgent: true,
    blockedRoutes: [],
    redirectDomain: "dc." + baseDomain,
    redirectPath: "/domains",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body) {
        console.log("Domcomp", "UserID: ", userID);
        body = body.replace(/https:\/\/www.domcop.com/g, getDomain('dc'));
        body = body.replace('var weNeedRecaptcha = 1 ;', 'var weNeedRecaptcha = 0 ;');
        body = body.replace(/resp\.proveNotRobot/, '!resp\.proveNotRobot');
        body = body.replace('aoData.push({"name": "g-recaptcha-response", "value": tokenToUse});', 'aoData.push({ name: "g-recaptcha-response", "value": "03AGdBq24QXIXuqKF3yyycqh30YiaxaUYcnFpl186WyDYi4xh2RKDqG9vHyzN4HRBrX6Ah6eIecYu5_TdkiRxlxB56g7iWboFdCFeDcWwdTIYxGJJtaI3zBAZvTmSEbVadficYKGEYM_XC3iie3hC1_MksoddAGytxv1s7sDkN3DcY5EKvYXjNK1eTktun9P8iHyXjUsq9iUHmlQC0h8UKNKvdvEx2gJZaDLWJh9GHH-QpDpfwy47a83kQSWg3jt065oPkA35qREfGn0K1FVT1C1Hr04fKZJrEobZAIRvEnnQrSiIateD-zT-7N8egBxMEdNEa6KvAcJzA0wpnHdIoG-3FIYccICFiSkVTh8KT6o6cOt7LZs-enpcJpwQk-IPutJh5euIERD2srj9fqoazpAJThryS9Xpcv90xekfZjLEvnM51hFEREZbPDWsZ3ie5GOdsQKyWcFnR" })');
        body = body.replace(/<!-- JS Files -->/, `
          <script>
            setInterval(() => {
              const doc = document.querySelector('#recaptcha');
              if(doc) { doc.remove(); }
            }, 100);
          </script>
          ${generateTrackingScript(userID)}
        `);
        return body;
      }
    ]
  },

  af: {
    productID: [15, 21, 39, 42, 43],
    address: 'https://af.articleforge.com',
    host: 'af.articleforge.com', 
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `_ga=GA1.2.1889560159.1601745743; _fbp=fb.1.1601745759262.415748229; km_lv=x; _gid=GA1.2.1850492523.1608536249; km_vs=1; remember_user_token=W1s5ODk4NF0sIiQyYSQxMCRDQzlwODc0VlFiWDdvM1BkS2FwZEkuIl0%3D--c91d39e63d2369edf52706b1ae9267329f5e4d6b; km_ai=98984; km_ni=98984; _gat=1; __stripe_sid=fe94123c-66b4-426f-a7a5-0617ee7e0ac294d90d; __stripe_mid=2e771828-96eb-4cf1-9193-3c0802ff4472e9bde0; _session_id=QjVxYnNPbHBaQU14TDVyMkJtMEV4MDFVMjVycEdVL3EzUEsyYk9aaS85WUYwZlBsVkVFdTZrb2NySHhKdml3UVVMamhnNXgxd1pwdDVwUCtmenYvbksrN1NtS0JVKzFBT3orZ2dIdWFmQ2t2SEVoU2hJbDNGSXJDNkE1Y0FIVGVNMzRZVXBYaWl3THFOajVidFJheGF0ejlXKytTSVM0ZzZXa1h1dGI5d04ycjEyVUYwV0FmWGNpVFNCRkFTcm53c2ZoWXc0d0U0MmNteDQ4TUhsKzVNbENkOXI1UldWZjROdjl4dGF0dXlaUT0tLTUxVlpacDRuSjVJNTN2OERIQlZOalE9PQ%3D%3D--eb63b5f46906cc2b686d3a778f245ad84cd1c537; kvcd=1608542890351`,
    withAgent: true,
    blockedRoutes: [
      '', 
      '/', 
      '/users/edit', 
      '/billings', 
      '/users/sign_out',
      '/list_all_blogs',
      '/show_post_schedulers',
      '/api_info',
      '/affiliates',
    ],
    redirectDomain: "af." + baseDomain,
    redirectPath: "/new_article",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("AF", "UserID: ", userID);
        body = body.replace(/https:\/\/af.articleforge.com/g, getDomain('af'));
        body = body.replace(/Switch to Bulk Article Generator/gm, `${generateYandexMetrica(userID)} ${generateTrackingScript(userID)}`);

        return body;
      }
    ]
  },

  af2: {
    productID: [15, 21, 39, 42, 43],
    address: 'http://103.228.114.178',
    host: 'af2.bundledseo.com', 
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `_ga=GA1.2.1889560159.1601745743; _fbp=fb.1.1601745759262.415748229; km_lv=x; _gid=GA1.2.1850492523.1608536249; km_vs=1; remember_user_token=W1s5ODk4NF0sIiQyYSQxMCRDQzlwODc0VlFiWDdvM1BkS2FwZEkuIl0%3D--c91d39e63d2369edf52706b1ae9267329f5e4d6b; km_ai=98984; km_ni=98984; _gat=1; __stripe_sid=fe94123c-66b4-426f-a7a5-0617ee7e0ac294d90d; __stripe_mid=2e771828-96eb-4cf1-9193-3c0802ff4472e9bde0; _session_id=QjVxYnNPbHBaQU14TDVyMkJtMEV4MDFVMjVycEdVL3EzUEsyYk9aaS85WUYwZlBsVkVFdTZrb2NySHhKdml3UVVMamhnNXgxd1pwdDVwUCtmenYvbksrN1NtS0JVKzFBT3orZ2dIdWFmQ2t2SEVoU2hJbDNGSXJDNkE1Y0FIVGVNMzRZVXBYaWl3THFOajVidFJheGF0ejlXKytTSVM0ZzZXa1h1dGI5d04ycjEyVUYwV0FmWGNpVFNCRkFTcm53c2ZoWXc0d0U0MmNteDQ4TUhsKzVNbENkOXI1UldWZjROdjl4dGF0dXlaUT0tLTUxVlpacDRuSjVJNTN2OERIQlZOalE9PQ%3D%3D--eb63b5f46906cc2b686d3a778f245ad84cd1c537; kvcd=1608542890351`,
    withAgent: false,
    blockedRoutes: [
      '', 
      '/', 
      '/users/edit', 
      '/billings', 
      '/users/sign_out',
      '/list_all_blogs',
      '/show_post_schedulers',
      '/api_info',
      '/affiliates',
    ],
    redirectDomain: "af2." + baseDomain,
    redirectPath: "/new_article",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: false,
    responseModifiers: [
      function(body, userID) {
        body = body.replace(/https:\/\/af.articleforge.com/g, getDomain('af'));
        body = body.replace(/Switch to Bulk Article Generator/gm, '');
        return body;
      }
    ]
  },

  ab: {
    productID: [15, 21, 39, 44, 45],
    address: 'https://articlebuilder.net',
    host: 'articlebuilder.net',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `_ga=GA1.2.626086408.1607687024; prosp_promo_id=28; _gid=GA1.2.185817633.1608454612; customerly_jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImp0aSI6IjUxMDMzNmVhLTQyYTEtMTFlYi05ZTg3LTAyNDIwYTAwMDAwNCJ9.eyJpc3MiOiJodHRwczpcL1wvY3VzdG9tZXJseS5pbyIsImp0aSI6IjUxMDMzNmVhLTQyYTEtMTFlYi05ZTg3LTAyNDIwYTAwMDAwNCIsImlhdCI6MTYwODQ1NDYxOCwibmJmIjoxNjA4NDU0NjE4LCJleHAiOjI1ODYwNzA2MTgsInR5cGUiOjEsImFwcCI6IjQ4MzIzNTBmIiwiaWQiOm51bGx9.q_96j_oolS_8LM31T7QvPsKGTFahbGssYfQsay8TrFs; ab=5fe072cc40d52; _gat_gtag_UA_1133311_82=1`,
    withAgent: true,
    blockedRoutes: [],
    redirectDomain: "ab." + baseDomain,
    redirectPath: "/?action=build",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        body = body.replace(/https:\/\/articlebuilder.net/g, getDomain('ab'));
        return body;
      }
    ]
  },

  sb: {
    productID: [15, 21, 39, 46, 47],
    address: 'https://www.storyblocks.com',
    host: 'www.storyblocks.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `VID=eec80277b71b39fb2092ffb56761bfa47bf8297bb31b527448b459c045b30f65; cookie_visitor_data=s%3A109%3A%22aeyJ2aXNpdG9yX2lkIjoiZWVjODAyNzdiNzFiMzlmYjIwOTJmZmI1Njc2MWJmYTQ3YmY4Mjk3YmIzMWI1Mjc0NDhiNDU5YzA0NWIzMGY2NSJ9%22%3B; cookie_campaign_data=a%3A4%3A%7Bs%3A24%3A%22first_paid_campaign_name%22%3BN%3Bs%3A23%3A%22last_paid_campaign_name%22%3BN%3Bs%3A18%3A%22firstClickTracking%22%3Ba%3A4%3A%7Bs%3A8%3A%22campaign%22%3Bs%3A9%3A%22%28organic%29%22%3Bs%3A6%3A%22source%22%3Bs%3A6%3A%22google%22%3Bs%3A6%3A%22medium%22%3Bs%3A7%3A%22organic%22%3Bs%3A11%3A%22productHook%22%3Bs%3A2%3A%22NA%22%3B%7Ds%3A17%3A%22lastClickTracking%22%3Ba%3A4%3A%7Bs%3A8%3A%22campaign%22%3Bs%3A9%3A%22%28organic%29%22%3Bs%3A6%3A%22source%22%3Bs%3A6%3A%22google%22%3Bs%3A6%3A%22medium%22%3Bs%3A7%3A%22organic%22%3Bs%3A11%3A%22productHook%22%3Bs%3A2%3A%22NA%22%3B%7D%7D; _gcl_au=1.1.1851913211.1608545986; _ga=GA1.2.1853657626.1608545987; _fbp=fb.1.1608545987223.1260378937; _hjid=bb4ceefa-441b-41b7-9e00-9f4ac12aa5d3; hubspotutk=6a590149e911fce8f9df9669b4f3e84b; intercom-id-dyqojzg0=7bae7336-3662-4135-8d8a-8a2c9385c128; auth_verify=eyJpdiI6Imc0K1dcL0FqRFN5WGd6ZUdrd0kxMGJ3PT0iLCJ2YWx1ZSI6IlYwQW9GQ3JPUkRWMVNLc2tVeXQrdEpQS1BINW10dUZNb2NjZnY5d0JcL214NzhhT0dZbHhlSWU1U2N5WHlldlNjN1IwUCtJQlY3VkZ1cEZRY2NyV3FpbkYwbFBqZjF6WDBjOVVSNVhvUktUVG9pMVBhQ2pNc0NNR1g3VDJ0QmR6YSIsIm1hYyI6Ijc2ZWQzZDc1ZjFkNTc4ZGE5ZmRmYjA0Y2RlMmZiMmQwNmJlNGEyODg1NzRmYWQyNTU4ZmM0NmY3MzgxNTAyMzEifQ%3D%3D; login_session=eyJpdiI6InU3cG1rS2ZXQWpKajY0S3VHK0dlRlE9PSIsInZhbHVlIjoiV1NtWm5JNXlSbEU1VkZcLzlBd2F5eGRDMys1dDFqTVo2M1pyNTJYRDlwZjQ0NGkzRE9EbjJMTkx1NTFIRVRxZlF6bmRSKzJ2N1F4b0g1eUMwSTJcL3c2dGJKXC9lYldDRGdwOHN0ZFlPbXBNdGtlU0M2TDdyTnpuc1dnUjRTOW1TSkJrV1ZyUnFvRU05UTk1T3NxM2c5QWlHbzFLc2dVUEFETk40NTQxaVwvT3BOSW5aOW9RZVBFcFkxQ2FvRnFRc1NiQjVaTzUxZkxoY2pJdENHNFFWZGs2OERsTVBiclJwcGZxU0t1ZHoxampUb21oUkk5cU1oVlBadnlBU2dXK1IxQzkiLCJtYWMiOiI3NDAzNWZlOTVmNDc5YjcyNzgxZTQyNzJjYWNjNjVhNjdiM2UwZmNiMGVkMmQwNTA3YmY2MjNmM2NkOTZmYTdjIn0%3D; _BEAMER_USER_ID_sjdkcHFR13708=d3a39fbf-e941-4b02-8bfa-cf34988bd5a1; _BEAMER_FIRST_VISIT_sjdkcHFR13708=2020-12-21T10:20:37.732Z; sct=1; SID=1; session30=fb9b379a-5ca7-4b86-9a39-9671db97c2ca; _gid=GA1.2.241246171.1609685898; _gat_UA-223413-36=1; _gat_UA-223413-41=1; _hjIncludedInSessionSample=0; _hjTLDTest=1; _hjAbsoluteSessionInProgress=1; _BEAMER_FILTER_BY_URL_sjdkcHFR13708=true; __hstc=179106683.6a590149e911fce8f9df9669b4f3e84b.1608545987599.1608565758019.1609685899528.3; __hssrc=1; _uetsid=1d2cdf704dd411eb84fdc1a842486ffe; _uetvid=0d37cbe0437611ebbd30d3951c39effc; __hssc=179106683.4.1609685899528; workflow_cookie=eyJpdiI6IkVkMGJyT2luaktTNE5GcG5PRDhRSEE9PSIsInZhbHVlIjoiUWZkbWQzQ1ZGV3V0RHRkZWtuUlZoWlJxZGlUY0xnbE5cL3p1N0JhS0FPN005NnkyS0xHYmEzY0p3U1wvbjVpdG1pN3FiZlN2Tnk1M3pSZHdSYms4b3pVZVJXZkRpTjJNeDBsRGlDdlpWN2JCbHJzenJrU1M1MGZPd0lOM296ZFlTNiIsIm1hYyI6IjBjMjJhOTExYjFjNmMxZWRhOWZhNzExMjdiMTAyMTA1NGVhNDZhZmNiYzM0MWVkZTcwNzg5NDIyNjc1NWRiY2UifQ%3D%3D; laravel_session=eyJpdiI6ImdaVnhISHR1Q2loMkpiWjdGNjNmOVE9PSIsInZhbHVlIjoiejdWQWN5K1lTRXVCQ0VmY3Z4ZVNoN0VVUVI0b2pIK3VCeXRVN3daeUhna0VYajdxXC82eHlMdFIwamRsXC9LQit4aFFuSlhTZTZHam14VmVIVXBPUzBBbDNUaEl5NDRoVitmRXg3QU1jTlVacDN4eDZuTDZHdGdkS09KTFRmUG9hRCIsIm1hYyI6IjY1YmY4NDhhNjc4YTEzOTc2ODk4YTdlYTcyYmE2MDU2MjRjMWI2NWQ2NzI0MzE5NzA3NjY0ZTZhOTNhYWM5YTkifQ%3D%3D; intercom-session-dyqojzg0=Qm5nQVk4b0Vmby9lOXBSV01PWjVpcGhKK3hkWFVyKy96b2dYY0tsMjZhWFZmN1phRHFGWE1UK0dRaVRYRzVhVy0taU1yTDJ5UUJ6LzdUUlQ3QTdMczdVZz09--70cea9f5068eb3662a939f8d096524f54970b2c5`,
    withAgent: true,
    blockedRoutes: [
      '',
      '/',
      '/member/profile',
      '/member/billing',
      '/member/download-history',
      '/member/support',
      '/member/logout',
    ],
    redirectDomain: "sb." + baseDomain,
    redirectPath: "/video",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("StoryBlock", "UserID: ", userID);
        body = body.replace(/https:\/\/www.storyblocks.com/g, getDomain('sb'));
        return body;
      }
    ]
  },

  serp: {
    productID: [19, 15, 21, 35, 37, 39, 41],
    address: 'https://serpstat.com',
    host: 'serpstat.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `lang=en; _gcl_au=1.1.2096480523.1609930315; AMP_TOKEN=%24NOT_FOUND; _gid=GA1.2.2131241896.1609930316; __stripe_mid=ffab8415-3e92-4421-a847-7094e8e11b1fb3f4bc; __stripe_sid=73069679-4ebe-4d36-abeb-5085cf50c0156a7eaf; cookie_is_confirmed=a94fd1b9359bac88936adfa3b7b9d11b; guuid=1387826444.1609930315; _fbp=fb.1.1609930473593.576016592; _dc_gtm_UA-11773021-10=1; _gat_UA-11773021-10=1; PHPSESSID=2deiot29e9qc8pjeue0a5l2m2p; intercom-id-chw8dgvw=50f37b38-b1fa-4c80-bd52-b60d3b628ca4; intercom-session-chw8dgvw=N1lpUEt5OWtiKzBDRVhWYTYzK2hEQi9FRlFDZDVvS2FLdHNna0grVklnY1BEMGpHQXNyRkxFcHhsbEl0WHkzay0tbm5McGhVdXFjQTlTQWpSTHFsQURnQT09--ccc6384ef5ddf4471b9b623f2ff29ba123545600; _ga_E2HH4M9M7F=GS1.1.1609930314.1.1.1609931281.23; _ga=GA1.1.1387826444.1609930315`,
    withAgent: true,
    blockedRoutes: [
      "",
      "/",
    ],
    redirectDomain: "serp." + baseDomain,
    redirectPath: "/domains",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: false,
    responseModifiers: [
      function(body, userID) {
        console.log("SerpStat", "UserID: ", userID);
        body = body.replace(/https:\/\/serpstat.com/g, getDomain('serp'));
        body = body.replace(/<\/body>/, `
          <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js" type="text/javascript"></script>
          <script type="text/javascript">
            window.setInterval(function(){
              $('span.dialog_close_icon.dialog_close').click();
              $('span.aside_link.submenu_trigger.intercom-item').remove();
            }, 1); 

            $(".pre_header_info").remove();
            $(".react_responsive_menu_handler").remove();
            $(".super_nav_handler").remove();
            $(".header_dropdowns").remove();
            $(".intercom-button.df.jcc.aic").remove();
            $(".header_nav").remove();
            $(".search_product_right").remove();
            $(".banners_widget").remove();
            $(".header_logo").html('<a href="https://ss.bundledseo.com"> <img src="/img/logo.svg" alt="" title=""></a>');
            $("footer").remove();
            $('a[href$="/projects/dashboard/"]').remove();
            $('a[href$="/checklist/index/"]').remove();
            $('a[href$="/backlink/competitors/"]').remove();
            $('a[href$="/projects/"]').remove();
            $("span:contains('Site Audit')").remove();
            $("span:contains('Rank Tracker')").remove();
            $("span:contains('Hide menu')").parent().remove();
            $('body').mouseover(function() {
              $(".pre_header_info").remove();
              $("span.aside_link.submenu_trigger.intercom-item").remove();
              $("li.side-bar-help__trigger").remove();
              $(".super_nav_handler").remove();
              $(".intercom-button.df.jcc.aic").remove();
              $(".header_dropdowns").remove();
              $(".header_nav").remove();
              $(".react_responsive_menu_handler").remove();
              $(".search_product_right").remove(); 
              $(".banners_widget").remove();
              $(".header_logo").html('<a href="https://ss.bundledseo.com"> <img src="/img/logo.svg" alt="" title=""></a>');
              $("footer").remove();
              $('a[href$="/projects/dashboard/"]').remove();
              $('a[href$="/checklist/index/"]').remove();
              $('a[href$="/backlink/competitors/"]').remove();
              $('a[href$="/projects/"]').remove();
              $("span:contains('Site Audit')").remove();
              $("span:contains('Rank Tracker')").remove();
              $("span:contains('Hide menu')").parent().remove();
              console.clear();
            });
          </script>
          ${generateTrackingScript(userID)}
          ${generateYandexMetrica(userID)}
          </body>
        `);
        return body;
      }
    ]
  },

  scoop: {
    productID: [18, 15, 21, 34, 39],
    address: 'https://semscoop.com',
    host: 'semscoop.com',
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
    cookie: `_ga=GA1.2.1371067941.1608536484; _gid=GA1.2.791413944.1608536484; _fbp=fb.1.1608536484400.1634514291; _hjid=c11ae2de-3ccb-4f53-bd11-22da3085a812; _gat=1; _gat_gtag_UA_117179353_1=1; _hjIncludedInPageviewSample=1; _hjAbsoluteSessionInProgress=1; XSRF-TOKEN=eyJpdiI6IkpYeEtock1WUjlJWVp6WVJVUjhpMkE9PSIsInZhbHVlIjoieGJNUW8waEwwbnZnUjBiMXBlOW4zZnJTK3pueDdXcGpmSW9CNGFFMEtBQjBFajZoeDN2dFVIc09FcmlWWkw0OHBqSFA4bVJZNXFaSTVcL3c2amZmUmFBPT0iLCJtYWMiOiIwOWUyZWY5MjNlZjUxMTBhODc2MWEyY2EyODY4ZWMxNTA2NWY4ODBiY2Y2ZjU1NGUyZDU5NDVlMGM4NzIzYjY3In0%3D; laravel_session=eyJpdiI6IkZoVW9tdXFtQ3ZHTjlES0ZEdG9sTVE9PSIsInZhbHVlIjoiVURTeUhBMkh5SStPT1wvS0ZLRkhwXC82OFR5Z3dJN2tCNCtWK3JJNnBCdTZ5V2NpVW02SUp1UkJiXC9Vc29KTjFpa1NtUFI0Y2FrZHdOU1k1a2w5K01iK1E9PSIsIm1hYyI6IjliNWRmOGYzNjEyZDVhZTA0OWQ3MGYzNTFlMzgxODE1NTRjYjQzZTA2ZjllZDlmNDE2OTNkMTZmMGI3MWQ3OGEifQ%3D%3D; crisp-client%2Fsession%2F5fe35543-0a16-48cd-91a1-86b21f47fe99=session_ff78dd84-5f0c-4a0e-82bd-76c6a1505af8`,
    withAgent: true,
    blockedRoutes: [
      "",
      "/",
      "/profile",
      "/logout",
    ],
    redirectDomain: "scoop." + baseDomain,
    redirectPath: "/keyword-tool",
    requestHeaderModifiers: [],
    responseHeaderModifiers: [],
    transformResponse: true,
    responseModifiers: [
      function(body, userID) {
        console.log("SemSCOOP", "UserID: ", userID);
        body = body.replace(/Â© Copyright 2019. All Rights Reserved./g, `
        <script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js"></script>
        <script>
          $("#mainNav").remove();
          $("#userbox").remove();
          $("span:contains('Manage Projects')").parent().remove();
          $("span:contains('Recent Searches')").parent().remove();
          $("#footer").remove();
          $(".header-logo").html('<img alt="semscoop-logo" width="180" height="60" src="/vendor/theme/img/SEMScoop-logo-2.png">');
          $('a[href$="/#Pricing"]').remove();
          $("div:contains('Everything in one place to start your next ')").remove();
          $(".word-rotator-title").parent().remove();

          $('body').mouseover(function() {
            $("#mainNav").remove();
            $("#userbox").remove();
            $("span:contains('Manage Projects')").parent().remove();
            $("span:contains('Recent Searches')").parent().remove();
            $("#footer").remove();
            $('a[href$="/#Pricing"]').remove();
            $(".word-rotator-title").parent().remove();
            $("div:contains('Everything in one place to start your next ')").remove();
            $(".header-logo").html('<img alt="semscoop-logo" width="180" height="60" src="/vendor/theme/img/SEMScoop-logo-2.png">');
          });

          window.setInterval(function(){
            $("#mainNav").remove();
            $("#userbox").remove();
            $("span:contains('Manage Projects')").parent().remove();
            $("span:contains('Recent Searches')").parent().remove();
            $("#footer").remove();
            $('a[href$="/#Pricing"]').remove();
            $(".word-rotator-title").parent().remove();
            $("div:contains('Everything in one place to start your next ')").remove();
            $(".header-logo").html('<img alt="semscoop-logo" width="180" height="60" src="/vendor/theme/img/SEMScoop-logo-2.png">');
            console.clear();
          }, 1);
        </script>
        ${generateTrackingScript(userID)}
        ${generateYandexMetrica(userID)}
        `);
        return body;
      }
    ]
  },
};

function modifyProxyRequest(requestModifiers) {
  return function onProxyReq(proxyReq, req, res) {
    delete req.headers['access-control-allow-origin'];
    delete req.headers['access-control-allow-credentials'];
    delete req.headers['access-control-allow-headers'];
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
  host: isProduction ? '127.0.0.1' : '9',
  port: '',
  password: ''
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const db = mysql.createConnection({
  host    : isProduction ? '127.0.0.1' : '
  user    : '',
  password: '#123',
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

const app = express();

app.set('view engine', 'ejs');
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

app.get("/authenticationsetter", async (req, res) => {
  const auth = await getAsync("loginData");
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
    const auth = await getAsync("loginData");
    const parsed = JSON.parse(auth);

    parsed[tool] = { 
      name: parsed[tool]["name"], 
      proxy, 
      cookie 
    };

    const forSave = JSON.stringify(parsed);
    await setAsync("loginData", forSave);

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

  if(isProduction) {
    if(!toolData) {
      res.send("Access forbidden.");
      return;
    }

    if(!req.cookies["PHPSESSID"]) {
      res.send("Access forbidden.");
      return;
    }

    userID = await getUserID(db, req.cookies["PHPSESSID"]);

    if(!userID) {
      res.send("Access forbidden.");
      return;
    }

    const hasAccess = await checkForAccess(db, userID, toolData.productID);

    if(!hasAccess) {
      res.send("Access forbidden.");
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
    const accessAllData = JSON.parse(await getAsync("loginData"));
    if ( accessAllData == null)
    {
      const content = fileRead((isProduction ? (__dirname + '/logins.txt') : (__dirname + '/test-logins.txt'))).toString();
      await setAsync("loginData", content);
      console.log("Storage populated  again ...");
      accessAllData = JSON.parse(await getAsync("loginData"));
    }

    accessTool = accessAllData[toolID];

    if(!accessTool) {
      accessTool = accessAllData[findFromAliases(toolID)];
    }

    if(!accessTool) {
      res.send("Access forbidden. You need to purchase first.");
      return;
    }

    if ( toolID == "ahx")
    {
      console.log ( " ahref --->>>>>>>>>  " + JSON.stringify( await accessTool ) );
    }

    agent = toolData.withAgent ? proxyingAgent.create(accessTool.proxy, toolData.address) : null;
  } else {
    agent = toolData.withAgent ? proxyingAgent.create(proxyURL, toolData.address) : null;
  }

  createProxyMiddleware({ 
    target: toolData.address,
    ws: true, 
    agent,
    toProxy: true,
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
      await setAsync("loginData", content);
      console.log("Storage populated...");

      await connectToDB()
      console.log("Connected to MySQL...");

      app.listen(3000, (err) => {
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
    app.listen(3000, (err) => {
      if(err) {
        console.log(err);
        return;
      }

      console.log("Server running on: http://127.0.0.1:5555");
    });
  }
});
