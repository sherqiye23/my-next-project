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
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    // get requests
    getAllCategory: builder.query<ICategory[], void>({
      query: () => "get/getall",
      providesTags: ['Category'],
    }),
    getAllCategorySoftDeleted: builder.query<ICategory[], void>({
      query: () => "get/getallsoftdeleted",
      providesTags: ['Category'],
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
      invalidatesTags: ['Category'],
    }),
    // put requests
    updateCategory: builder.mutation({
      query: (updateCategory) => ({
        url: 'put/updateCategory',
        method: 'PUT',
        body: updateCategory,
        headers: { 'Content-Type': 'application/json' }
      }),
      invalidatesTags: ['Category'],
    }),
    restoreAllCategory: builder.mutation({
      query: () => ({
        url: 'put/restoreAll',
        method: 'PUT',
      }),
      invalidatesTags: ['Category'],
    }),
    restoreByIdCategory: builder.mutation({
      query: (id) => ({
        url: `put/restoreById/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['Category'],
    }),
    // delete requests
    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    softDeleteCategory: builder.mutation({
      query: (id) => ({
        url: `softdelete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetAllCategoryQuery, useGetAllCategorySoftDeletedQuery, useGetByIdCategoryQuery,
  usePostCategoryMutation,
  useUpdateCategoryMutation, useRestoreAllCategoryMutation, useRestoreByIdCategoryMutation,
  useDeleteCategoryMutation, useSoftDeleteCategoryMutation
} = categoryApi;
