'use client';

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { usePathname } from "next/navigation";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Kiểm tra nếu đường dẫn hiện tại là trang public
  const isPublicPage = pathname === "/" || // Splash screen
                      pathname === "/login" || // Login page
                      pathname === "/register" || // Register page
                      pathname?.startsWith("/auth") || // Other auth pages
                      pathname?.includes("/(marketing)"); // Marketing pages

  return (
    <Providers>
      {isPublicPage ? (
        // Các trang công khai không cần sidebar và header
        <div className="min-h-screen w-full">
          {children}
        </div>
      ) : (
        // Các trang yêu cầu đăng nhập sẽ hiển thị sidebar và header
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <Sidebar />
          <div className="flex flex-col sm:pl-14">
            <Header />
            <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 md:gap-4">
              {children}
            </main>
          </div>
        </div>
      )}
    </Providers>
  );
} 