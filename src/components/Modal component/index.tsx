import React, { useEffect } from "react";

type ModalProps = {
    id: string;
    title?: string;
    onClose?: () => void;
    children: React.ReactNode;
};

export default function ModalComponent({ id, title, onClose, children }: ModalProps) {
    useEffect(() => {
        const dialog = document.getElementById(id) as HTMLDialogElement | null;
        if (!dialog || !onClose) return;

        dialog.addEventListener("close", onClose);
        return () => dialog.removeEventListener("close", onClose);
    }, [id, onClose]);

    return (
        <dialog id={id} className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                </form>
                {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
                {children}
            </div>
        </dialog>
    );
}
