const express = require("express");
const mongoose = require('mongoose');
const Web3 = require('web3');
const fs = require('fs');

const app = express();

app.use(express.static('public'))
require('dotenv').config();  // loading environment variables
const port = process.env.PORT;

// MongoDB connection
let mongodbURL = process.env.MONGODB_SERVER == "local" ? "mongodb://localhost:27017/landRegistry" : process.env.MONGODB_URL;
mongoose.connect(mongodbURL, {

});
mongoose.connection.on('connected', () => {
    console.log('Mongoose connection open to ' + mongodbURL);
}).on('error', (err) => {
    console.log('Mongoose connection error: ' + err);
}).on('disconnected', () => {
    console.log('Mongoose connection lost!');
});

// MongoDB Schemas
const User = require("./models/user");

// web3 config
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ETH_NODE_PROVIDER));

const compiled_contract = require("../truffle/build/contracts/landRecords.json");
const contract_address = compiled_contract.networks[5777].address;
const contract_abi = compiled_contract.abi;
const file_data = JSON.stringify({contract_abi: contract_abi, contract_address: contract_address})
fs.writeFileSync("./public/contract/contract_data.json", file_data, (err) => {
    console.log(err);
});

const contract = new web3.eth.Contract(contract_abi, contract_address);


/* 
** Web Pages
**/
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.get('/super-admin', (req, res) => {
    res.sendFile(__dirname + "/views/super_admin_page.html");
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + "/views/admin_page.html");
});

app.get('/user', (req, res) => {
    res.sendFile(__dirname + "/views/user_page.html");
});

// temp route
app.get('/test', (req, res) => {
    res.sendFile(__dirname + "/views/test_page.html");
});

/* 
** Events handling
**/

contract.events.RegUser({
    fromBlock: 'latest'
})  .on("connected", (subscriptionId) => {
        console.log("RegUser event subscriptionId: " + subscriptionId);
    })
    .on('data', (event) => {
        const _data = event.returnValues;
        console.log(_data);

        const _address = _data._address;
        const _district = _data._district;

        const _blockNumber = event.blockNumber;

        User.findOneAndUpdate({address: _address}, {district: _district, blockNumber: _blockNumber}, {upsert: true}, (err, user) => {
            if(err) {
                console.log(err);
            } else {
                console.log(user);
            }
        })
    })
    // .on('changed', (event) => {
    //     // remove event from local database
    // })
    // .on('error', (error, receipt) => { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
    //     // ...
    // });

/* 
** Web APIs
**/

app.get('/api/users/:district', (req, res) => {
    User.find({}, (err, users) => {
        if(err) {
            console.log(err);
            req.status(500).send("Something went wrong");
        } else {
            req.json(users);
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})