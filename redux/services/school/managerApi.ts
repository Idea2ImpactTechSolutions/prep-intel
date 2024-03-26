import { baseApi } from "../baseApi";

const managerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    schoolManagerClaimAccount: builder.mutation({
      query: (payload) => ({
        url: `/manager/claim-account`,
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
    getAllAdmin: builder.query({
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
    uploadSchoolImage: builder.mutation({
      query: (school_image) => ({
        url: `/manager/profile/upload-image`,
        method: "POST",
        body: school_image,
        formData: true,
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
        url: `/recruiter`,
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
  }),
});

export const {
  useSchoolManagerClaimAccountMutation,
  useLazyGetSchoolProfileQuery,
  useManagerCreateSchoolProfileMutation,
  useUploadSchoolImageMutation,
  usePublishSchoolProfileMutation,
  useLazyGetAllAdminQuery,
  useCreateRecruiterMutation,
} = managerApi;
