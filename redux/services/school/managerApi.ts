import { baseApi } from "../baseApi";

const managerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolProfile: builder.query({
      query: (schoolId) => ({
        url: `/manager/profile/school-profile?school_id=${schoolId}`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getPersonnel: builder.query({
      query: ({ school_id }) => ({
        url: `/manager/profile/personnel?school_id=${school_id}`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getRecruits: builder.query({
      query: ({ school_id }) => ({
        url: `/schools/${school_id}/recruits`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    getSchoolMetrics: builder.query({
      query: ({ school_id }) => ({
        url: `/schools/${school_id}/metrics`,
        method: "GET",
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          console.log(error);
        }
      },
    }),
    managerCreateSchoolProfile: builder.mutation({
      query: (payload) => ({
        url: `/manager/profile/school-profile`,
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
    publishSchoolProfile: builder.mutation({
      query: (payload) => ({
        url: `/manager/profile/school-profile`,
        method: "PATCH",
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
    createRecruiter: builder.mutation({
      query: (payload) => ({
        url: `/recruiters`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // console.log(result)
        } catch (error) {
          console.log(error);
        }
      },
    }),
    createManager: builder.mutation({
        query: (payload) => ({
          url: `/schools/${payload.school_id}/manager`,
          method: "POST",
          body: payload,
        }),
    }),
  }),
});

export const {
  useLazyGetSchoolProfileQuery,
  useGetSchoolProfileQuery,
  useManagerCreateSchoolProfileMutation,
  usePublishSchoolProfileMutation,
  useLazyGetPersonnelQuery,
  useCreateRecruiterMutation,
  useCreateManagerMutation,
  useLazyGetRecruitsQuery,
  useGetRecruitsQuery,
  useGetSchoolMetricsQuery
} = managerApi;
