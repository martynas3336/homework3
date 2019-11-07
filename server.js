require('dotenv').config();

const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const favicon = require('serve-favicon');

const db = require('./db');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore({}, db.con);

const cookieParser 	= require("cookie-parser");
const morgan = require("morgan");

const passport = require("passport");
const flash = require("connect-flash");
const helmet = require('helmet');
const ser = require('./ser');

const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');

const express = require("express");
const requestIp = require('request-ip');
const PORT = process.env.PORT || 80;

const app = express();
const expressWs = require('express-ws')(app);

app.use(helmet());
app.use(requestIp.mw());
morgan.token('request-ip', function(req) {
	return req.clientIp;
})

const logDirectory = path.join(__dirname, 'request_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs('access.log', {
	interval:'1d',
	path:logDirectory
})

app.use(morgan('tiny'));
app.use(morgan(':request-ip ---- :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"', {stream:accessLogStream}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
	key:'mynamejeff',
	secret:'Oj3qRLo1CQwcad3DawLxBxF9la7RDvhh',
	store:sessionStore,
	resave:false,
	saveUninitialized:false
}))
app.use(fileUpload());

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(ser.mw());

app.use(require('./routes'));



app.listen(PORT, () => {
  console.log(`APP LISTENING PORT ${PORT}`);
})
