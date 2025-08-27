import AdminSidebar from "@/components/Admin/AdminSidebar";
import Navbar from "@/components/User/Navbar";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {/* <Navbar /> */}
            <AdminSidebar />
            {children}
        </>
    );
}

