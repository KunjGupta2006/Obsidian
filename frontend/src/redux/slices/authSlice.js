import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../lib/axios';


export const loginuser=createAsyncThunk("auth/login",async({email,password},{rejectWithValue})=>{

    try{
        const result=await axiosInstance.post( `/user/auth/login`,{email,password} );
        return result.data.user;
    }catch(err){
        return rejectWithValue(err.response?.data?.message || "login failed" );
    }
});
export const signupuser=createAsyncThunk("auth/signup",async({fullname,email,password},{rejectWithValue})=>{

    try{
        const result=await axiosInstance.post( `/user/auth/signup`,{fullname,email,password} );
        return result.data.user;
    }catch(err){
        return rejectWithValue(err.response?.data?.message || "Signup failed" );
    }
});
export const logoutuser=createAsyncThunk('auth/logout',
  async (_, { rejectWithValue }) => {  // _ means it doesnt need any args.
    try {
      await axiosInstance.post('/user/auth/logout');
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const result = await axiosInstance.get('/user/profile');
      return result.data.user;
    } catch (err) {
      return rejectWithValue(null); // silent fail — just means not logged in
    }
  }
);

export const updateProfile = createAsyncThunk('auth/updateProfile',
  async ({ fullname }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('/user/profile', { fullname });
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update');
    }
  }
);

export const changePassword = createAsyncThunk('auth/changePassword',
  async ({ currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put('/user/password', { currentPassword, newPassword });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update password');
    }
  }
);


export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:null,
    isAuthenticated:false,
    loading:false,
    sessionChecked:false, // true once fetchCurrentUser has resolved
    error:null,
  },
    reducers: {
    // synchronous actions go here
    clearError(state) {
      state.error = null;
    },
  },
    extraReducers:(builder)=>{
    builder.addCase(loginuser.pending,(state)=>{
        state.loading=true;
        state.error=null;
    }).addCase(loginuser.fulfilled,(state,action)=>{
        state.loading=false;
        state.user=action.payload;
        state.isAuthenticated=true;
    }).addCase(loginuser.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload;
    }).addCase(signupuser.pending,(state)=>{
        state.loading=true;
        state.error=null;
    }).addCase(signupuser.fulfilled,(state,action)=>{
        state.loading=false;
        state.user=action.payload;
        state.isAuthenticated=true;
    }).addCase(signupuser.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload;
    }).addCase(logoutuser.pending,(state)=>{
        state.loading=true;
        state.error=null;
    }).addCase(logoutuser.fulfilled,(state)=>{
        state.loading=false;
        state.user=null;
        state.isAuthenticated=false;
    }).addCase(logoutuser.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload;
    }).addCase(fetchCurrentUser.pending,(state)=>{
        state.loading=true;
    }).addCase(fetchCurrentUser.fulfilled,(state,action)=>{
        state.loading=false;
        state.user=action.payload;
        state.isAuthenticated=true;
        state.sessionChecked=true
    }).addCase(fetchCurrentUser.rejected,(state)=>{
        state.loading=false;
        state.sessionChecked=true;

    })// update profile
    .addCase(updateProfile.pending,   (state) => { state.loading = true; state.error = null; })
    .addCase(updateProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user    = action.payload; // reflects name change instantly in UI
    })
    .addCase(updateProfile.rejected,  (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    })

    // change password
    .addCase(changePassword.pending,   (state) => { state.loading = true; state.error = null; })
    .addCase(changePassword.fulfilled, (state) => { state.loading = false; })
    .addCase(changePassword.rejected,  (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    })
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;