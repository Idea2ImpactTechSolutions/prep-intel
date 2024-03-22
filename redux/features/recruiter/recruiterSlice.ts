import { Dictionary } from "@/types/dictionary";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SLUG_TYPE = "claim_info";

interface initialState extends Dictionary {
  recruiter: {
    claim_info: {};
  };
}

const initialState: initialState = {
  recruiter: {
    claim_info: {},
  },
};

const recruiterSlice = createSlice({
  name: "recruiter",
  initialState,
  reducers: {
    reset: (state) => (state = initialState),
    setRecruiterInfo: (
      state,
      action: PayloadAction<{ slug: SLUG_TYPE; data: any }>
    ) => {
      const { slug, data } = action.payload;
      state.recruiter[slug] = data;
    },
  },
});

export const {
  setRecruiterInfo,
} = recruiterSlice.actions;
export const recruiterSliceReducer = recruiterSlice.reducer;
export const recruiterReset = recruiterSlice.actions.reset;
