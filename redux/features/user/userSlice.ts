import { Dictionary } from "@/types/dictionary";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type SLUG_TYPE = "claim_info";

interface initialState extends Dictionary {
  user: {
    claim_info: {};
  };
}

const initialState: initialState = {
  user: {
    claim_info: {},
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    reset: (state) => (state = initialState),
    setUserInfo: (
      state,
      action: PayloadAction<{ slug: SLUG_TYPE; data: any }>
    ) => {
      const { slug, data } = action.payload;
      state.user[slug] = data;
    },
  },
});

export const { setUserInfo } = userSlice.actions;
export const userSliceReducer = userSlice.reducer;
export const userReset = userSlice.actions.reset;
