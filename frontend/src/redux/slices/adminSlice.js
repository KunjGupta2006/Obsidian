import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../../lib/axios';

export const fetchDashboardStats = createAsyncThunk("admin/fetchDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/admin/stats");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching stats");
    }
  }
);

export const fetchMonthlyRevenue = createAsyncThunk("admin/fetchMonthlyRevenue",
  async (year = new Date().getFullYear(), { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/admin/stats/revenue?year=${year}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching revenue");
    }
  }
);

export const fetchAllOrders = createAsyncThunk("admin/fetchAllOrders",
  async ({ page = 1, limit = 20, status, paymentStatus } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (status) params.append("status", status);
      if (paymentStatus) params.append("paymentStatus", paymentStatus);

      const res = await axiosInstance.get(`/orders/admin/all?${params.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching orders");
    }
  }
);

export const fetchAllUsers = createAsyncThunk("admin/fetchAllUsers",
  async ({ page = 1, limit = 20, search } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);
      if (search) params.append("search", search);

      const res = await axiosInstance.get(`/admin/users?${params.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching users");
    }
  }
);

export const updateOrderStatus = createAsyncThunk("admin/updateOrderStatus",
  async ({ orderId, orderStatus, trackingNumber, estimatedDelivery, paymentStatus }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/orders/admin/${orderId}`, {
        orderStatus,
        trackingNumber,
        estimatedDelivery,
        paymentStatus,
      });
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error updating order");
    }
  }
);

export const updateUserRole = createAsyncThunk("admin/updateUserRole",
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/admin/users/${userId}/role`, { role });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error updating role");
    }
  }
);

export const deleteUser = createAsyncThunk("admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`);
      return userId; // return id so we can filter it out of state
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error deleting user");
    }
  }
);

export const fetchAdminOrderById = createAsyncThunk("admin/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      // Points to your admin-protected route
      const res = await axiosInstance.get(`/admin/orders/${orderId}`);
      return res.data.order;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching order details");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats:          null,
    monthlyRevenue: [],
    allOrders:      [],
    allUsers:       [],
    pagination:     {},
    loading:        false,
    error:          null,
  },
  reducers: {
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
      // dashboard stats
      .addCase(fetchDashboardStats.pending,    handlePending)
      .addCase(fetchDashboardStats.fulfilled,  (state, action) => {
        state.loading = false;
        state.stats   = action.payload;
      })
      .addCase(fetchDashboardStats.rejected,   handleRejected)

      // monthly revenue
      .addCase(fetchMonthlyRevenue.pending,    handlePending)
      .addCase(fetchMonthlyRevenue.fulfilled,  (state, action) => {
        state.loading        = false;
        state.monthlyRevenue = action.payload.data;
      })
      .addCase(fetchMonthlyRevenue.rejected,   handleRejected)

      // all orders
      .addCase(fetchAllOrders.pending,         handlePending)
      .addCase(fetchAllOrders.fulfilled,       (state, action) => {
        state.loading    = false;
        state.allOrders  = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllOrders.rejected,        handleRejected)

      // all users
      .addCase(fetchAllUsers.pending,          handlePending)
      .addCase(fetchAllUsers.fulfilled,        (state, action) => {
        state.loading    = false;
        state.allUsers   = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllUsers.rejected,         handleRejected)

      // update order status — replace order in allOrders array
      .addCase(updateOrderStatus.pending,      handlePending)
      .addCase(updateOrderStatus.fulfilled,    (state, action) => {
        state.loading = false;
        const index = state.allOrders.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.allOrders[index] = action.payload;
      })
      .addCase(updateOrderStatus.rejected,     handleRejected)

      // update user role — replace user in allUsers array
      .addCase(updateUserRole.pending,         handlePending)
      .addCase(updateUserRole.fulfilled,       (state, action) => {
        state.loading = false;
        const index = state.allUsers.findIndex(u => u._id === action.payload._id);
        if (index !== -1) state.allUsers[index] = action.payload;
      })
      .addCase(updateUserRole.rejected,        handleRejected)

      // delete user — remove from allUsers array
      .addCase(deleteUser.pending,             handlePending)
      .addCase(deleteUser.fulfilled,           (state, action) => {
        state.loading  = false;
        state.allUsers = state.allUsers.filter(u => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected,            handleRejected)
      .addCase(fetchAdminOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload; // Store detailed order here
      })
      .addCase(fetchAdminOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;