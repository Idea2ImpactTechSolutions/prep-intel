import { baseApi } from "../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    claimAccount: builder.mutation({
      query: (payload) => ({
        url: `/users/claim`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          // console.log(error);
        }
      },
    }),
    setPassword: builder.mutation({
      query: (payload) => ({
        url: `/users/set-password`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          console.log(result);
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useClaimAccountMutation, useSetPasswordMutation } = userApi;
