const faker = require("faker");
const UserModel = require('../models/user')


exports.create = (amount = 5) =>
    new Array(amount).fill(0).map(() => ({
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        age: Math.floor(Math.random() * 70 + 18),
        username: faker.internet.userName(),
        short_bio: faker.lorem.text(),
        address: {
            street: faker.address.streetName(),
            street_number: Math.floor(Math.random() * 7000 + 0),
            zip: faker.address.zipCode(),
            city: faker.address.city(),
            country: faker.address.country(),
            state: faker.address.state()
        },
        phone_number: faker.phone.phoneNumber()
    }));

exports.manageUser = async (req, res) => {
    console.log(`post received ${req.body.email}`)

    const user = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        email: req.body.email,
        age: req.body.age,
        username: req.body.username,
        short_bio: req.body.shortBio,
        address: {
            street: req.body.street,
            street_number: req.body.streetNumber,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
            state: req.body.state
        },
        phone_number: req.body.phoneNumber
    }

    if (req.body._id) {
        const updateUser = await UserModel.updateOne({ _id: req.body._id }, { $set: user }, { runValidators: true })
            .then(() => {
                res.redirect(`/?status=success&message='User successfully updated!'`);
            })
            .catch(err => {
                res.redirect(`/?status=danger&message='${err}'`);
            })
    } else {
        const newUser = await new UserModel(user).save().then(() => {
            console.log('User added correctly! Check Compass!')
            res.redirect(`/?status=success&message='All went well'`)
        }).catch(err => {
            console.error(err)
            res.redirect(`/?status=alert&message=${err}`)
        })
    }

}

exports.delete = async (req, res) => {
    const delUser = await UserModel.deleteOne({ _id: req.params.userId })
        .then(() => {
            res.redirect(`/?status=success&message='User successfully deleted!'`);
        })
        .catch(err => {
            res.redirect(`/?status=danger&message='${err}'`);
        })
}