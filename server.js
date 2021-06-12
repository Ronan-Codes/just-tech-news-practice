const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};
app.use(session(sess));

// Handlebars.js
// Tell handlebars.js about the helpers file
const helpers = require('./utils/helpers');
// continue
const exphbs = require('express-handlebars');
// pass helpers to existing exphbs.create
const hbs = exphbs.create({
  helpers
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')

// Use path to utilize public files (style.css). `app.use(express.static(path.join(__dirname, 'public')));`
const path = require('path');

// app.use statements
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

// turn on routes
app.use(routes);

debugger
// for public files (style.css)
app.use(express.static(path.join(__dirname, 'public')));
// app.use statements END

// turn on connection to db and server
sequelize.sync({
  force: false
}).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
// The "sync" part means that this is Sequelize taking the models and connecting them to associated database tables.
// If it doesn't find a table, it'll create it for you!
// The other thing to notice is the use of {force: false} in the .sync() method. This doesn't have to be included,
// but if it were set to true, it would drop and re-create all of the database tables on startup.
