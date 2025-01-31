export default function NarrowLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-center py-6">
      <div className="w-[768px] max-w-[95%] ">{children}</div>
    </div>
  );
}
