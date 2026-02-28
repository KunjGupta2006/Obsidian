import mongoose from "mongoose";
import dotenv from "dotenv";
import Watch from "../models/watchSchema.js";   // adjust path if needed

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const watches = [
  {
    "title": "Cosmograph Daytona 'Panda'",
    "brand": "Rolex",
    "referenceNumber": "126500LN",
    "price": 36500,
    "image": "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=1000",
    "condition": "New",
    "specs": { "movement": "Automatic", "caseSize": "40mm", "dialColor": "White" },
    "description": "The benchmark for those with a passion for driving and speed. Features the updated Calibre 4131 and a ceramic Cerachrom bezel.",
    "quantity": 2,
    "featured": true
  },
  {
    "title": "Royal Oak 'Jumbo' Extra-Thin",
    "brand": "Audemars Piguet",
    "referenceNumber": "16202ST",
    "price": 74000,
    "image": "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1000",
    "condition": "Unworn",
    "specs": { "movement": "Automatic", "caseSize": "39mm", "dialColor": "Bleu Nuit" },
    "description": "An architectural masterpiece in steel. The 'Petite Tapisserie' dial and integrated bracelet define modern sports luxury.",
    "quantity": 1,
    "featured": true
  },
  {
    "title": "Speedmaster Moonwatch Professional",
    "brand": "Omega",
    "referenceNumber": "310.30.42.50.01.001",
    "price": 7200,
    "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
    "condition": "New",
    "specs": { "movement": "Manual", "caseSize": "42mm", "dialColor": "Step Black" },
    "description": "The legendary chronograph that was part of all six lunar missions. Features the Co-Axial Master Chronometer Calibre 3861.",
    "quantity": 10,
    "featured": false
  },
  {
    "title": "Submariner Date 41mm",
    "brand": "Rolex",
    "referenceNumber": "126610LN",
    "price": 14200,
    "image": "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=1000",
    "condition": "New",
    "specs": { "movement": "Automatic", "caseSize": "41mm", "dialColor": "Black" },
    "description": "The original divers' watch. A robust tool watch that has become the absolute classic for any formal or casual occasion.",
    "quantity": 4,
    "featured": true
  },
  {
    "title": "Seamaster Diver 300M",
    "brand": "Omega",
    "referenceNumber": "210.30.42.20.03.001",
    "price": 5900,
    "image": "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&q=80&w=1000",
    "condition": "New",
    "specs": { "movement": "Automatic", "caseSize": "42mm", "dialColor": "Blue Wave" },
    "description": "Since 1993, the Seamaster Professional has been the choice of the world's most famous secret agent. Ceramic wave-pattern dial.",
    "quantity": 8,
    "featured": false
  },
  {
    "title": "Santos de Cartier",
    "brand": "Cartier",
    "referenceNumber": "WSSA0018",
    "price": 7850,
    "image": "https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&q=80&w=1000",
    "condition": "New",
    "specs": { "movement": "Automatic", "caseSize": "Large", "dialColor": "Silvered" },
    "description": "A tribute to the pioneer Alberto Santos-Dumont. The first modern wristwatch designed for aviation functionality.",
    "quantity": 7,
    "featured": false
  },
  {
    "title": "Aquanaut 5167A",
    "brand": "Patek Philippe",
    "referenceNumber": "5167A-001",
    "price": 68000,
    "image": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1000",
    "condition": "Pre-owned",
    "specs": { "movement": "Automatic", "caseSize": "40.8mm", "dialColor": "Black Structured" },
    "description": "Modern, sporty, and unexpected. The Aquanaut features a composite 'tropical' strap ultra-resistant to salt water and UV.",
    "quantity": 1,
    "featured": true
  },
  {
    "title": "Big Pilot’s Watch 43",
    "brand": "IWC",
    "referenceNumber": "IW329301",
    "price": 9100,
    "image": "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&q=80&w=1000",
    "condition": "New",
    "specs": { "movement": "Automatic", "caseSize": "43mm", "dialColor": "Matte Black" },
    "description": "A return to the functional core of pilot watches. Stark, legible, and powered by the IWC-manufactured 82100 calibre.",
    "quantity": 4,
    "featured": false
  },
  {
    "title": "Monaco Gulf Edition",
    "brand": "TAG Heuer",
    "referenceNumber": "CBL2115.FC6494",
    "price": 7900,
    "image": "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?auto=format&fit=crop&q=80&w=1000",
    "condition": "New",
    "specs": { "movement": "Automatic", "caseSize": "39mm", "dialColor": "Gulf Blue Stripes" },
    "description": "The original square-faced chronograph made famous by Steve McQueen. Features the iconic Gulf racing livery.",
    "quantity": 4,
    "featured": true
  },
  {
    "title": "Fifty Fathoms Automatique",
    "brand": "Blancpain",
    "referenceNumber": "5015 1130 52A",
    "price": 15500,
    "image": "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=1000",
    "condition": "New",
    "specs": { "movement": "Automatic", "caseSize": "45mm", "dialColor": "Matte Black" },
    "description": "The world's first modern diver's watch, born in 1953. Features a unique sapphire bezel for scratch resistance.",
    "quantity": 3,
    "featured": true
  },
  {
    "title": "Classic Fusion Black Magic",
    "brand": "Hublot",
    "referenceNumber": "511.CM.1171.RX",
    "price": 8900,
    "image": "https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&q=80&w=1000",
    "condition": "New",
    "specs": { "movement": "Automatic", "caseSize": "45mm", "dialColor": "Polished Black" },
    "description": "The Art of Fusion. Ceramic case with a lined rubber strap, merging traditional horology with modern materials.",
    "quantity": 6,
    "featured": false
  },
  {
    "title": "Aureum 18K Yellow Gold",
    "brand": "Patek Philippe",
    "referenceNumber": "5227J",
    "price": 38000,
    "image": "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=1000",
    "condition": "New",
    "specs": { "movement": "Automatic", "caseSize": "39mm", "dialColor": "Ivory" },
    "description": "The quintessential Calatrava. Features an officer's style case back with an invisible hinge, revealing the movement.",
    "quantity": 1,
    "featured": true
  }
]

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");

    // ❌ delete old data
    await Watch.deleteMany();
    console.log("Old watches removed");

    // ✅ insert new data
    await Watch.insertMany(watches);
    console.log("Luxury watches data inserted successfully");

    process.exit();
  } catch (err) {
    console.log("Seeding failed:", err.message);
    process.exit(1);
  }
}

seedData();