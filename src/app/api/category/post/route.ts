import Category from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { userId, name, isCustom, color } = reqBody

        if (!name.trim()) {
            return NextResponse.json({
                message: 'Name is required',
                success: false
            }, { status: 400 });
        }
        if (name.trim().length > 20) {
            return NextResponse.json({
                message: 'Name maximum 20 characters',
                success: false
            }, { status: 400 });
        }

        const findedName = await Category.findOne({ createdById: userId, name })
        const findedCustom = await Category.findOne({ isCustom: false, name })

        if (findedCustom && !findedCustom.isSoftDeleted) {
            return NextResponse.json({
                message: 'Category already created by admin',
                success: false
            }, { status: 400 });
        }

        if (findedName && !findedName.isSoftDeleted) {
            return NextResponse.json({
                message: 'Category already created by you',
                success: false
            }, { status: 400 });
        }

        const newCategory = new Category({
            name,
            isCustom,
            createdById: userId,
            ...(color && { color }),
        })

        const savedCategory = await newCategory.save()

        return NextResponse.json({
            message: 'Category created successfully!',
            success: true,
            savedCategory
        })

    } catch (error: unknown) {
        if (error instanceof mongoose.Error.ValidationError) {
            const errors = Object.values(error.errors).map(el => {
                if (el instanceof mongoose.Error.ValidatorError) {
                    return el.message;
                }
                return 'Validation error';
            });
            return NextResponse.json({ error: errors.join(', ') }, { status: 400 });
        } else if (error instanceof Error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
        }
    }
}