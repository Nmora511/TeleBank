import NavBar from "@/components/UtilComponents/Navbar";

export default function LayoutNavBar({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen text-center">
      <div className="flex-grow">{children}</div>
      <NavBar />
    </div>
  );
}
