import { baseApi } from "../baseApi";

const recruiterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecruits: builder.query({
      query: ({schoolId, recruiterId, acceptedConnection, applicants}) => ({
        url: `/schools/${schoolId}/recruits?recruiterId=${recruiterId}&accepted_connection=${acceptedConnection}&applicants=${applicants}`,
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
