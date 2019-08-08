/* Required Models and Controllers */
const UserModel = require("./models/user");
const middleware = require("./controllers/middleware")
const db = require("./controllers/database")

/* Initialize connection to Mongo */
db.connect();

/* Check if we have users or seed the db */

const main = async () => {
    const users = await UserModel.countDocuments()
    //await db.dropCollection("users");
    if (users > 0) {
        console.log("Database contains data, ready to go!");
    }
    else { db.seed() }

    middleware.run()
}


main();