import { baseApi } from "../baseApi";


const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addSchoolManager: builder.mutation({
            query: (payload) => ({
                url: `/admin/create-manager`,
                method: 'POST',
                body: payload
            }),
            async onQueryStarted (_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled
                    console.log(result)
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        addSiteAdmin: builder.mutation({
          query: (payload) => ({
              url: `/siteadmin`,
              method: 'POST',
              body: payload
          }),
          async onQueryStarted (_, {queryFulfilled, dispatch}) {
              try {
                  const result = await queryFulfilled
                  console.log(result)
              } catch (error) {
                  console.log(error)
              }
          }
      }),
      getSchools: builder.query({
        query: (q) => ({
            url: `/admin/schools?q=${q}`,
            method: 'GET',
        }),
    }),
    })
})

export const { useAddSchoolManagerMutation, useAddSiteAdminMutation, useLazyGetSchoolsQuery } = adminApi