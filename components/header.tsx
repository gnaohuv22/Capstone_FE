"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "./user-nav";
import { ThemeToggle } from "./theme-toggle";

// Mock data cho thông báo
const mockNotifications = [
  {
    id: '1',
    title: 'Bài tập mới',
    message: 'Bạn có bài tập mới trong lớp Toán học 10A1',
    isRead: false,
    createdAt: '2024-03-15T08:00:00'
  },
  {
    id: '2',
    title: 'Nhắc nhở thời hạn',
    message: 'Bài tập Vật lý sắp đến hạn nộp',
    isRead: false,
    createdAt: '2024-03-14T10:00:00'
  },
  {
    id: '3',
    title: 'Thông báo lớp học',
    message: 'Lớp Hóa học có thay đổi lịch học',
    isRead: true,
    createdAt: '2024-03-13T14:00:00'
  }
];

export function Header() {
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 justify-center" 
                    variant="destructive"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {mockNotifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-4">
                  <div className="flex w-full items-center justify-between">
                    <span className="font-medium">{notification.title}</span>
                    {!notification.isRead && (
                      <Badge variant="secondary" className="ml-2">Mới</Badge>
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">{notification.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(notification.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="w-full text-center">
                <Button variant="ghost" className="w-full">Xem tất cả thông báo</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <UserNav />
        </div>
      </div>
    </header>
  );
} 