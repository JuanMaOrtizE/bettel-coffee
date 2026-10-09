import { baseApi } from "../../app/base-api";
import {
  cafeTablesSchema,
  type CafeTable,
} from "./tables.schema";

export const tablesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTables: builder.query<CafeTable[], void>({
      query: () => ({
        url: "/tables",
        method: "GET",
      }),

      transformResponse: (response: unknown) =>
        cafeTablesSchema.parse(response),

      providesTags: ["Tables"],
    }),
  }),
});

export const { useGetTablesQuery } = tablesApi;
