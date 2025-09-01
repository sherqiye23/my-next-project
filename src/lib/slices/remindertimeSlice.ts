import { IReminderTime } from "@/models/reminderTimeModel";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
    tagTypes: ['ReminderTime'],
    endpoints: (builder) => ({
        // get requests
        getAllRemindertime: builder.query<IReminderTime[], void>({
            query: () => "get/getall",
            providesTags: ['ReminderTime'],
        }),
        getAllRemindertimeSoftDeleted: builder.query<IReminderTime[], void>({
            query: () => "get/getallsoftdeleted",
            providesTags: ['ReminderTime'],
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
            invalidatesTags: ['ReminderTime'],
        }),
        // put requests
        updateRemindertime: builder.mutation({
            query: (updateRemindertime) => ({
                url: 'put/updateReminderTime',
                method: 'PUT',
                body: updateRemindertime,
                headers: { 'Content-Type': 'application/json' }
            }),
            invalidatesTags: ['ReminderTime'],
        }),
        restoreAllRemindertime: builder.mutation({
            query: () => ({
                url: 'put/restoreAll',
                method: 'PUT',
            }),
            invalidatesTags: ['ReminderTime'],
        }),
        restoreByIdRemindertime: builder.mutation({
            query: (id) => ({
                url: `put/restoreById/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['ReminderTime'],
        }),
        // delete requests
        deleteRemindertime: builder.mutation({
            query: (id) => ({
                url: `delete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ReminderTime'],
        }),
        softDeleteRemindertime: builder.mutation({
            query: (id) => ({
                url: `softdelete/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['ReminderTime'],
        }),
    }),
});

export const {
    useGetAllRemindertimeQuery, useGetAllRemindertimeSoftDeletedQuery, useGetByIdRemindertimeQuery,
    usePostRemindertimeMutation,
    useUpdateRemindertimeMutation, useRestoreAllRemindertimeMutation, useRestoreByIdRemindertimeMutation,
    useDeleteRemindertimeMutation, useSoftDeleteRemindertimeMutation
} = remindertimeApi;
