# CHAT BACKEND API

## Technology
`node.js`, `mysql`

## installation
1. Close this repository
2. Run `npm install`
3. Rename `.env.example` to `.env` and configure based on your settings
4. Create database entries:
```
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `messagedBy` varchar(255) DEFAULT NULL,
  `messagedTo` varchar(255) DEFAULT NULL,
  `message` varchar(5000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```
```
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```
```
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `_ID` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `_ID_UNIQUE` (`_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
```
5. Run node server.js

## Testing
Testing can be done using ejs. Ejs file is located in `/views/index.ejs`. You will see register, login, logout, send message forms. Output from from server is logged in console.

## Strategy
User authentication is obviously needed. Passport local strategy is used. Once user tries to log in, passport module performs authentication and stores corresponsing user cookie. Cookies are connected to database and can be viewed in `session` table.

## Structure
+ `action` folder stores `username.js` and `message.js` files, which are responsible for updating user `username` and sending `messages`.
+ `config` folder in this case only stores db config for mysql. This config reads parameters from `.env` file.
+ `db` folder stores `Db` class and exports its already created instance based on `db_config`. This class exports Promise.
+ `public` folder stores public data, which can be accessed like `example.com/public/path/to/file.png`
+ `request_logs` folder logs every request.
+ `routes` folder is responsible for routes. Each route has a separate folder and file.
+ `views` folder is `ejs` folder.
+ `.env` file saves environmental parameters, such as `PORT` and other `MYSQL` options.
+ `ser.js` file is my personal module, which comes in handy. It stores response parameters, user data, meta information about request and helps you respond to the client (It was originally named `Success Error Redirect`).
+ `server.js` file is the core. Everything happens from there.
+ `user_validator.js` file is called on every request, to gather some meta data about user.

## Routes

+ `/avatar` POST @params{avatar} [authenticated]
+ `/login` POST @params{username, password} [unauthenticated]
+ `/logout` POST @params{} [authenticated]
+ `/message` POST @params{id, message} [authenticated]
+ `/message` WS @params{id, message} [authenticated]
+ `/messages` GET @params{id=optional} [authenticated]
+ `/register` POST @params{username, password}
+ `/username` POST @params{username, password}
+ `/username` WS @params{username, password} [authenticated]
+ `/users` GET @params{} [authenticated/unauthenticated]

## Licence
MIT
