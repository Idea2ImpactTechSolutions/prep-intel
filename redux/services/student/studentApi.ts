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
    addStudentSchools: builder.mutation({
      query: (payload) => ({
        url: `/students/${payload.studentId}/schools`,
        method: "POST",
        body: payload.data
      }),
    }),
  }),
});

export const {
  useLazyGetSchoolDataQuery, useLazyGetStudentVitalsQuery, useAddStudentVitalsMutation, useAddStudentSchoolsMutation
} = studentApi;
