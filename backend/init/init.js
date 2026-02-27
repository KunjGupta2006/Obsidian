import mongoose from "mongoose";
import dotenv from "dotenv";
import Watch from "../models/watchSchema.js";   // adjust path if needed

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const watches=[
  {
    "title": "Rolex Submariner Date 41mm Black Dial",
    "brand": "Rolex",
    "referenceNumber": "126610LN",
    "price": 1350000,
    "image": "https://content.rolex.com/v7/dam/2022/upright-bba-with-shadow/m126610ln-0001.png",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "41mm",
      "dialColor": "Black"
    },
    "description": "The Rolex Submariner Date 126610LN is a legendary dive watch featuring a Cerachrom bezel, Oystersteel case, and Rolex’s in-house automatic movement.",
    "quantity": 3,
    "featured": true
  },
  {
    "title": "Rolex Datejust 36 Blue Dial Jubilee",
    "brand": "Rolex",
    "referenceNumber": "126234",
    "price": 850000,
    "image": "https://content.rolex.com/v7/dam/2022/upright-bba-with-shadow/m126234-0051.png",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "36mm",
      "dialColor": "Blue"
    },
    "description": "The classic Datejust 36 with fluted bezel and Jubilee bracelet, representing timeless Rolex elegance.",
    "quantity": 2
  },
  {
    "title": "Patek Philippe Nautilus Blue Dial",
    "brand": "Patek Philippe",
    "referenceNumber": "5711/1A-010",
    "price": 9500000,
    "image": "https://www.patek.com/images/articles/face_white/5711_1A_010.jpg",
    "condition": "Unworn",
    "specs": {
      "movement": "Automatic",
      "caseSize": "40mm",
      "dialColor": "Blue"
    },
    "description": "The Nautilus 5711 is one of the most iconic luxury sports watches, designed by Gérald Genta with a blue horizontal dial.",
    "quantity": 1,
    "featured": true
  },
  {
    "title": "Patek Philippe Calatrava White Dial",
    "brand": "Patek Philippe",
    "referenceNumber": "5227G",
    "price": 3200000,
    "image": "https://www.patek.com/images/articles/face_white/5227G_010.jpg",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "39mm",
      "dialColor": "White"
    },
    "description": "The Calatrava is the embodiment of classic dress watch design with a clean dial and precious metal case.",
    "quantity": 2
  },
  {
    "title": "Rado Captain Cook Automatic Bronze Green",
    "brand": "Rado",
    "referenceNumber": "R32504315",
    "price": 250000,
    "image": "https://www.rado.com/media/catalog/product/r/3/r32504315.png",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "42mm",
      "dialColor": "Green"
    },
    "description": "Vintage-inspired diver watch with bronze case, green dial, and ceramic bezel insert.",
    "quantity": 4
  },
  {
    "title": "Rado True Square Skeleton Ceramic",
    "brand": "Rado",
    "referenceNumber": "R27086162",
    "price": 310000,
    "image": "https://www.rado.com/media/catalog/product/r/2/r27086162.png",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "38mm",
      "dialColor": "Skeleton"
    },
    "description": "Modern square ceramic watch with skeleton dial showcasing its automatic movement.",
    "quantity": 2,
    "featured": true
  },
  {
    "title": "Audemars Piguet Royal Oak Selfwinding Blue Dial",
    "brand": "Audemars Piguet",
    "referenceNumber": "15500ST",
    "price": 7200000,
    "image": "https://www.audemarspiguet.com/content/dam/ap/com/products/watches/royal-oak/15500ST_OO_1220ST_01.png",
    "condition": "Unworn",
    "specs": {
      "movement": "Automatic",
      "caseSize": "41mm",
      "dialColor": "Blue"
    },
    "description": "The Royal Oak features an octagonal bezel, tapisserie dial, and integrated bracelet — a design icon.",
    "quantity": 1,
    "featured": true
  },
  {
    "title": "Omega Speedmaster Moonwatch Professional",
    "brand": "Omega",
    "referenceNumber": "310.30.42.50.01.001",
    "price": 620000,
    "image": "https://www.omegawatches.com/media/catalog/product/o/m/omega-speedmaster-moonwatch-31030425001001.png",
    "condition": "New",
    "specs": {
      "movement": "Manual",
      "caseSize": "42mm",
      "dialColor": "Black"
    },
    "description": "The iconic Moonwatch worn during NASA lunar missions with manual-winding chronograph movement.",
    "quantity": 3
  },
  {
    "title": "TAG Heuer Carrera Chronograph Black Dial",
    "brand": "TAG Heuer",
    "referenceNumber": "CBN2A1B",
    "price": 420000,
    "image": "https://www.tagheuer.com/on/demandware.static/-/Sites-tagheuer-master/default/dw4a2e7c61/images/CBN2A1B.BA0643.png",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "44mm",
      "dialColor": "Black"
    },
    "description": "A racing-inspired chronograph powered by the in-house Heuer 02 automatic movement.",
    "quantity": 3
  },
  {
    "title": "Hublot Big Bang Unico Titanium",
    "brand": "Hublot",
    "referenceNumber": "441.NX.1171.RX",
    "price": 1100000,
    "image": "https://www.hublot.com/sites/default/files/styles/watch_big/public/441.NX.1171.RX.png",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "45mm",
      "dialColor": "Skeleton"
    },
    "description": "Bold luxury sports watch with skeleton dial and in-house UNICO chronograph movement.",
    "quantity": 2,
    "featured": true
  },
    {
    "title": "Patek Philippe Calatrava White Dial",
    "brand": "Patek Philippe",
    "referenceNumber": "5227G",
    "price": 3200000,
    "image": "https://www.patek.com/images/articles/face_white/5227G_010.jpg",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "39mm",
      "dialColor": "White"
    },
    "description": "The Calatrava is the embodiment of classic dress watch design with a clean dial and precious metal case.",
    "quantity": 2
  },
  {
    "title": "Rado Captain Cook Automatic Bronze Green",
    "brand": "Rado",
    "referenceNumber": "R32504315",
    "price": 250000,
    "image": "https://www.rado.com/media/catalog/product/r/3/r32504315.png",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "42mm",
      "dialColor": "Green"
    },
    "description": "Vintage-inspired diver watch with bronze case, green dial, and ceramic bezel insert.",
    "quantity": 4
  },
  {
    "title": "Rado True Square Skeleton Ceramic",
    "brand": "Rado",
    "referenceNumber": "R27086162",
    "price": 310000,
    "image": "https://www.rado.com/media/catalog/product/r/2/r27086162.png",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "38mm",
      "dialColor": "Skeleton"
    },
    "description": "Modern square ceramic watch with skeleton dial showcasing its automatic movement.",
    "quantity": 2,
    "featured": true
  },
    {
    "title": "Patek Philippe Calatrava White Dial",
    "brand": "Patek Philippe",
    "referenceNumber": "5227G",
    "price": 3200000,
    "image": "https://www.patek.com/images/articles/face_white/5227G_010.jpg",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "39mm",
      "dialColor": "White"
    },
    "description": "The Calatrava is the embodiment of classic dress watch design with a clean dial and precious metal case.",
    "quantity": 2
  },
  {
    "title": "Rado Captain Cook Automatic Bronze Green",
    "brand": "Rado",
    "referenceNumber": "R32504315",
    "price": 250000,
    "image": "https://www.rado.com/media/catalog/product/r/3/r32504315.png",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "42mm",
      "dialColor": "Green"
    },
    "description": "Vintage-inspired diver watch with bronze case, green dial, and ceramic bezel insert.",
    "quantity": 4
  },
  {
    "title": "Rado True Square Skeleton Ceramic",
    "brand": "Rado",
    "referenceNumber": "R27086162",
    "price": 310000,
    "image": "https://www.rado.com/media/catalog/product/r/2/r27086162.png",
    "condition": "New",
    "specs": {
      "movement": "Automatic",
      "caseSize": "38mm",
      "dialColor": "Skeleton"
    },
    "description": "Modern square ceramic watch with skeleton dial showcasing its automatic movement.",
    "quantity": 2,
    "featured": true
  },
];
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