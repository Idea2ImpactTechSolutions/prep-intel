import { baseApi } from "../baseApi";

const managerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolProfile: builder.query({
      query: (schoolId) => ({
        url: `/manager/profile/school-profile?school_id=${schoolId}`,
        method: "GET",
      }),
    }),
    getPersonnel: builder.query({
      query: ({ school_id }) => ({
        url: `/manager/profile/personnel?school_id=${school_id}`,
        method: "GET",
      }),
    }),
    getRecruits: builder.query({
      query: ({schoolId, searchTerm, currentPage}) => ({
        url: `/schools/${schoolId}/recruits?&searchTerm=${searchTerm}&page=${currentPage}`,
        method: "GET",
      }),
    }),
    getSchoolMetrics: builder.query({
      query: ({ school_id }) => ({
        url: `/schools/${school_id}/metrics`,
        method: "GET",
      }),
    }),
    managerCreateSchoolProfile: builder.mutation({
      query: (payload) => ({
        url: `/manager/profile/school-profile`,
        method: "POST",
        body: payload,
      }),
    }),
    publishSchoolProfile: builder.mutation({
      query: (payload) => ({
        url: `/manager/profile/school-profile`,
        method: "PATCH",
        body: payload,
      }),
    }),
    createRecruiter: builder.mutation({
      query: (payload) => ({
        url: `/recruiters`,
        method: "POST",
        body: payload,
      }),
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
  useGetRecruitsQuery,
  useGetSchoolMetricsQuery
} = managerApi;
