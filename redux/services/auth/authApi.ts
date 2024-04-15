import { reset, setAuthUser } from "@/redux/features/auth/authSlice";
import { baseApi } from "../baseApi";
import Cookies from "js-cookie";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => ({
        url: `/auth/login`,
        method: "POST",
        body: user,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const { data } = result;
          Cookies.set("token", data.token);
          dispatch(setAuthUser(data));
        } catch (error: any) {
          // console.log(error)
        }
      },
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: `/register`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          // const result = await queryFulfilled;
          
        } catch (error: any) {
          // console.log(error)
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: `/logout`,
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch }) {
        try {
          Cookies.remove("token");
          window.location.href = "/";
          dispatch(reset());
        } catch (error: any) {
          console.log("Error:", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation
} = authApi;
