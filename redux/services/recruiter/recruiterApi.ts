import { baseApi } from "../baseApi";


function buildQueryString(params: { [key: string]: any }): string {
  const queryString = Object.keys(params)
    .filter(key => params[key] !== undefined && params[key] !== null && params[key] !== '')
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  return queryString ? `?${queryString}` : '';
}

const recruiterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConnections: builder.query({
      query: ({schoolId, ...options}) => ({
        url: `/schools/${schoolId}/recruits${buildQueryString(options)}`,
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
