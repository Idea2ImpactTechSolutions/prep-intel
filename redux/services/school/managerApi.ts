import { baseApi } from "../baseApi";


const managerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        schoolManagerClaimAccount: builder.mutation({
            query: (payload) => ({
                url: `/manager/claim-account`,
                method: 'POST',
                body: payload
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}){
                try {
                    const result = await queryFulfilled
                    console.log(result)
                } catch (error) {
                    console.log(error)
                }
            }
        })
    })
})

export const { useSchoolManagerClaimAccountMutation} = managerApi