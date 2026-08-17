const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(mongoUrl);
    console.log("connected to DB");

    await initDB();
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner:"6a806397947a70bbaaf7c5f6"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

main()
    .catch((err) => {
        console.log(err);
    });