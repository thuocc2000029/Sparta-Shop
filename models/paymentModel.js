const mongoose = require('mongoose')


const paymentSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    paymentID: {
        type: String,
        required: true
    },
    address: {
        type: Object,
        required: true
    },
    cart: {
        type: Array,
        default: []
    },
    status: {
        type: Number,
        default: 0 // 0: Processing 1: Confirmed, 2: Shipping, 3: Delivered, 4: Cancelled
    }
}, {
    timestamps: true
})


module.exports = mongoose.model("Payments", paymentSchema)