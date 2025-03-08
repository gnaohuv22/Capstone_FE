'use client';

import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// Kiểu dữ liệu cho thông báo
interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Mock data - sau này sẽ được thay thế bằng dữ liệu thật từ API
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Bài tập mới',
    message: 'Bạn có bài tập mới trong khóa học Toán',
    isRead: false,
    createdAt: '2025-03-04T10:00:00Z'
  },
  {
    id: '2',
    title: 'Nhắc nhở deadline',
    message: 'Bài tập Văn sẽ hết hạn trong 2 ngày',
    isRead: false,
    createdAt: '2025-03-04T09:00:00Z'
  },
  {
    id: '3',
    title: 'Thông báo lớp học',
    message: 'Lớp Tiếng Anh sẽ bắt đầu sau 30 phút',
    isRead: true,
    createdAt: '2025-03-04T08:00:00Z'
  }
];

export function NotificationsMenu() {
  // Đếm số thông báo chưa đọc
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  // Format thời gian
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('vi', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Thông báo</p>
            <p className="text-xs text-muted-foreground">
              Bạn có {unreadCount} thông báo chưa đọc
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {mockNotifications.map((notification) => (
          <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-4">
            <div className="flex w-full items-center justify-between">
              <p className="text-sm font-medium leading-none">
                {notification.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatTime(notification.createdAt)}
              </p>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {notification.message}
            </p>
            {!notification.isRead && (
              <Badge variant="secondary" className="mt-1">Chưa đọc</Badge>
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full text-center">
          <Button variant="ghost" className="w-full">
            Xem tất cả thông báo
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 