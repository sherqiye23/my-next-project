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
    endpoints: (builder) => ({
        // get requests
        getAllTodo: builder.query<ITodo[], void>({
            query: () => "get/getall",
        }),
        getAllTodoSoftDeleted: builder.query<ITodo[], void>({
            query: () => "get/getallsoftdeleted",
        }),
        getByIdTodo: builder.query({
            query: (id) => `get/getbyid/${id}`,
        }),
        // post requests
        postTodo: builder.mutation({
            query: (newTodo) => ({
                url: 'post',
                method: 'POST',
                body: newTodo,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        // put requests
        updateTodo: builder.mutation({
            query: (updateTodo) => ({
                url: 'put/updateTodo',
                method: 'PUT',
                body: updateTodo,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        restoreAllTodo: builder.mutation({
            query: () => ({
                url: 'put/restoreAll',
                method: 'PUT',
            }),
        }),
        restoreByIdTodo: builder.mutation({
            query: (id) => ({
                url: `put/restoreById/${id}`,
                method: 'PUT',
            }),
        }),
        changeiscompletedTodo: builder.mutation({
            query: (id) => ({
                url: `put/changeiscompleted/${id}`,
                method: 'PUT',
            }),
        }),
        // delete requests
        deleteTodo: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE',
            })
        }),
        softDeleteTodo: builder.mutation({
            query: (id) => ({
                url: `softdelete/${id}`,
                method: 'DELETE',
            })
        }),
    }),
});

export const {
    useGetAllTodoQuery, useGetAllTodoSoftDeletedQuery, useGetByIdTodoQuery,
    usePostTodoMutation,
    useUpdateTodoMutation, useRestoreAllTodoMutation, useRestoreByIdTodoMutation, useChangeiscompletedTodoMutation,
    useDeleteTodoMutation, useSoftDeleteTodoMutation
} = todoApi;
