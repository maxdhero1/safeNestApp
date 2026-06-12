const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    property: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'property',
        required: true
    },
    tenant: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    landlord: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },

    status:{
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },

    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
})

module.exports = mongoose.model("booking", bookingSchema);
