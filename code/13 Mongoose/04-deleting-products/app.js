const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//     User.findById('635a9e6a9bc7ce61c0b80a1d')
//         .then((user) => {
//             req.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         })
//         .catch((err) => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

/** REPLACE CONNECTION STRING IF USING ATLAS
 *  "mongodb+srv://<username>:<password>@<cluster-id>.mongodb.net/<dbName>?retryWrites=true&authSource=admin"
 */
mongoose
    .connect('mongodb://127.0.0.1:27017/shop?retryWrites=true&authSource=admin')
    .then((result) => {
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });
