'use client'
import AdminTableComponent from '@/components/Admin/AdminTable component'
import { Loader } from '@/components/Loader'
import { useGetAllCategoryQuery, useGetAllCategorySoftDeletedQuery } from '@/lib/slices/categorySlice'
import { useGetAllUsersQuery } from '@/lib/slices/usersSlice'
import { ICategory } from '@/models/categoryModel'
import { columType } from '@/types/admintable.types'
import React, { useState } from 'react'

const CategoriesTableComponent = () => {
    const { data: categoriesData, isLoading } = useGetAllCategoryQuery()
    const { data: categoriesSoftData } = useGetAllCategorySoftDeletedQuery()
    const { data: usersData } = useGetAllUsersQuery()
    const [changeTable, setChangeTable] = useState<string>('table')
    let tableProbs: {
        tableName: string;
        rows: string[];
        softrows: string[];
        data: ICategory[];
        softdata: ICategory[];
        columns: columType<ICategory>[];
        softcolumns: columType<ICategory>[];
    } = {
        tableName: 'Categories',
        rows: ['# / ', 'Name / ', 'Color code / ', 'Created At / ', 'Is Custom / ', 'Edit / ', 'Soft Delete / ', 'Delete'],
        softrows: ['# / ', 'Name / ', 'Color code / ', 'Created At / ', 'Is Custom / ', 'Is Reported / ', 'Restore / ', 'Delete'],
        data: categoriesData || [],
        softdata: categoriesSoftData || [],
        columns: [
            { type: "id", getValue: (item: ICategory) => String(item._id) },
            { type: "text", getValue: (item: ICategory) => item.name },
            { type: "color", getValue: (item: ICategory) => item.color },
            { type: "text", getValue: (item: ICategory) => (usersData?.find((user) => String(user._id) == String(item.createdById)))?.username || 'unknown' },
            { type: "text", getValue: (item: ICategory) => item.isCustom ? 'Custom' : 'Not Custom' },
            { type: "categoriesEdit", getValue: (item: ICategory) => 'item', onClick: (item: ICategory) => console.log(item) },
            { type: "categoriesSoftDelete", getValue: (item: ICategory) => 'item', onClick: (item: ICategory) => console.log(item) },
            { type: "categoriesDelete", getValue: (item: ICategory) => 'item', onClick: (item: ICategory) => console.log(item) },
        ],
        softcolumns: [
            { type: "id", getValue: (item: ICategory) => String(item._id) },
            { type: "text", getValue: (item: ICategory) => item.name },
            { type: "color", getValue: (item: ICategory) => item.color },
            { type: "text", getValue: (item: ICategory) => (usersData?.find((user) => String(user._id) == String(item.createdById)))?.username || 'unknown' },
            { type: "text", getValue: (item: ICategory) => item.isCustom ? 'Custom' : 'Not Custom' },
            { type: "categoriesRestore", getValue: (item: ICategory) => 'item', onClick: (item: ICategory) => console.log(item) },
            { type: "categoriesDelete", getValue: (item: ICategory) => 'item', onClick: (item: ICategory) => console.log(item) },
        ],
        // todoListIds: string[],
    }
    return (
        isLoading ? (<Loader />) : (
            changeTable == 'table' ? (
                <AdminTableComponent<ICategory>
                    tableName={tableProbs.tableName}
                    setChangeTable={setChangeTable}
                    changeTable={changeTable}
                    rows={tableProbs.rows}
                    data={tableProbs.data}
                    columns={tableProbs.columns} />
            ) : (
                <AdminTableComponent<ICategory>
                    tableName={tableProbs.tableName}
                    setChangeTable={setChangeTable}
                    changeTable={changeTable}
                    rows={tableProbs.softrows}
                    data={tableProbs.softdata}
                    columns={tableProbs.softcolumns} />
            )
        )
    )
}

export default CategoriesTableComponent