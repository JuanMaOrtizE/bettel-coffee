import { baseApi } from "../../app/base-api";
import type { AuthResponse } from "./auth.types";
import type { LoginInput } from "./login.schema";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginInput>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),

      invalidatesTags: ["Session"],
    }),

    getMe: builder.query<AuthResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),

      providesTags: ["Session"],
    }),
  }),
});

export const { useGetMeQuery, useLoginMutation } = authApi;
