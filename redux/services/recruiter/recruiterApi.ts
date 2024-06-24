import { baseApi } from "../baseApi";

const recruiterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecruits: builder.query({
      query: ({schoolId, recruiterId, acceptedConnection, applicants}) => ({
        url: `/schools/${schoolId}/recruits?recruiterId=${recruiterId}&accepted_connection=${acceptedConnection}&applicants=${applicants}`,
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
      query: ({studentId,recruiterId}) => ({
        url: `/students/${studentId}/profile?recruiter_id=${recruiterId}`,
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
  useGetRecruitsQuery,
  useSetTerritoriesMutation,
  useLazyGetRecruiterQuery,
  useGetRecruiterQuery,
  useGetStudentProfileQuery,
  useLazyExploreRecruitsQuery,
  useUpdateRecruiterPersonalInfoMutation
} = recruiterApi;
