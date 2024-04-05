import { baseApi } from "../baseApi";

const recruiterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecruits: builder.query({
      query: ({schoolId, recruiterId, acceptedConnection, applicants}) => ({
        url: `/schools/2e0f768e-c887-4945-8cd7-96f96a07a3eb/recruits?recruiterId=57e2c5c8-a963-4713-a4d8-e832e79b48e4&accepted_connection=&applicants=`,
        // url: `/schools/${schoolId}/recruits?recruiterId=${recruiterId}&accepted_connection=${acceptedConnection}&applicants=${applicants}`,
        method: "GET",
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

export const {
  useGetRecruitsQuery,
} = recruiterApi;
