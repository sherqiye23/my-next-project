import { ICategory } from "@/models/categoryModel";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/category/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // get requests
    getAllCategory: builder.query<ICategory[], void>({
      query: () => "get/getall",
    }),
    getAllCategorySoftDeleted: builder.query<ICategory[], void>({
      query: () => "get/getallsoftdeleted",
    }),
    getByIdCategory: builder.query({
      query: (id) => `get/getbyid/${id}`,
    }),
    // post requests
    postCategory: builder.mutation({
      query: (newCategory) => ({
        url: 'post',
        method: 'POST',
        body: newCategory,
        headers: { 'Content-Type': 'application/json' }
      }),
    }),
    // put requests
    updateCategory: builder.mutation({
      query: (updateCategory) => ({
        url: 'put/updateCategory',
        method: 'PUT',
        body: updateCategory,
        headers: { 'Content-Type': 'application/json' }
      }),
    }),
    restoreAllCategory: builder.mutation({
      query: () => ({
        url: 'put/restoreAll',
        method: 'PUT',
      }),
    }),
    restoreByIdCategory: builder.mutation({
      query: (id) => ({
        url: `put/restoreById/${id}`,
        method: 'PUT',
      }),
    }),
    // delete requests
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `delete/${id}`,
        method: 'DELETE',
      })
    }),
    softDeleteCategory: builder.mutation({
      query: (id) => ({
        url: `softdelete/${id}`,
        method: 'DELETE',
      })
    }),
  }),
});

export const {
  useGetAllCategoryQuery, useGetAllCategorySoftDeletedQuery, useGetByIdCategoryQuery,
  usePostCategoryMutation,
  useUpdateCategoryMutation, useRestoreAllCategoryMutation, useRestoreByIdCategoryMutation,
  useDeleteCategoryMutation, useSoftDeleteCategoryMutation
} = categoryApi;
