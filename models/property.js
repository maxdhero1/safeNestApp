const mongoose = require('mongoose');


const PropertySchema = new mongoose.Schema({
    // ==========================================
    // 1. SYSTEM IDENTIFIERS (The "ID Cards")
    // ==========================================
    uuid: {
        type: String,
        default: () => uuidv4(),
        unique: true
    },
    landlord_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "A listing must be attached to a verified user"]
    },

    // ==========================================
    // 2. CORE LISTING DETAILS (The "Basics")
    // ==========================================
    title: {
        type: String,
        required: [true, 'Property title is required'],
        trim: true,
        maxlength: [100, 'Property title must be less than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Property description is required'],
        trim: true,
    },
    propertyType: {
        type: String,
        required: [true, 'Specify the property type.'],
        enum: {
            values: ['apartment', 'house', 'self-contain', 'office', 'studio', 'shop'],
            message: 'Property type must be either: apartment, house, self-contain, office, studio, or shop'
        }
    },
    price: {
        type: Number,
        required: [true, 'Property price is required'],
        min: [0, 'Price must be a positive number']
    },
    pricePeriod: {
        type: String,
        required: [true, 'Specify the price period (e.g., monthly, yearly).'],
        enum: ['per-month', 'per-year'],
        default: 'per-year'
    },

    // Flattened location fields to perfectly match your controller queries
    address: {
        type: String,
        required: [true, 'Property address is required'],
        trim: true
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
    },
    bedrooms: {
        type: Number,
        default: 0
    },
    bathrooms: {
        type: Number,
        default: 0
    },
    images: [String],
    documents: [String],

    // ==========================================
    // 3. EXTRA FINANCIAL FEES
    // ==========================================
    agency_fee: { type: Number, default: 0 },
    legal_fee: { type: Number, default: 0 },
    caution_fee: { type: Number, default: 0 },
    service_charge: { type: Number, default: 0 },

    // ==========================================
    // 4. ANTI-FRAUD & STATUS FIELDS
    // ==========================================
    property_hash: {
        type: String,
        unique: true
    },
    image_hashes: [String],
    ocr_scanned_text: String,
    is_resale: {
        type: Boolean,
        default: false
    },
    last_transfer_date: Date,
    availability_status: {
        type: String,
        enum: ['Available', 'Rented', 'Unavailable'],
        default: 'Available'
    },
    verification_status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    uuid: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString(),
        unique: true
    }

}, {
    timestamps: true, // ✅ Correctly consolidated schema options block
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ==========================================
// 5. SMART LOGIC & VIRTUALS
// ==========================================

// Automatically calculates upfront breakdown values
PropertySchema.virtual('total_package').get(function () {
    return this.price + this.agency_fee + this.legal_fee + this.caution_fee + this.service_charge;
});

// Address Fingerprinting Hook (Prevents double listings)
PropertySchema.pre('save', async function (next) {
    if (!this.isModified('address') && !this.isModified('city') && !this.isModified('state') && this.property_hash) {
        return next();
    }

    this.property_hash = `${this.address}-${this.city}-${this.state}`
        .toLowerCase()
        .replace(/\s+/g, '');

    next(); // ✅ Fixed missing structural block boundary
});

// Auto-populate pipeline logic middleware
PropertySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'landlord_id',
        select: 'fullName email role isVerified'
    });
    next();
});

const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
module.exports = Property;