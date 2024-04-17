import { baseApi } from "../baseApi";

const recruiterApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecruits: builder.query({
      query: ({schoolId, recruiterId, acceptedConnection, applicants}) => ({
        url: `/schools/${schoolId}/recruits?recruiterId=${recruiterId}&accepted_connection=${acceptedConnection}&applicants=${applicants}`,
        method: "GET",
      }),
    }),
    getRecruiter: builder.query({
      query: ({id}) => ({
        url: `/recruiters/${id}/`,
        method: "GET",
      }),
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
    }),
    sendMessage: builder.mutation({
      query: ({studentId, recruiterId, schoolId, senderRole,message}) => ({
        // url: `/messages/?recruiter_id=${recruiterId}&student_id=${studentId}&school_id=${schoolId}&sender_role=${senderRole}&message_text=${message}`,
        url:`/messages/?recruiter_id=57e2c5c8-a963-4713-a4d8-e832e79b48e4&student_id=283623f9-e8a0-424e-bd25-90a2ea5601bb&school_id&sender_role=recruiter&message_text=Hello world`,
        method: "POST",
        body:{}
      }),
    })
  }),
});

export const {
  useGetRecruitsQuery,
  useSetTerritoriesMutation,
  useLazyGetRecruiterQuery,
  useGetStudentProfileQuery,
  useSendMessageMutation
} = recruiterApi;
