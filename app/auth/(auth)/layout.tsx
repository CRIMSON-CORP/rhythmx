import Icon from "@/components/icon";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Icon
        name="logo"
        width={33}
        height={51}
        className="absolute top-14 left-1/2 -translate-x-1/2 text-brand-orange"
      />
      <main className="min-h-full flex flex-col grow px-5 py-32 bg-white">{children}</main>
    </>
  );
}
