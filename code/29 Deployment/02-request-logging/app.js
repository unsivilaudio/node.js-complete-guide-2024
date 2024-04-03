const path = require('path');
const fs = require('fs');

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
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.dkklz9u.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&authSource=admin`;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions',
});
/** CSRF-CSRF PACKAGE */
const csrfProtection = csrf({
    getSecret: () => 'supersecret',
    getTokenFromRequest: (req) => {
        if (req.body._csrf) {
            return req.body._csrf;
        }
        if (req.get('csrf-token') !== '') {
            return req.get('csrf-token');
        }
    },
});
/** ====================== */

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        /** DO NOT USE new Date().toISOString() on Windows */
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

/** CUSTOM HELMET CONFIGURATION */
app.use(
    helmet.contentSecurityPolicy({
        useDefaults: true,
        directives: {
            imageSrc: null, // ALLOW IMAGES FROM ANYWHERE
            scriptSrc: ["'self'", "'unsafe-inline'"], // ALLOW CLIENT-SIDE-JS
            scriptSrcAttr: ["'self'", "'unsafe-inline'"], // ALLOW CLIENT-SIDE-JS
        },
    })
);
/** =========================== */
app.use(compression());
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
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
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    // throw new Error('Sync Dummy');
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
            next(new Error(err));
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
    // res.status(error.httpStatusCode).render(....)
    // res.redirect('/500');
    res.status(500).render('500', {
        pageTitle: 'Error!',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn,
    });
});

mongoose
    .connect(MONGODB_URI)
    .then((result) => {
        app.listen(process.env.PORT || 3000);
    })
    .catch((err) => {
        console.log(err);
    });
