import { reset, setAuthUser } from "@/redux/features/auth/authSlice";
import { baseApi } from "../baseApi";
import { Router } from "next/router";
import logger from "@/lib/logger";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (user) => ({
        url: `/auth/login`,
        method: "POST",
        body: user,
      }),
    }),
    register: builder.mutation({
      query: (payload) => ({
        url: `/students`,
        method: "POST",
        body: payload,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;

          // Remove cookies (seemingly does nothing)
          Cookies.remove('authToken');
          Cookies.remove("token");

          // Reset redux auth state
          dispatch(reset());

          // Redirect to login
          window.location.href = "/login";
        } catch (error) {
          logger.error(error);
        }
      },
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation
} = authApi;
