import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface GetAll {
    _id: number;
    createdAt: Date;
    _v: number;
    title: string,
    time: string,
    isSoftDeleted: boolean,
}

export const remindertimeApi = createApi({
    reducerPath: "remindertimeApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/remindertime/",
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
        getAllRemindertime: builder.query<GetAll[], void>({
            query: () => "get/getall",
        }),
        getAllRemindertimeSoftDeleted: builder.query<GetAll[], void>({
            query: () => "get/getallsoftdeleted",
        }),
        getByIdRemindertime: builder.query({
            query: (id) => `get/getbyid/${id}`,
        }),
        // post requests
        postRemindertime: builder.mutation({
            query: (newRemindertime) => ({
                url: 'post',
                method: 'POST',
                body: newRemindertime,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        // put requests
        updateRemindertime: builder.mutation({
            query: (updateRemindertime) => ({
                url: 'put/updateReminderTime',
                method: 'PUT',
                body: updateRemindertime,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        restoreAllRemindertime: builder.mutation({
            query: () => ({
                url: 'put/restoreAll',
                method: 'PUT',
            }),
        }),
        restoreByIdRemindertime: builder.mutation({
            query: (id) => ({
                url: `put/restoreById/${id}`,
                method: 'PUT',
            }),
        }),
        // delete requests
        deleteRemindertime: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE',
            })
        }),
        softDeleteRemindertime: builder.mutation({
            query: (id) => ({
                url: `softdelete/${id}`,
                method: 'DELETE',
            })
        }),
    }),
});

export const {
    useGetAllRemindertimeQuery, useGetAllRemindertimeSoftDeletedQuery, useGetByIdRemindertimeQuery,
    usePostRemindertimeMutation,
    useUpdateRemindertimeMutation, useRestoreAllRemindertimeMutation, useRestoreByIdRemindertimeMutation,
    useDeleteRemindertimeMutation, useSoftDeleteRemindertimeMutation
} = remindertimeApi;
