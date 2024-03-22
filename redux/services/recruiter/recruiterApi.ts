import { baseApi } from "../baseApi";

const recruiterApi = baseApi.injectEndpoints({
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
  }),
});

export const { useClaimAccountMutation } = recruiterApi;
