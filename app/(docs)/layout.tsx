export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="select-none">{children}</div>;
}
