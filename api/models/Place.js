const mongoose = require('mongoose'); 

const PlaceSchema = new mongoose.Schema ({
    owner: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photo: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number,
    approved: Boolean,
});

const PlaceModel = mongoose.model('Place', PlaceSchema);

module.exports =PlaceModel;