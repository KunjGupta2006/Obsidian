import {configureStore} from "@reduxjs/toolkit";
import authReducer  from "./slices/authSlice.js";
import watchReducer from "./slices/watchSlice.js";
import cartReducer from "./slices/cartSlice.js";
import wishlistReducer from "./slices/wishlistSlice.js";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";

export const store= configureStore({
    reducer:{
        auth:authReducer,
        watches: watchReducer,
        cart:cartReducer,
        wishlist:wishlistReducer,
        orders:orderReducer,
        admin:adminReducer,
    }
});