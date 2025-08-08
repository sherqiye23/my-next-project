import Category from "@/models/categoryModel";
import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

export async function PUT(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { userId, name, categoryId, color } = reqBody

        const trimmedName = name.trim();

        if (!trimmedName) {
            return NextResponse.json({
                message: 'Name is required',
                success: false
            }, { status: 400 });
        }
        if (trimmedName.length > 20) {
            return NextResponse.json({
                message: 'Name maximum 20 characters',
                success: false
            }, { status: 400 });
        }

        const existing = await Category.findOne({ name: trimmedName, createdById: userId });
        if (existing && existing._id.toString() !== categoryId) {
            return NextResponse.json({
                message: "This name already exists",
                success: false
            }, { status: 400 });
        }

        const findedCategory = await Category.findById(categoryId);
        if (!findedCategory) {
            return NextResponse.json({
                message: 'Category is not found',
                success: false
            }, { status: 404 });
        }

        if (findedCategory.isSoftDeleted) {
            return NextResponse.json({
                message: 'Category is soft deleted',
                success: false
            }, { status: 400 });
        }

        await Category.findByIdAndUpdate(categoryId, {
            name: trimmedName,
            ...(color && { color })
        });

        return NextResponse.json({
            message: 'Category updated successfully!',
            success: true
        });

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