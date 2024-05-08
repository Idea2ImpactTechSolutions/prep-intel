import { baseApi } from "../baseApi";

const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolData: builder.query({
      query: ({ states, page, pageSize }) => ({
        url: `/schools?states=${states}&page=${page}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),
    getStudentVitals: builder.query({
      query: (studentId) => ({
        url: `/students/${studentId}/vitals`,
        method: "GET",
      }),
    }),
    addStudentVitals: builder.mutation({
      query: (payload) => ({
        url: `/students/${payload.studentId}/vitals`,
        method: "POST",
        body: payload.data
      }),
    }),
    connectWithRecruiter: builder.mutation({
      query:(payload)=>({
        url:`/students/${payload.studentId}/schools`,
        method: "POST",
        body: payload,
      })
    }),
    getStudentSchools: builder.query({
      query: (studentId) => ({
        url: `/students/${studentId}/schools`,
        method: "GET",
      }),
    }),
    addStudentSchools: builder.mutation({
      query: (payload) => ({
        url: `/students/${payload.studentId}/schools`,
        method: "POST",
        body: payload.data
      }),
    }),
    getStudentMajors: builder.query({
      query: (studentId) => ({
        url: `/students/${studentId}/majors`,
        method: "GET",
      }),
    }),
    addStudentMajors: builder.mutation({
      query: (payload) => ({
        url: `/students/${payload.studentId}/majors`,
        method: "PATCH",
        body: payload.data
      }),
    }),
    getConnectionRequests: builder.query({
      query: (studentId) => ({
        url: `/students/${studentId}/schools/connectionRequests`,
        method: "GET",
      }),
      providesTags: ["CONNECTION_REQUESTS"],
    }),
    getMessages: builder.query({
      query: ({recruiter_id,school_id, student_id, sender_role}) => ({
        url: `/messages?recruiter_id=${recruiter_id}&school_id=${school_id}&student_id=${student_id}&receiver_role=${sender_role}&recent=true`,
        method: "GET",
      }),
      providesTags: ["MESSAGES"],
    }),
    updateMessages:  builder.mutation({
      query: (payload) => {
        let {studentApi, ...rest} = payload;
        return ({        
            url: `/messages`,
            method: "PATCH",
            body: rest
        })
      },
      invalidatesTags: ["MESSAGES"],
    }),
    updateConnectionRequests: builder.mutation({
      query: (payload) => {
        let {studentApi, ...rest} = payload;
        return ({        
            url: `/students/${payload?.studentId}/schools/connectionRequests`,
            method: "PATCH",
            body: rest
        })
      },
      invalidatesTags: ["CONNECTION_REQUESTS"],
    }),
  }),
});

export const {
  useLazyGetSchoolDataQuery, useLazyGetStudentVitalsQuery, useAddStudentVitalsMutation, useAddStudentSchoolsMutation, useLazyGetStudentSchoolsQuery, useConnectWithRecruiterMutation, useAddStudentMajorsMutation, useLazyGetStudentMajorsQuery, useLazyGetConnectionRequestsQuery, useUpdateConnectionRequestsMutation, useLazyGetMessagesQuery
} = studentApi;
