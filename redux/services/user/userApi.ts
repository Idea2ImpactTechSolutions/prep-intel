import { baseApi } from "../baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    claimAccount: builder.mutation({
      query: (payload) => ({
        url: `/users/claim`,
        method: "POST",
        body: payload,
      }),
      async onQueryStarted(_, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
        } catch (error) {
          // console.log(error);
        }
      },
    }),
    setPassword: builder.mutation({
      query: (payload) => ({
        url: `/users/set-password`,
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
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: `/users/reset-password`,
        method: "POST",
        body: payload,
      }),
    }),
    getMessages: builder.query({
      query: ({recruiter_id,school_id, student_id, sender_role,recent}) => ({
        url: `/messages?recruiter_id=${recruiter_id}&school_id=${school_id}&student_id=${student_id}&receiver_role=${sender_role}&recent=${recent}`,
        method: "GET",
      }),
      providesTags: ["MESSAGES"],
    }),
    sendMessage: builder.mutation({
      query: ({recruiter_id, student_id, sender_role,schoold_id, message_text}) => ({
        url: `/messages/?recruiter_id=${recruiter_id}&student_id=${student_id}&school_id=${schoold_id}&sender_role=${sender_role}&message_text=${message_text}`,
        method: "POST",
      }),
      // invalidatesTags:["MESSAGES"]
    }),
  }),
});

export const { useClaimAccountMutation, useSetPasswordMutation, useResetPasswordMutation, useLazyGetMessagesQuery, useSendMessageMutation } = userApi;
