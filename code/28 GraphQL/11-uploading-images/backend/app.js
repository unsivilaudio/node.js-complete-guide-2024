const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
/** UPDATED CONFIG
 *  express-graphql => graphql-http
 *  and express-graphiql-explorer (graphiql)
 */
const grapqlHttp = require('graphql-http/lib/use/express');
const graphiql = require('express-graphiql-explorer');
/** ================================== */
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const auth = require('./middleware/auth');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        /** DON'T USE .toISOString() on windows */
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

// app.use(bodyParser.urlEncoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json
app.use(
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(auth);

app.put('/post-image', (req, res, next) => {
    if (!req.isAuth) {
        throw new Error('Not authenticated!');
    }
    if (!req.file) {
        return res.status(200).json({ message: 'No file provided!' });
    }
    if (req.body.oldPath) {
        clearImage(req.body.oldPath);
    }
    return res.status(201).json({
        message: 'File stored.',
        /** REPLACE ALL '\' with '/' */
        filePath: req.file.path.replace(/\\/g, '/'),
    });
});

/** EXPRESS-GRAPHIQL-EXPLORER PACKAGE */
/** note: /graphiql endpoint */
app.use(
    '/graphiql',
    graphiql({
        graphQlEndpoint: '/graphql',
        defaultQuery: `query MyQuery {}`,
    })
);
/** ================================= */

/** GRAPHQL-HTTP CONFIGURATION */
app.all('/graphql', (req, res) =>
    grapqlHttp.createHandler({
        schema: graphqlSchema,
        rootValue: graphqlResolver,
        context: { req, res },
        formatError(err) {
            if (!err.originalError) {
                return err;
            }
            const data = err.originalError.data;
            const message = err.message || 'An error occurred.';
            const code = err.originalError.code || 500;
            return {
                message: message,
                status: code,
                data: data,
            };
        },
    })(req, res)
);
/** ========================== */

app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});

/** REPLACE CONNECTION STRING IF USING ATLAS
 *  "mongodb+srv://<username>:<password>@<cluster-id>.mongodb.net/<dbName>?retryWrites=true&authSource=admin"
 */
mongoose
    .connect(
        'mongodb://127.0.0.1:27017/messages?retryWrites=true&authSource=admin'
    )
    .then(() => {
        app.listen(8080);
    })
    .catch((err) => console.log(err));

function clearImage(filePath) {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, (err) => console.log(err));
}
