import { ErrorResponseData } from "@/types/catchError.types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import toast from "react-hot-toast";

type MyPropsType = {
    myFunction: () => Promise<void>;
}

export async function RequestFunction({ myFunction }: MyPropsType) {
    try {
        await myFunction()
    } catch (error) {
        const err = error as FetchBaseQueryError;
        console.log("Change failed: ", err);

        if ("data" in err && err.data) {
            const serverData = err.data as ErrorResponseData;
            toast.error(serverData.message || serverData.error || "Something went wrong");
        } else {
            toast.error("Network or unexpected error");
        }
    }
}