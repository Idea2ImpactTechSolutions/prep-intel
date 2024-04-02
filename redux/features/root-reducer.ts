import { combineReducers } from "@reduxjs/toolkit";

import { authSliceReducer } from "./auth/authSlice";
import { baseApi } from "../services/baseApi";
import { managerSliceReducer } from "./school/managerSlice";
import { userSliceReducer } from "./user/userSlice";
// import { quizSliceReducer } from "./quiz/quizSlice";

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authSliceReducer,
  manager: managerSliceReducer,
  user: userSliceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
