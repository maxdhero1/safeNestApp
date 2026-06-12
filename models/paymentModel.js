const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  landlord: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Payment Details
  amount: {
    type: Number,
    required: true
  },
  paymentType: {
    type: String,
    enum: ['rent', 'deposit'],
    default: 'rent'
  },

  // Paystack fields
  reference: {
    type: String,
    required: true,
    unique: true
  },
  transactionId: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending'
  },

  // Additional Info
  paymentMethod: {
    type: String,
    enum: ['card', 'bank_transfer', "ussd"],
    default: 'card'
  },

  // For future use
  metadata: {
    type: Object,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for faster queries
paymentSchema.index({ booking: 1 });
paymentSchema.index({ tenant: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);