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
    endpoints: (builder) => ({
        // get requests
        getAllTodoList: builder.query<ITodoList[], void>({
            query: () => "get/getall",
        }),
        getAllTodoListSoftDeleted: builder.query<ITodoList[], void>({
            query: () => "get/getallsoftdeleted",
        }),
        getByIdTodoList: builder.query({
            query: (id) => `get/getbyid/${id}`,
        }),
        // post requests
        postTodoList: builder.mutation({
            query: (newTodoList) => ({
                url: 'post',
                method: 'POST',
                body: newTodoList,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        // put requests
        updateTodoList: builder.mutation({
            query: (updateTodoList) => ({
                url: 'put/updateTodoList',
                method: 'PUT',
                body: updateTodoList,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        restoreAllTodoList: builder.mutation({
            query: () => ({
                url: 'put/restoreAll',
                method: 'PUT',
            }),
        }),
        restoreByIdTodoList: builder.mutation({
            query: (id) => ({
                url: `put/restoreById/${id}`,
                method: 'PUT',
            }),
        }),
        // delete requests
        deleteTodoList: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE',
            })
        }),
        softDeleteTodoList: builder.mutation({
            query: (id) => ({
                url: `softdelete/${id}`,
                method: 'DELETE',
            })
        }),
    }),
});

export const {
    useGetAllTodoListQuery, useGetAllTodoListSoftDeletedQuery, useGetByIdTodoListQuery,
    usePostTodoListMutation,
    useUpdateTodoListMutation, useRestoreAllTodoListMutation, useRestoreByIdTodoListMutation,
    useDeleteTodoListMutation, useSoftDeleteTodoListMutation
} = todoListApi;
