import Navbar from "@/components/User/Navbar";

export default function MainAppLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            <main className="pt-[80px] mx-auto my-0 max-w-[1350px]">
                {children}
            </main>
        </>
    );
}
