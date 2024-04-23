import { baseApi } from "../baseApi";

const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolData: builder.query({
      query: ({ states, page, pageSize }) => ({
        url: `/schools?states=${states}&page=${page}&pageSize=${pageSize}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLazyGetSchoolDataQuery
} = studentApi;
