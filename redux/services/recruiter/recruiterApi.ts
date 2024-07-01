import { baseApi } from "../baseApi";

const recruiterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConnections: builder.query({
      query: ({schoolId, searchTerm, recruiterId, currentPage}) => ({
        url: `/schools/${schoolId}/recruits?recruiterId=${recruiterId}&searchTerm=${searchTerm}&page=${currentPage}`,
        method: "GET",
      }),
    }),
    exploreRecruits: builder.query({
      query: ({schoolId, minGpa, minAct, minSat, states, page}) => ({
        url: `/schools/${schoolId}/recruits/explorer?states=${states}&page=${page}&minGpa=${minGpa}&minAct=${minAct}&minSat=${minSat}`,
        method: "GET",
      }),
    }),
    getRecruiter: builder.query({
      query: ({id}) => ({
        url: `/recruiters/${id}/`,
        method: "GET",
      }),
      providesTags:['RECRUITER_INFO']
    }),
    setTerritories: builder.mutation({
      query: function(payload){
        const { id } = payload;
        return {
          url: `/recruiters/${id}/` ,
          method: "PATCH",
          body: payload,
        };
      },
    }),
    getStudentProfile: builder.query({
      query: ({studentId,recruiterId,schoolId}) => ({
        url: `/students/${studentId}/profile?recruiter_id=${recruiterId}&schoolId=${schoolId}`,
      }),
      providesTags:["STUDENT"]
    }),
    updateRecruiterPersonalInfo: builder.mutation({
      query: function(payload){
        const { id } = payload;
        return {
          url: `/recruiters/${id}` ,
          method: "PATCH",
          body: payload,
        };
      },
      invalidatesTags:["RECRUITER_INFO"]
    }),
  }),
});

export const {
  useGetConnectionsQuery,
  useSetTerritoriesMutation,
  useLazyGetRecruiterQuery,
  useGetRecruiterQuery,
  useGetStudentProfileQuery,
  useLazyExploreRecruitsQuery,
  useUpdateRecruiterPersonalInfoMutation
} = recruiterApi;
