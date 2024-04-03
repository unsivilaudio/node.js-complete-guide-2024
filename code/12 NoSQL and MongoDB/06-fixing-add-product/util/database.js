const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    /** REPLACE CONNECTION STRING IF USING ATLAS
     *  "mongodb+srv://<username>:<password>@<cluster-id>.mongodb.net/<dbName>?retryWrites=true&authSource=admin"
     */
    MongoClient.connect(
        'mongodb://127.0.0.1:27017/shop?retryWrites=true&authSource=admin'
    )
        .then((client) => {
            console.log('Connected!');
            _db = client.db();
            callback();
        })
        .catch((err) => {
            console.log(err);
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
