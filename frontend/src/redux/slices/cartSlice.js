import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../lib/axios';
import { moveToCart } from './wishlistSlice';
import {placeOrder} from "./orderSlice.js";

export const fetchCart = createAsyncThunk("cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/cart");
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching cart");
    }
  }
);

export const addToCart = createAsyncThunk("cart/addToCart",
  async (watchId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/cart/${watchId}`);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error adding to cart");
    }
  }
);

export const updateCartItem = createAsyncThunk("cart/updateCartItem",
  async ({ watchId, quantity }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/cart/${watchId}`, { quantity });
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error updating cart");
    }
  }
);

export const removeFromCart = createAsyncThunk("cart/removeFromCart",
  async (watchId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/cart/${watchId}`);
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error removing item");
    }
  }
);

export const clearCart = createAsyncThunk("cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete("/cart");
      return res.data.cart;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error clearing cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items:   [],
    loading: false,
    error:   null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error   = null;
    };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.items   = action.payload;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    };

    builder
      .addCase(fetchCart.pending,handlePending)
      .addCase(fetchCart.fulfilled,handleFulfilled)
      .addCase(fetchCart.rejected,handleRejected)

      .addCase(addToCart.pending,  handlePending)
      .addCase(addToCart.fulfilled,handleFulfilled)
      .addCase(addToCart.rejected, handleRejected)

      .addCase(updateCartItem.pending,  handlePending)
      .addCase(updateCartItem.fulfilled,handleFulfilled)
      .addCase(updateCartItem.rejected, handleRejected)

      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled,handleFulfilled)
      .addCase(removeFromCart.rejected, handleRejected)

      .addCase(clearCart.pending,handlePending)
      .addCase(clearCart.fulfilled,handleFulfilled)
      .addCase(clearCart.rejected,handleRejected)
      .addCase(moveToCart.fulfilled, (state, action) => {
            state.items = action.payload.cart;})
      .addCase(placeOrder.fulfilled, (state) => {
            state.items = []; // clear cart in Redux when order is placed
        })
  },
});

export default cartSlice.reducer;