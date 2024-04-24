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
      providesTags:["STUDENT"]
    }),
    sendMessage: builder.mutation({
      query: ({studentId, recruiterId, schoolId, senderRole,message}) => ({
        url: `/messages/?recruiter_id=${recruiterId}&student_id=${studentId}&school_id=${schoolId}&sender_role=${senderRole}&message_text=${message}`,
        method: "POST",
      }),
      invalidatesTags:["STUDENT"]
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
    }),
    uploadRecruiterProfileImage: builder.mutation({
      query: (profile_img) => ({
        url: `/recruiter/profile/upload-image`,
        method: "POST",
        body: profile_img,
        formData: true,
      }),
    })
  }),
});

export const {
  useGetRecruitsQuery,
  useSetTerritoriesMutation,
  useLazyGetRecruiterQuery,
  useGetRecruiterQuery,
  useGetStudentProfileQuery,
  useUploadRecruiterProfileImageMutation,
  useSendMessageMutation, 
  useUpdateRecruiterPersonalInfoMutation
} = recruiterApi;
