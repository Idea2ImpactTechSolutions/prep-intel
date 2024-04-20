import { baseApi } from "../baseApi";

const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSchoolData: builder.query({
      query: (states) => ({
        url: `/manager/profile/ic-directory?states=${states}`,
        method: "GET",
      }),
    }),    
  }),
});

export const {
  useLazyGetSchoolDataQuery
} = studentApi;
