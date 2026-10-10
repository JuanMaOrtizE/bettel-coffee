import { baseApi } from "../../app/base-api";
import type { AuthResponse } from "./auth.types";
import type { LoginCredentials } from "./login.schema";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
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

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),

      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch {
          // La interfaz conserva la sesión visible y muestra el error.
        }
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
