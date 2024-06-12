import { baseApi } from "../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    claimAccount: builder.mutation({
      query: (payload) => ({
        url: `/users/claim`,
        method: "POST",
        body: payload,
      }),
    }),
    setPassword: builder.mutation({
      query: (payload) => ({
        url: `/users/set-password`,
        method: "POST",
        body: payload,
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: `/users/reset-password`,
        method: "POST",
        body: payload,
      }),
    }),
    getMessages: builder.query({
      query: ({recruiter_id,school_id, student_id, sender_role,recent,current_user_role}) => ({
        url: `/messages?recruiter_id=${recruiter_id}&school_id=${school_id}&student_id=${student_id}&receiver_role=${sender_role}&recent=${recent}&current_user_role=${current_user_role}`,
        method: "GET",
      }),
      providesTags: ["MESSAGES"],
    }),
    sendMessage: builder.mutation({
      query: ({ studentId, recruiterId, schoolId, senderRole, message }) => {
        // Add validation to ensure none of the required parameters are undefined

        if (!studentId || !recruiterId || !senderRole || !message) {
          throw new Error("Missing required parameters");
        }
        return {
          url: `/messages`,
          method: "POST",
          body : {message_text: message,recruiter_id : recruiterId,student_id:studentId,school_id: schoolId,sender_role:senderRole}
        };
      },
      invalidatesTags: ["STUDENT"],
    }),
  }),
});

export const {
  useClaimAccountMutation,
  useSetPasswordMutation,
  useResetPasswordMutation,
  useLazyGetMessagesQuery,
  useSendMessageMutation
} = userApi;
