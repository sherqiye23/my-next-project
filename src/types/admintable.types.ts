import { ICategory } from "@/models/categoryModel";
import { IReminderTime } from "@/models/reminderTimeModel";
import { ITodoList } from "@/models/todolistModel";
import { IUser } from "@/models/userModel";

export interface columType<T> {
    type: string;
    getValue: (item: T) => string;
    onClick?: (item: T) => void;
}