import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Chance Raffle",
  description: "Manage your Chance Raffle entries and settings",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--muted)' }}>
      {children}
    </div>
  );
}
