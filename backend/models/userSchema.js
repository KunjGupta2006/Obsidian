import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows for future email/password users without googleId
    },
    fullname: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true
    },
    password:{
        type:String,
        trim:true,
    },
    avatar: String, // To store the Google profile picture
    
    // Luxury Experience Fields
    role: {
        type: String,
        enum: ["client", "admin"],
        default: "client"
    },
    
    // Shopping State
    cart: [{
    watch: { type: mongoose.Schema.Types.ObjectId, ref: 'Watch' },
    quantity: { type: Number, default: 1, min: 1 },
    addedAt: { type: Date, default: Date.now }
    }],
    
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Watch'
    }],

    // Order History
    purchaseHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
}, {
    timestamps: true
});

// Middleware to prevent duplicate watches in the wishlist
// userSchema.pre('save', function(next) {
//     if (this.isModified('wishlist')) {
//         this.wishlist = [...new Set(this.wishlist.map(id => id.toString()))];
//     }
//     next();
// });

const User = mongoose.model("User", userSchema);
export default User;