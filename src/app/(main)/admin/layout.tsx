import AdminSidebar from "@/components/Admin/AdminSidebar";
import Navbar from "@/components/User/Navbar";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid gap-2 grid-cols-[1fr_4fr]">
            <AdminSidebar />
            {children}
        </div>
    );
}

