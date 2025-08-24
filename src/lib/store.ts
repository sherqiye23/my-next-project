import { configureStore } from '@reduxjs/toolkit'
import { categoryApi } from './slices/categorySlice'
import { usersApi } from './slices/usersSlice';
import { remindertimeApi } from './slices/remindertimeSlice';
import { todoListApi } from './slices/todolistSlice';
import { todoApi } from './slices/todoSlice';

export const store = configureStore({
    reducer: {
        [categoryApi.reducerPath]: categoryApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [remindertimeApi.reducerPath]: remindertimeApi.reducer,
        [todoListApi.reducerPath]: todoListApi.reducer,
        [todoApi.reducerPath]: todoApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            categoryApi.middleware,
            usersApi.middleware,
            remindertimeApi.middleware,
            todoListApi.middleware,
            todoApi.middleware,
        ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
