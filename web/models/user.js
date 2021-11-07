const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    address: String,
    name: String,
    district: String,
    docHash: String,
    isVerified: Boolean,
    blockNumber: Number
});

module.exports = mongoose.model("User", userSchema);