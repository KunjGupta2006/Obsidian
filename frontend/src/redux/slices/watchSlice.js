import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../lib/axios';


export const fetchWatchById=createAsyncThunk("/watches/:id",async ({id},{rejectWithValue})=>{
    try{
        const res=await axiosInstance.get(`/watches/${id}`);
        return res.data.watch;
    }catch(err){
        return rejectWithValue(err.response?.data?.message || "Error finding watch");
    }
});

export const fetchWatches = createAsyncThunk(
  "watches/fetchAll",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const {
        search,
        brand,
        condition,
        movement,
        minPrice,
        maxPrice,
        inStock,
        featured,
        sort = "createdAt",
        order = "desc",
        page = 1,
        limit = 12,
      } = filters;

      // build query string — only include params that have a value
      const params = new URLSearchParams();
      if (search)    params.append("search", search);
      if (brand)     params.append("brand", brand);
      if (condition) params.append("condition", condition);
      if (movement)  params.append("movement", movement);
      if (minPrice)  params.append("minPrice", minPrice);
      if (maxPrice)  params.append("maxPrice", maxPrice);
      if (inStock !== undefined) params.append("inStock", inStock);
      if (featured !== undefined) params.append("featured", featured);
      params.append("sort", sort);
      params.append("order", order);
      params.append("page", page);
      params.append("limit", limit);

      const res = await axiosInstance.get(`/watches?${params.toString()}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Error fetching watches");
    }
  }
);

export const watchSlice=createSlice({
    name:"watch",
    initialState:{
        error:null,
        loading:false,
        watches:[],
        selectedWatch:{},
        filters:{},
        pagination:{},
    },
    reducers: {
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters(state) {
            state.filters = {};
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(fetchWatchById.pending,(state)=>{
            state.loading=true;
            state.error=null;
        }).addCase(fetchWatchById.fulfilled,(state,action)=>{
            state.loading=false;
            state.selectedWatch=action.payload;
        }).addCase(fetchWatchById.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
            state.selectedWatch={};
        }).addCase(fetchWatches.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchWatches.fulfilled, (state, action) => {
            state.loading = false;
            state.watches = action.payload.watches;
            state.pagination = action.payload.pagination;
        })
        .addCase(fetchWatches.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
});

export const { setFilters, resetFilters } = watchSlice.actions;
export default watchSlice.reducer;