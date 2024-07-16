import { baseApi } from "../baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSchoolManager: builder.mutation({
      query: (payload) => ({
        url: `/admin/create-manager`,
        method: 'POST',
        body: payload,
      }),
    }),
    addSiteAdmin: builder.mutation({
      query: (payload) => ({
        url: `/siteadmin`,
        method: 'POST',
        body: payload,
      }),
    }),
    getSchools: builder.query({
      query: (q) => ({
        url: `/admin/schools?q=${q}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useAddSchoolManagerMutation,
  useAddSiteAdminMutation,
  useLazyGetSchoolsQuery,
} = adminApi;
