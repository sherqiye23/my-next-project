import { ITodoList } from "@/models/todolistModel";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoListApi = createApi({
    reducerPath: "todoListApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/todolist/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['TodoList'],
    endpoints: (builder) => ({
        // get requests
        getAllTodoList: builder.query<ITodoList[], void>({
            query: () => "get/getall",
            providesTags: ['TodoList'],
        }),
        getAllTodoListSoftDeleted: builder.query<ITodoList[], void>({
            query: () => "get/getallsoftdeleted",
            providesTags: ['TodoList'],
        }),
        getByIdTodoList: builder.query({
            query: (id) => `get/getbyid/${id}`,
        }),
        getUsersTodoList: builder.query({
            query: (username) => `get/getuserstodolists/${username}`,
            providesTags: ['TodoList'],
        }),
        // post requests
        postTodoList: builder.mutation({
            query: (newTodoList) => ({
                url: 'post',
                method: 'POST',
                body: newTodoList,
                headers: { 'Content-Type': 'application/json' }
            }),
            invalidatesTags: ['TodoList'],
        }),
        // put requests
        updateTodoList: builder.mutation({
            query: (updateTodoList) => ({
                url: 'put/updateTodoList',
                method: 'PUT',
                body: updateTodoList,
                headers: { 'Content-Type': 'application/json' }
            }),
            invalidatesTags: ['TodoList'],
        }),
        restoreAllTodoList: builder.mutation({
            query: () => ({
                url: 'put/restoreAll',
                method: 'PUT',
            }),
            invalidatesTags: ['TodoList'],
        }),
        restoreByIdTodoList: builder.mutation({
            query: (id) => ({
                url: `put/restoreById/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['TodoList'],
        }),
        // delete requests
        deleteTodoList: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TodoList'],
        }),
        softDeleteTodoList: builder.mutation({
            query: (id) => ({
                url: `softdelete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TodoList'],
        }),
    }),
});

export const {
    useGetAllTodoListQuery, useGetAllTodoListSoftDeletedQuery, useGetByIdTodoListQuery, useGetUsersTodoListQuery,
    usePostTodoListMutation,
    useUpdateTodoListMutation, useRestoreAllTodoListMutation, useRestoreByIdTodoListMutation,
    useDeleteTodoListMutation, useSoftDeleteTodoListMutation
} = todoListApi;
