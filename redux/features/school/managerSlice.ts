import { Dictionary } from "@/types/dictionary";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SLUG_TYPE = 'claim_info'

interface initialState extends Dictionary {
    manager: {
        claim_info: {}
    }
}

const initialState: initialState = {
    manager: {
        claim_info: {}
    }
}

const managerSlice = createSlice({
    name: "manager",
    initialState,
    reducers: {
        reset: (state) => state = initialState,
        setManagerInfo: (state, action: PayloadAction<{slug: SLUG_TYPE, data: any}>) => { 
            const {slug, data} = action.payload;
            state.manager[slug] = data
        }
    }

})

export const { setManagerInfo } = managerSlice.actions
export const managerSliceReducer = managerSlice.reducer
export const managerReset = managerSlice.actions.reset