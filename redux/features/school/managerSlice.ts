import { Dictionary } from "@/types/dictionary";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SLUG_TYPE = 'claim_info'

interface initialState extends Dictionary {
    manager: {
        claim_info: {},
        school_information: Dictionary
    }
}

const initialState: initialState = {
    manager: {
        claim_info: {},
        school_information: {},
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
        },
        setSchoolInformation: (state, action) => {
            const {slug, data} = action.payload;
            state.manager.school_information[slug] = data
        },
        resetSchoolInformation: (state) => state.manager.school_information = Object.assign({})
    }

})

export const { setManagerInfo, setSchoolInformation, resetSchoolInformation } = managerSlice.actions
export const managerSliceReducer = managerSlice.reducer
export const managerReset = managerSlice.actions.reset