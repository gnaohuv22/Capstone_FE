"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    FileText,
    GraduationCap,
    LayoutDashboard,
    Library,
    Settings,
    Users2,
    Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";

// NavItem component cho sidebar desktop
function NavItem({
    href,
    label,
    children
}: {
    href: string;
    label: string;
    children: React.ReactNode
}) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={href}
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg transition-all md:h-8 md:w-8",
                            isActive
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        <div className={cn(
                            "transition-transform duration-200",
                            isActive ? "" : "group-hover:scale-110"
                        )}>
                            {children}
                        </div>
                        <span className="sr-only">{label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="z-50">{label}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

export function Sidebar() {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Nav Button */}
            <div className="fixed top-3 left-3 z-50 block sm:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" className="h-10 w-10 rounded-lg bg-background shadow-md border">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Mở Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link
                                href="/dashboard"
                                className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                            >
                                <GraduationCap className="h-5 w-5 transition-all group-hover:scale-110" />
                                <span className="sr-only">E-Learning Platform</span>
                            </Link>
                            <Link
                                href="/classes"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <BookOpen className="h-5 w-5" />
                                Lớp học
                            </Link>
                            <Link
                                href="/assignments"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <FileText className="h-5 w-5" />
                                Bài tập
                            </Link>
                            <Link
                                href="/resources"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <Library className="h-5 w-5" />
                                Tài nguyên
                            </Link>
                            <Link
                                href="/students"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <Users2 className="h-5 w-5" />
                                Học viên
                            </Link>
                            <Link
                                href="/settings"
                                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                            >
                                <Settings className="h-5 w-5" />
                                Cài đặt
                            </Link>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                    <Link
                        href="/dashboard"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <GraduationCap className="h-5 w-5 transition-all group-hover:scale-110" />
                        <span className="sr-only">E-Learning Platform</span>
                    </Link>

                    <NavItem href="/classes" label="Lớp học">
                        <BookOpen className="h-5 w-5" />
                    </NavItem>

                    <NavItem href="/assignments" label="Bài tập">
                        <FileText className="h-5 w-5" />
                    </NavItem>

                    <NavItem href="/resources" label="Tài nguyên">
                        <Library className="h-5 w-5" />
                    </NavItem>

                    <NavItem href="/students" label="Học viên">
                        <Users2 className="h-5 w-5" />
                    </NavItem>
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                    <NavItem href="/settings" label="Cài đặt">
                        <Settings className="h-5 w-5" />
                    </NavItem>
                </nav>
            </aside>
        </>
    );
} 