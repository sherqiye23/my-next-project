import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface GetAll {
  _id: number;
  name: string;
  createdById: string;
  isCustom: boolean;
  isSoftDeleted: boolean;
  todoListIds: string[];
  color: string;
  createdAt: Date;
  _v: number;
}

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/category/" }),
  endpoints: (builder) => ({
    getAllCategory: builder.query<GetAll[], void>({
      query: () => "/get/getall",
    }),
  }),
});

export const { useGetAllCategoryQuery } = categoryApi;
