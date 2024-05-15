import { baseApi } from "../baseApi";

const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolData: builder.query({
      query: ({ states,searchTerm, page, pageSize }) => ({
        url: `/schools?states=${states}&page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}`,
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
    getStudentRecruiterConnections: builder.query({
      query: (studentId) => ({
        url: `/students/${studentId}/schools?view=connections`,
        method: "GET",
      }),
    }),
    getConnectionRequests: builder.query({
      query: (studentId) => ({
        url: `/students/${studentId}/schools/connectionRequests`,
        method: "GET",
      }),
      providesTags: ["CONNECTION_REQUESTS"],
    }),
    createConnectionRequests: builder.mutation({
      query: (payload) => ({
        url: `/students/${payload.studentId}/schools/connectionRequests`,
        method: "POST",
        body: payload
      }),
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
  useLazyGetSchoolDataQuery,
  useLazyGetStudentVitalsQuery,
  useAddStudentVitalsMutation,
  useAddStudentSchoolsMutation,
  useLazyGetStudentSchoolsQuery,
  useConnectWithRecruiterMutation,
  useAddStudentMajorsMutation,
  useLazyGetStudentMajorsQuery,
  useLazyGetConnectionRequestsQuery,
  useCreateConnectionRequestsMutation,
  useUpdateConnectionRequestsMutation,
  useLazyGetStudentRecruiterConnectionsQuery,
} = studentApi;
