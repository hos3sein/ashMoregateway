// configuting the gateway for routing the requests 
// this is the main source for gateway that rout the requests to the microservices

///////////////////////////////////////////////////////////////////////////////////////

// call all dependencies 
const express = require('express')
const cookieparser = require('cookie-parser')
const retelimiter = require('./ratelimiter')  //this module is limiting the requests rate for each user 
require('dotenv').config({path : './config/config.env'}) 
const winston = require("winston"); // this packages for logging the requests
const expressWinston = require("express-winston");
const responseTime = require("response-time"); //this package for use the response time
const rateLimit = require("express-rate-limit") //this package for limiting the all requests rate that come to server
const cors = require('cors') // this package for securing the requests
const helmet = require('helmet') // this package for securing the requests
const xss = require('xss-clean') // this package for preventing XSS attacks by sanitizing user input
const hpp = require('hpp') //this package for preventing HTTP Parameter Pollution vulnerability
const routes =  require('./proxies') // all proxies define in this module
const { createLogger, format, transports } = require('winston');
// const router = require('./registerAddress/router');
const { combine, timestamp, label, prettyPrint } = format;
const mongoose = require('mongoose')
const app = express();


// all dependencies that we need
const {
  createProxyMiddleware,
  debugProxyErrorsPlugin, // subscribe to proxy errors to prevent server from crashing
  loggerPlugin, // log proxy events to a logger (ie. console)
  errorResponsePlugin, // return 5xx response on proxy error
  proxyEventsPlugin, // implements the "on:" option
  fixRequestBody
} = require('http-proxy-middleware');
// const { getData } = require('./registerAddress/caching');
// const { getAddress } = require('./registerAddress/reqToRegistration');



// required plugins for proxy middleware
const plugins = [debugProxyErrorsPlugin, loggerPlugin, errorResponsePlugin, proxyEventsPlugin]




//ejs configuration
app.set('view engine' , 'ejs')
app.set('views' , __dirname+'/views')
app.use(express.static('public'))


// running app on port
const port = process.env.PORT || 8000;


const server = app.listen(port , (err)=>{
    console.log('gateway is listening to requests...')
})


// server.requestTimeout = 10000

// securing connection 
app.disable("x-powered-by");
app.use(cors({
  origin : '*'
}));
// app.use(helmet());
app.use(xss())
app.use(hpp())




let option = {
      db : mongoose.connection.useDb('loggerDatabase'),
      options : {useUnifiedTopology : true},
      collection : 'logs',
      capped : false,
      expireAfterSeconds : 2592000,
      leaveConnectionOpen : false,
      storeHost : false,
      metaKey : 'additionalInfo'
}


// set logger
app.use(                
  expressWinston.logger({
    transports: [new winston.transports.Console() , new (winston.transports.File)({filename: 'myLogs.log' })],
    format: format.combine(
      label({ label: 'right meow!' }),
      timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
      prettyPrint()
    ),
    statusLevels: true,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms",
    expressFormat: true,
    ignoreRoute() {
      return false;
    },
  })
);



 // inside logger!!!!
 winston.configure({
  format : format.combine(
    
    label({ label: 'right meow!' }),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    prettyPrint()
  ),
  transports: [
      new (winston.transports.File)({filename: 'inside.log' }),
      // new winston.transports.Console()
    ],
})

////////////////////////////////////////////////////////////////////////////?
// * this module is for seting all rate limiting to requests!!!!! 
////////////////////////////////////////////////////////////////////////////?
// set ratelimiting for all requests 
// app.use(rateLimit({
//       windowMs: 15 * 60 * 1000, // 15 minutes
//       max: 5, // 5 calls
// }))



// making instance of proxy module 
// const rooter = new routes()



// geting Address from service registrator
// app.use('/addresses' , router)                                                

app.use('/' , (req , res , next)=>{
  res.render('index')
})

// // routing to microservices 
app.use("/auth" , createProxyMiddleware({                
              target:  process.env.SERVICE_AUTHENTICATION,
              changeOrigin: true,
              pathRewrite: {
                [`^/`]: "",
              },
              plugins : plugins
            }));       



app.use("/approve" , createProxyMiddleware({              
  target:  process.env.SERVICE_APPROVE,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));              



app.use("/favorit" ,createProxyMiddleware({              
  target:  process.env.SERVICE_FAVORITE,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));  



app.use("/commerce" , createProxyMiddleware({              
  target:  process.env.SERVICE_ECOMMERCE,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));   



app.use("/content" ,createProxyMiddleware({              
  target:  process.env.SERVICE_CONTENT,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));   



app.use("/linemaker" , createProxyMiddleware({              
  target:  process.env.SERVICE_LINEMAKER,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));     



app.use("/notif" , createProxyMiddleware({              
  target:  process.env.SERVICE_NOTIFICATION,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));    



app.use("/payment" ,createProxyMiddleware({              
  target:  process.env.SERVICE_PAYMNET,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));      



app.use("/refresh" ,createProxyMiddleware({              
  target:  process.env.SERVICE_REFRESH,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));       



app.use("/transport" ,createProxyMiddleware({              
  target:  process.env.SERVICE_TRANSPORT,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));       



app.use("/truck" , createProxyMiddleware({              
  target:  process.env.SERVICE_TRUCK,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));       



app.use("/setting" , createProxyMiddleware({              
  target:  process.env.SERVICE_SETTING,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));      



app.use("/report" , createProxyMiddleware({              
  target:  process.env.SERVICE_REPORT,
  changeOrigin: true,
  pathRewrite: {
    [`^/`]: "",
  },
  plugins : plugins
}));      