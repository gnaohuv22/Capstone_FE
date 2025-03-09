import Link from 'next/link';
import {
  BookOpen,
  FileText,
  GraduationCap,
  Library,
  PanelLeft,
  Settings,
  Users2
} from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import { User } from './user';
import { VercelLogo } from '@/components/icons';
import Providers from './providers';
import { NavItem } from './nav-item';
import { SearchInput } from './search';
import { NotificationsMenu } from './notifications';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

function DesktopNav() {
  return (
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

        <NotificationsMenu />
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="/settings"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Cài đặt</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Cài đặt</TooltipContent>
        </Tooltip>
      </nav>
    </aside>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Mở Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          <Link
            href="/"
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
          <div className="flex items-center gap-4 px-2.5">
            <NotificationsMenu />
            <span className="text-muted-foreground hover:text-foreground">Thông báo</span>
          </div>
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
  );
}

/*
function DashboardBreadcrumb() {
  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="#">Tổng quan</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
  */
