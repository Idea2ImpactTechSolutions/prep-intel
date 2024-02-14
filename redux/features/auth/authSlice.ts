import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: "",
    user: {}
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => state = initialState,
        setAuthUser: (state, action: PayloadAction<any>) => { 
            // console.log(action.payload)
            state.user = action.payload
            state.token = action.payload.token
        }
    }

})

export const { setAuthUser, reset } = authSlice.actions
export const authSliceReducer = authSlice.reducer