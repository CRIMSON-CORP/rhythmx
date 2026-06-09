import Icon from "@/components/icon";
import { Button } from "@/components/ui/button";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grow max-w-3xl px-5 w-full h-svh mx-auto flex flex-col items-center gap-16 py-16 overflow-auto">
      <Icon name="logo" width={33} height={51} className="text-brand-orange" />
      <header className="flex flex-col items-center text-center gap-1">
        <h1 className="font-medium text-[32px] leading-tight">Terms of Agreement</h1>
        <p className="text-black/50 font-medium">Accept the terms of agreement to continue</p>
      </header>
      <main className="grow overflow-auto rounded-4xl w-full h-full flex -outline-offset-1 outline outline-default-default p-8">
        <div className="grow h-full overflow-auto text-xs font-medium">{children}</div>
      </main>
      <footer className="max-w-xl flex items-center gap-6 w-full">
        <Button rounded={10} variant="outline" className="grow">
          Disagree
        </Button>
        <Button rounded={10} className="grow" variant="blue">
          Agree
        </Button>
      </footer>
    </div>
  );
}

export default Layout;
