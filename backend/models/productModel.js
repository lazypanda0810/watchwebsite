const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter watch name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter watch description"]
    },
    highlights: [
        {
            type: String,
            required: true
        }
    ],
    specifications: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ],
    // Watch-specific fields
    movementType: {
        type: String,
        enum: ['Quartz', 'Automatic', 'Manual', 'Digital', 'Smart'],
        default: 'Quartz'
    },
    dialColor: {
        type: String,
        default: 'Black'
    },
    strapMaterial: {
        type: String,
        enum: ['Leather', 'Metal', 'Rubber', 'Silicone', 'Fabric', 'Ceramic'],
        default: 'Leather'
    },
    waterResistance: {
        type: String,
        default: '50m'
    },
    caseSize: {
        type: String,
        default: '42mm'
    },
    price: {
        type: Number,
        required: [true, "Please enter watch price"]
    },
    cuttedPrice: {
        type: Number,
        required: [true, "Please enter cutted price"]
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    brand: {
        name: {
            type: String,
            required: true
        },
        logo: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        }
    },
    category: {
        type: String,
        required: [true, "Please enter watch category"],
        enum: ["Men's Watches", "Women's Watches", "Smartwatches", "Luxury Watches", "Sports Watches", "Kids' Watches"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter watch stock"],
        maxlength: [4, "Stock cannot exceed limit"],
        default: 1
    },
    warranty: {
        type: Number,
        default: 1
    },
    ratings: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);