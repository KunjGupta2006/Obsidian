import mongoose from 'mongoose';
import Watch from '../models/watchSchema.js';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
await Watch.updateMany({}, { $set: { quantity: 15, inStock: true } });
console.log('Stock reset for all watches');
await mongoose.disconnect();