import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type Props = {
    name: string;
    value: Date | undefined;
    setFieldValue: (field: string, value: any) => void;
};

export default function SelectDate({ name, value, setFieldValue }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="input input-bordered w-full cursor-pointer"
            >
                {value ? value.toLocaleDateString() : "Pick a date"}
            </button>

            {open && (
                <div className="absolute z-50 mt-2 bg-base-100 rounded-box shadow-lg p-2">
                    <DayPicker
                        mode="single"
                        selected={value}
                        onSelect={(d) => {
                            setFieldValue(name, d);
                            setOpen(false);
                        }}
                    />
                </div>
            )}
        </div>
    );
}
