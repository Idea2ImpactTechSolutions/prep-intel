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
        })
    })
})

export const { useAddSchoolManagerMutation } = adminApi