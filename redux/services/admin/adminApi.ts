import { baseApi } from "../baseApi";

const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSchoolManager: builder.mutation({
      query: (payload) => ({
        url: '/admin/create-manager',
        method: 'POST',
        body: payload,
      }),
    }),
    addSiteAdmin: builder.mutation({
      query: (payload) => ({
        url: '/siteadmin',
        method: 'POST',
        body: payload,
      }),
    }),
    getSchools: builder.query({
      query: (q) => ({
        url: '/admin/schools',
        method: 'GET',
        params: { q },
      }),
    }),
    getAccounts: builder.query({
      query: (q) => ({
        url: '/admin/accounts',
        method: 'GET',
        params: { q },
      }),
      providesTags:['ACCOUNT_STATUS'],
    }),
    setAccountActive: builder.mutation({
      query: (payload) => ({
        url: '/admin/accounts',
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: ['ACCOUNT_STATUS'],
    }),
  }),
});

export const {
  useAddSchoolManagerMutation,
  useAddSiteAdminMutation,
  useLazyGetSchoolsQuery,
  useGetAccountsQuery,
  useSetAccountActiveMutation,
} = adminApi;
