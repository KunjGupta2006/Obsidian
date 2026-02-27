import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../lib/axios';

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/wishlist");
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching wishlist");
    }
  }
);

export const addToWishlist = createAsyncThunk("wishlist/addToWishlist",
  async (watchId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/wishlist/${watchId}`);
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error adding to wishlist");
    }
  }
);

export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist",
  async (watchId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/wishlist/${watchId}`);
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error removing from wishlist");
    }
  }
);

export const moveToCart = createAsyncThunk("wishlist/moveToCart",
  async (watchId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post(`/wishlist/${watchId}/move-to-cart`);
      return res.data; // returns both wishlist and cart
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error moving to cart");
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
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
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    };

    builder
      .addCase(fetchWishlist.pending,    handlePending)
      .addCase(fetchWishlist.fulfilled,   (state, action) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(fetchWishlist.rejected,handleRejected)

      .addCase(addToWishlist.pending, handlePending)
      .addCase(addToWishlist.fulfilled,  (state, action) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(addToWishlist.rejected, handleRejected)

      .addCase(removeFromWishlist.pending,  handlePending)
      .addCase(removeFromWishlist.fulfilled,(state, action) => {
        state.loading = false;
        state.items   = action.payload;
      })
      .addCase(removeFromWishlist.rejected, handleRejected)

      // moveToCart updates both wishlist and cart
      .addCase(moveToCart.pending,    handlePending)
      .addCase(moveToCart.fulfilled,   (state, action) => {
        state.loading = false;
        state.items   = action.payload.wishlist;
        // cart gets updated in cartSlice separately
      })
      .addCase(moveToCart.rejected,handleRejected);
  },
});

export default wishlistSlice.reducer;