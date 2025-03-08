'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Interface cho dữ liệu lịch học
interface ClassSchedule {
  id: string;
  subject: string;
  topic: string;
  startTime: string;
  endTime: string;
  teacher: string;
  location: string;
  type: 'lecture' | 'practice' | 'exam' | 'meeting';
}

// Mock data cho lịch học
const mockScheduleData: Record<string, ClassSchedule[]> = {
  // Ngày hôm nay
  [new Date().toISOString().split('T')[0]]: [
    {
      id: '1',
      subject: 'Toán học',
      topic: 'Giải tích - Đạo hàm',
      startTime: '08:00',
      endTime: '09:30',
      teacher: 'Nguyễn Văn A',
      location: 'Phòng 101',
      type: 'lecture'
    },
    {
      id: '2',
      subject: 'Vật lý',
      topic: 'Điện từ học',
      startTime: '10:00',
      endTime: '11:30',
      teacher: 'Trần Thị B',
      location: 'Phòng 205',
      type: 'practice'
    }
  ],
  // Ngày mai
  [new Date(Date.now() + 86400000).toISOString().split('T')[0]]: [
    {
      id: '3',
      subject: 'Tiếng Anh',
      topic: 'Grammar - Past Perfect',
      startTime: '14:00',
      endTime: '15:30',
      teacher: 'Lê Thị C',
      location: 'Phòng 302',
      type: 'lecture'
    }
  ],
  // Ngày kia
  [new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]]: [
    {
      id: '4',
      subject: 'Hóa học',
      topic: 'Hóa hữu cơ - Hidrocacbon',
      startTime: '08:00',
      endTime: '10:30',
      teacher: 'Phạm Văn D',
      location: 'Phòng thí nghiệm',
      type: 'practice'
    },
    {
      id: '5',
      subject: 'Lịch sử',
      topic: 'Việt Nam thời kỳ đổi mới',
      startTime: '13:00',
      endTime: '14:30',
      teacher: 'Hoàng Thị E',
      location: 'Phòng 103',
      type: 'lecture'
    }
  ],
  // Một ngày tuần sau
  [new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]]: [
    {
      id: '6',
      subject: 'Toán học',
      topic: 'Kiểm tra giữa kỳ',
      startTime: '08:00',
      endTime: '09:30',
      teacher: 'Nguyễn Văn A',
      location: 'Phòng 101',
      type: 'exam'
    }
  ]
};

// Tên các tháng và ngày trong tuần
const months = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
];
const weekdays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function Schedule() {
  // State cho calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduleForSelectedDate, setScheduleForSelectedDate] = useState<ClassSchedule[]>([]);

  // Lấy ngày đầu tiên của tháng
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  // Lấy ngày cuối cùng của tháng
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  // Lấy số ngày trong tháng
  const daysInMonth = lastDayOfMonth.getDate();
  // Lấy thứ của ngày đầu tiên (0 = Chủ nhật, 1 = Thứ 2, ...)
  const startDay = firstDayOfMonth.getDay();

  // Chuyển đến tháng trước
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Chuyển đến tháng sau
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Kiểm tra nếu một ngày có lịch học
  const hasSchedule = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return mockScheduleData[dateString] && mockScheduleData[dateString].length > 0;
  };

  // Chọn một ngày
  const selectDate = (date: Date) => {
    setSelectedDate(date);
  };

  // Cập nhật lịch học khi ngày được chọn thay đổi
  useEffect(() => {
    const dateString = selectedDate.toISOString().split('T')[0];
    setScheduleForSelectedDate(mockScheduleData[dateString] || []);
  }, [selectedDate]);

  // Tạo các ô ngày cho calendar
  const renderCalendarDays = () => {
    const days = [];
    
    // Thêm các ô trống cho những ngày trước ngày đầu tiên của tháng
    for (let i = 0; i < startDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-10 w-10"></div>
      );
    }
    
    // Thêm các ô cho các ngày trong tháng
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const isToday = new Date().toISOString().split('T')[0] === dateString;
      const isSelected = selectedDate.toISOString().split('T')[0] === dateString;
      const hasClass = hasSchedule(date);
      
      days.push(
        <Button
          key={day}
          variant="ghost"
          className={`h-10 w-10 p-0 ${isSelected ? 'bg-primary text-primary-foreground' : ''} ${isToday && !isSelected ? 'border border-primary' : ''}`}
          onClick={() => selectDate(date)}
        >
          <div className="relative flex h-full w-full items-center justify-center">
            {day}
            {hasClass && !isSelected && (
              <div className="absolute bottom-1 h-1 w-1 rounded-full bg-primary"></div>
            )}
          </div>
        </Button>
      );
    }
    
    return days;
  };

  // Get formatted date string (VD: "Thứ 2, 06/03/2024")
  const getFormattedDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const weekday = weekdays[date.getDay()];
    return `${weekday}, ${day}/${month}/${date.getFullYear()}`;
  };

  // Hiển thị badge theo loại lớp học
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case 'lecture':
        return <Badge variant="default">Lý thuyết</Badge>;
      case 'practice':
        return <Badge variant="secondary">Thực hành</Badge>;
      case 'exam':
        return <Badge variant="destructive">Kiểm tra</Badge>;
      case 'meeting':
        return <Badge variant="outline">Hội thảo</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-7 lg:grid-cols-4">
        {/* Calendar View */}
        <Card className="md:col-span-3 lg:col-span-1">
          <CardHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="grid grid-cols-7 gap-2 text-center text-xs mb-2">
              {weekdays.map((day) => (
                <div key={day} className="font-medium">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {renderCalendarDays()}
            </div>
          </CardContent>
        </Card>

        {/* Lịch học của ngày được chọn */}
        <Card className="md:col-span-4 lg:col-span-3">
          <CardHeader className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Lịch học</CardTitle>
                <CardDescription>{getFormattedDate(selectedDate)}</CardDescription>
              </div>
              {scheduleForSelectedDate.length > 0 && (
                <Badge variant="outline">{scheduleForSelectedDate.length} buổi học</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            {scheduleForSelectedDate.length > 0 ? (
              <div className="space-y-4">
                {scheduleForSelectedDate.map((schedule) => (
                  <div 
                    key={schedule.id} 
                    className="flex flex-col space-y-2 rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{schedule.subject}</h4>
                        {renderTypeBadge(schedule.type)}
                      </div>
                      <Badge variant="outline">
                        {schedule.startTime} - {schedule.endTime}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{schedule.topic}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{schedule.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{schedule.startTime} - {schedule.endTime}</span>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Giảng viên: {schedule.teacher}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm font-medium">Không có lịch học nào</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Bạn không có buổi học nào vào ngày này.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 