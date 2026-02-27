import mongoose from "mongoose";

const watchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Watch title is required"],
        trim: true
    },
    brand: { 
        type: String, 
        required: [true, "Brand name is required"], 
        index: true 
    },
    referenceNumber: { 
        type: String, 
        trim: true,
        index: true
    },
    price: { 
        type: Number, 
        required: [true, "Price is required"],
        min: [0, "Investment value cannot be negative"] 
    },
    image: { 
        type: String, 
        required: [true, "A primary watch image URL is required"] 
    },
    condition: {
        type: String,
        enum: ["New", "Unworn", "Pre-owned", "Vintage"],
        default: "New"
    },
    specs: {
        movement: { 
            type: String, 
            enum: ["Automatic", "Manual", "Quartz"],
            default: "Automatic" 
        },
        caseSize: String,
        dialColor: String,
    },
    description: {
        type: String,
        required: [true, "Please provide a detailed horological description"]
    },
    quantity: {
        type: Number,
        default: 1,
        min: [0, "Quantity cannot be less than zero"]
    },
    inStock: { 
        type: Boolean, 
        default: true 
    },
    featured: { 
        type: Boolean, 
        default: false 
    }
}, {
    timestamps: true 
});

// Weighted Index for Search Functionality
watchSchema.index({ 
    title: 'text', 
    brand: 'text', 
    referenceNumber: 'text',
    description: 'text' 
}, {
    weights: {
        title: 10,
        referenceNumber: 7,
        brand: 5,
        description: 1
    },
    name: "WatchSearchIndex"
});

// Pre-save Middleware: Automatically update inStock based on quantity
watchSchema.pre('save', function(next) {
    this.inStock = this.quantity > 0;
    next();
});

const Watch = mongoose.model("Watch", watchSchema);
export default Watch;