import { baseApi } from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (payload) => ({
        url: `/students`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useRegisterMutation
} = authApi;
