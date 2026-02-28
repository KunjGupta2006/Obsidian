import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../lib/axios';

export const placeOrder = createAsyncThunk("order/placeOrder",
  async ({ shippingAddress, paymentMethod }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/orders", { shippingAddress, paymentMethod });
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error placing order");
    }
  }
);

export const fetchMyOrders = createAsyncThunk("order/fetchMyOrders",
  async ({ page = 1, limit = 10, status } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (status) params.append("status", status);

      const res = await axiosInstance.get(`/orders?${params.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching orders");
    }
  }
);

export const fetchOrderById = createAsyncThunk("order/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/orders/${orderId}`);
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching order");
    }
  }
);

export const cancelOrder = createAsyncThunk("order/cancelOrder",
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/orders/${orderId}/cancel`, { reason });
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error cancelling order");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders:        [],
    selectedOrder: null,
    pagination:    {},
    loading:       false,
    error:         null,
  },
  reducers: {
    clearSelectedOrder(state) {
      state.selectedOrder = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
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
      // place order
      .addCase(placeOrder.pending, handlePending)
      .addCase(placeOrder.fulfilled,(state, action) => {
        state.loading= false;
        state.selectedOrder  = action.payload;
      })
      .addCase(placeOrder.rejected,  handleRejected)

      // fetch my orders
      .addCase(fetchMyOrders.pending,    handlePending)
      .addCase(fetchMyOrders.fulfilled,  (state, action) => {
        state.loading  = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyOrders.rejected, handleRejected)

      // fetch single order
      .addCase(fetchOrderById.pending,   handlePending)
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading  = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected,  handleRejected)

      // cancel order — update the order inside the orders array
      .addCase(cancelOrder.pending,  handlePending)
      .addCase(cancelOrder.fulfilled,  (state, action) => {
        state.loading   = false;
        state.selectedOrder = action.payload;
        // replace the cancelled order in the list if it exists
        const index = state.orders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.orders[index] = action.payload;
      })
      .addCase(cancelOrder.rejected,     handleRejected);
  },
});

export const { clearSelectedOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;