import type { Metadata } from "next";
import { ModeToggle } from "@/components/theme/mode-toggle";

export const metadata: Metadata = {
  title: "Login | Spacall Admin",
  description: "Access the Spacall admin dashboard",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(101,90,255,0.12),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(42,201,255,0.12),transparent_35%)]"
      />
      <div className="absolute right-6 top-6 z-10">
        <ModeToggle />
      </div>
      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
