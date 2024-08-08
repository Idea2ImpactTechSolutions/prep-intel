import { baseApi } from "../baseApi";

const assetApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    uploadAsset: builder.mutation({
      query: (bodyContent) => ({
        url: `/assets/`,
        method: "POST",
        body: bodyContent,
        formData: true,
      }),
    }),
    getAssets: builder.query({
      query: ({ userId="", schoolId="", category }) => ({
        url: `/assets?schoolId=${schoolId}&userId=${userId}&category=${category}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useUploadAssetMutation,
  useGetAssetsQuery,
} = assetApi;
