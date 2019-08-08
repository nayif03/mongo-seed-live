/* Express and Handlebars template engine - Views */
const path = require('path');
const express = require('express')
const exphbs = require('express-handlebars');
const UserModel = require("../models/user");
const User = require('./user')
/* Express routing */
exports.run = async () => {

    const app = express()

    /* 
    Use an Express Template https://expressjs.com/en/guide/using-template-engines.html 
    Handlebars View Engine https://github.com/ericf/express-handlebars 
    */

    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(__dirname, '../views'));

    app.get('/', async (req, res) => {

        if (req.query.age) {
            const users = await UserModel.find({ age: { $gte: req.query.age } }).exec({})

            const empty = users.length <= 0 ? true : false

            res.render('home',
                { /* Variables we pass to the view engine */
                    users, title: `Search by Age greater than ${req.query.age}`,
                    search: true,
                    empty,
                    age:req.query.age
                })
        } else {
            const { status, message } = req.query
            const users = await UserModel.find({}).exec({})
            res.render('home', { users, status, message, title: "Homepage" })
        }

    })

    app.get('/api/', async (req, res) => {
        const users = await UserModel.find({}).exec({})
        console.log(users);
        return res.send(users);
    })

    app.get('/user/:userId', async (req, res) => {
        const user = await UserModel.findById(req.params.userId).exec({})
        console.log(user);
        res.render('user', { user, title: "User Info" })
    })

    app.get('/users/add', async (req, res) => {
        res.render('form', { title: "Add User" })
    })

    app.post('/users/add', User.manageUser)

    app.get('/users/edit', async (req, res) => {
        const users = await UserModel.find({}).exec({})
        res.render('home', { users, title: "Update Users", update: true })
    })

    app.get('/users/edit/:userId', async (req, res) => {
        const user = await UserModel.findById(req.params.userId).exec({})
        res.render('form', { user, title: "Update User", update: true })
    })

    app.post('/users/edit/:userId', User.manageUser)

    app.get('/users/del/:userId', User.delete)

    console.log(`View user data on http://localhost:3001`);
    await app.listen(3001)
}