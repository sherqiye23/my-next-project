import { IUser } from "@/models/userModel";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
    email: string;
    password: string;
    rememberMe: boolean;
}
interface LoginResponse {
    accessToken: string;
}

export const usersApi = createApi({
    reducerPath: "usersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/users/",
        prepareHeaders: (headers) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['User'],
    endpoints: (builder) => ({
        // get requests
        getAllUsers: builder.query<IUser[], void>({
            query: () => "get/getall",
            providesTags: ['User'],
        }),
        getAllFavorites: builder.query({
            query: (id) => `get/getallfavorites/${id}`,
        }),
        getByUsername: builder.query({
            query: (username) => `get/getbyusername?username=${username}`,
        }),
        // post requests
        addToFavorites: builder.mutation<IUser, Partial<IUser>>({
            query: (newFavorites) => ({
                url: 'post/addtofavorites',
                method: 'POST',
                body: newFavorites,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        loginUser: builder.mutation<LoginResponse, LoginRequest>({
            query: (newUser) => ({
                url: 'post/login',
                method: 'POST',
                body: newUser,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: 'post/logout',
                method: 'POST',
            }),
        }),
        sendOtpUser: builder.mutation({
            query: (sendOtp) => ({
                url: 'post/send-otp',
                method: 'POST',
                body: sendOtp,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        verifyOtpUser: builder.mutation({
            query: (verifyOtp) => ({
                url: 'post/verify-otp',
                method: 'POST',
                body: verifyOtp,
            }),
        }),
        resetPasswordUser: builder.mutation({
            query: (newPassword) => ({
                url: 'post/reset-password',
                method: 'POST',
                body: newPassword,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        forgotPasswordSendOtpUser: builder.mutation({
            query: (sendOtp) => ({
                url: 'post/forgot-password-send-otp',
                method: 'POST',
                body: sendOtp,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        forgotPasswordVerifyOtpUser: builder.mutation({
            query: (verifyOtp) => ({
                url: 'post/forgot-password-verify-otp',
                method: 'POST',
                body: verifyOtp,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        // put requests
        updateUser: builder.mutation({
            query: (updateUser) => ({
                url: 'put/updateallinfo',
                method: 'PUT',
                body: updateUser,
            }),
            invalidatesTags: ['User'],
        }),
        updateBannerUser: builder.mutation({
            query: (updateBanner) => ({
                url: 'put/updatebannerimage',
                method: 'PUT',
                body: updateBanner,
            }),
        }),
        updateProfileUser: builder.mutation({
            query: (updateProfile) => ({
                url: 'put/updateprofileimage',
                method: 'PUT',
                body: updateProfile,
            }),
        }),
        updateUsernameUser: builder.mutation({
            query: (updateUsername) => ({
                url: 'put/updateusername',
                method: 'PUT',
                body: updateUsername,
                headers: { 'Content-Type': 'application/json' }
            }),
        }),
        updatePasswordUser: builder.mutation({
            query: ({ userId, oldPassword, newPassword, confirmPassword }) => ({
                url: `put/updatepassword?userId=${userId}&oldPassword=${oldPassword}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`,
                method: 'PUT'
            }),
        }),
        updateRoleUser: builder.mutation({
            query: ({ userId, role }) => ({
                url: `put/updaterole?userId=${userId}&role=${role}`,
                method: 'PUT'
            }),
        }),
        // delete requests
        deleteFromFavoriteUser: builder.mutation({
            query: (deleteFavorites) => ({
                url: `delete/deletefromfavorites`,
                method: 'DELETE',
                body: deleteFavorites,
                headers: { 'Content-Type': 'application/json' }
            })
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `delete/deleteuser/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const {
    useGetAllUsersQuery, useGetAllFavoritesQuery, useGetByUsernameQuery,
    useLoginUserMutation, useLogoutUserMutation, useSendOtpUserMutation, useVerifyOtpUserMutation, useAddToFavoritesMutation, useForgotPasswordSendOtpUserMutation, useForgotPasswordVerifyOtpUserMutation, useResetPasswordUserMutation,
    useUpdateBannerUserMutation, useUpdatePasswordUserMutation, useUpdateProfileUserMutation, useUpdateRoleUserMutation, useUpdateUsernameUserMutation, useUpdateUserMutation,
    useDeleteFromFavoriteUserMutation, useDeleteUserMutation
} = usersApi;