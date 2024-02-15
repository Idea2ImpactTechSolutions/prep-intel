import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { reset } from "../features/auth/authSlice";
import { clearStorageItem } from "@/utils/hooks/useLocalStorage";

export const baseQuery = fetchBaseQuery({
  baseUrl: `/api`,
  prepareHeaders: (headers) => {
    const accessToken: string = Cookies.get("token") || "";
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    return headers;
  },
});

export const baseQueryInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result: any = await baseQuery(args, api, extraOptions);
  
  if (result.error) {
      let res: any = result.error
      if (res.status === 403) {
          api.dispatch(reset())
          Cookies.remove('token');
          clearStorageItem()
          window.location.href = '/';
      }
      if (res.status === 401) {
          let message = Array?.isArray(res?.data?.error?.message)
          ? res.data.error.message[0]
          : res.data.message
          toast.error(message);
      }
      if (res.status === 404) {
          let message = res.data.message
          toast.error(message);
      }
      if (res.status === 422) {
          let message = Array?.isArray(res?.data?.message)
          ? res.data.message[0]
          : res.data.message
          toast.error(message);
      }

      if (res.status === 503) {
          let message = res.data.error.message
          toast.error(message)
      }

      if (res.status_code === 503) {
          let message = res.data.error.message
          toast.error(message);
      }

      if (res.status === 500) {
          let message = res.data.error.message
          toast.error(message)
      }

      if (res.status === 400) {
          let message = res.data.message
          toast.error(message)
      }
      if (res.status === 429) {
          let message = res.data.message
          toast.error(message)
      }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryInterceptor,
  endpoints: () => ({}),
  reducerPath: "baseApi",
  // tagTypes: [""],
});
