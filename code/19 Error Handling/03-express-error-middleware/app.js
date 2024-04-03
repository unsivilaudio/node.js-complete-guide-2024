const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
/** CSRF-CSRF PACKAGE */
const { doubleCsrf: csrf } = require('csrf-csrf');
const cookieParser = require('cookie-parser');
/** ================ */
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

/** REPLACE CONNECTION STRING IF USING ATLAS
 *  "mongodb+srv://<username>:<password>@<cluster-id>.mongodb.net/<dbName>?retryWrites=true&authSource=admin"
 */
const MONGODB_URI =
    'mongodb://127.0.0.1:27017/shop?retryWrites=true&authSource=admin';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});
const csrfProtection = csrf({
    getSecret: () => 'supersecret',
    getTokenFromRequest: (req) => req.body._csrf,
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store,
    })
);
/** CSRF-CSRF PACKAGE */
app.use(cookieParser('supersecret'));
app.use(csrfProtection.doubleCsrfProtection);
/** ================ */
app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then((user) => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch((err) => {
            throw new Error(err);
        });
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(....)
    res.redirect('/500');
});

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
