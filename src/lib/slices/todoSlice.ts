import { ITodo } from "@/models/todoModel";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const todoApi = createApi({
    reducerPath: "todoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/todo/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Todo'],
    endpoints: (builder) => ({
        // get requests
        getAllTodo: builder.query<ITodo[], void>({
            query: () => "get/getall",
            providesTags: ['Todo'],
        }),
        getAllTodoSoftDeleted: builder.query<ITodo[], void>({
            query: () => "get/getallsoftdeleted",
            providesTags: ['Todo'],
        }),
        getByIdTodo: builder.query({
            query: (id) => `get/getbyid/${id}`,
        }),
        getTodoListsTodos: builder.query({
            query: (todolistid) => `get/gettodoliststodos/${todolistid}`,
            providesTags: ['Todo'],
        }),
        // post requests
        postTodo: builder.mutation({
            query: (newTodo) => ({
                url: 'post',
                method: 'POST',
                body: newTodo,
                headers: { 'Content-Type': 'application/json' }
            }),
            invalidatesTags: ['Todo'],
        }),
        // put requests
        updateTodo: builder.mutation({
            query: (updateTodo) => ({
                url: 'put/updateTodo',
                method: 'PUT',
                body: updateTodo,
                headers: { 'Content-Type': 'application/json' }
            }),
            invalidatesTags: ['Todo'],
        }),
        restoreAllTodo: builder.mutation({
            query: () => ({
                url: 'put/restoreAll',
                method: 'PUT',
            }),
            invalidatesTags: ['Todo'],
        }),
        restoreByIdTodo: builder.mutation({
            query: (id) => ({
                url: `put/restoreById/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['Todo'],
        }),
        changeiscompletedTodo: builder.mutation({
            query: (id) => ({
                url: `put/changeiscompleted/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['Todo'],
        }),
        // delete requests
        deleteTodo: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Todo'],
        }),
        softDeleteTodo: builder.mutation({
            query: (id) => ({
                url: `softdelete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Todo'],
        }),
    }),
});

export const {
    useGetAllTodoQuery, useGetAllTodoSoftDeletedQuery, useGetByIdTodoQuery, useGetTodoListsTodosQuery,
    usePostTodoMutation,
    useUpdateTodoMutation, useRestoreAllTodoMutation, useRestoreByIdTodoMutation, useChangeiscompletedTodoMutation,
    useDeleteTodoMutation, useSoftDeleteTodoMutation
} = todoApi;
