/**
 * A very simple SmartApp example leveraging the SDK
 * to launch a SmartApp on the Express web framework.
 *
 * All SmartThings callback authorization mechanisms
 * are implicitly supported through SDK usage.
 */
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const SmartApp = require('@smartthings/smartapp');
const server = express();
const PORT = 8080;

const authRouter = require('./auth');
const controlRouter = require('./control');

server.use(cors());
server.use(express.json());
server.use(session({
    secret: 'keyboard cat', 
    resave: false,
    saveUninitialized: true,
}));
server.use(express.static('public'));

const smartapp = new SmartApp()
// If you do not have it yet, omit publicKey() - i.e. PING lifecycle
// Usage of '@' symbol informs SDK to fetch from local disk using `fs` package.
//  .publicKey('@smartthings_rsa.pub')
    .enableEventLogging(2)
    .page('mainPage', (context, page, configData) => {
        page
            .name('SmartApp Authorization Example')
            .complete(true)
            .section('my-section', section => {
                section
                    .paragraphSetting('my-paragraph')
                    .text('SmartApp Authorization Example')
                    .description('An example of how to authorize incoming SmartThings requests to your SmartApp.')

            })
    });

server.use('/oauth', authRouter);
server.use('/control', controlRouter);

server.get('/', (req, res, next) => {
   console.log('In');
   res.json({ message: 'Hello, welcome to the website!' });
})

server.post('/', (req, res, next) => {
   console.log(req.header('Authorization'));
   smartapp.handleHttpCallback(req, res)
});

server.get('/start', (req, res) => {
    console.log('start');
    res.sendFile(path.join(__dirname+'/start.html'));
})

server.get('/home', (req, res) => {
    console.log('home');
    res.sendFile(path.join(__dirname+'/index.html'));
})

server.listen(PORT, () => console.log(`Server is up and running on port ${PORT}`));