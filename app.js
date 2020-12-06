//  Set up express server
const express = require('express')
const app = express()
const port = 3000

app.listen(port, () => {
    console.log(`Node Redis DB Example is running at http://localhost:${port} for your viewing pleasure.`)
});

//  Body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


//  Setup redis
const redis = require("redis");
const client = redis.createClient();

client.on("error", function (error) {
    console.error(error);
});


// ///// Endpoints ///////

app.get('/user', (req, res) => {
    client.get('user:' + req.body.id, function (err, user) {
        if (err) {
            console.error(err);
        }

        if (user) {
            return res.send({ user: JSON.parse(user) });
        } else {
            return res.send({ user: null });
        }
    });
});


app.post('/user', (req, res, next) => {

    let lastUpdated = Date.now();
    let created = Date.now();
    let newUser = {
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
        "email": req.body.email,
        "created": created,
        "lastUpdated": lastUpdated
    };
    client.set("user:" + req.body.id, JSON.stringify(newUser), function (err, reply) {
        if (err) {
            return console.error(err);
        }
        res.send({ sucess: true });
    });
})

//////////////////////