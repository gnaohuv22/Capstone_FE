'use client';

import { CalendarCheck2, Clock, GraduationCap, ScrollText } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data - sẽ được thay thế bằng dữ liệu thật từ API
const upcomingClasses = [
  {
    id: 1,
    subject: 'Toán học',
    topic: 'Giải tích - Đạo hàm',
    time: '14:00 - 15:30',
    date: '06/03/2024',
    teacher: 'Nguyễn Văn A'
  },
  {
    id: 2,
    subject: 'Tiếng Anh',
    topic: 'Grammar - Past Perfect',
    time: '16:00 - 17:30',
    date: '06/03/2024',
    teacher: 'Trần Thị B'
  }
];

const upcomingAssignments = [
  {
    id: 1,
    subject: 'Văn học',
    title: 'Phân tích tác phẩm Truyện Kiều',
    dueDate: '08/03/2024',
    status: 'Chưa nộp'
  },
  {
    id: 2,
    subject: 'Hóa học',
    title: 'Bài tập về Hidrocacbon',
    dueDate: '09/03/2024',
    status: 'Đang làm'
  },
  {
    id: 3,
    subject: 'Toán học',
    title: 'Bài tập Đạo hàm',
    dueDate: '10/03/2024',
    status: 'Chưa bắt đầu'
  }
];

const recentActivities = [
  {
    id: 1,
    type: 'assignment',
    subject: 'Vật lý',
    description: 'Đã nộp bài tập "Động năng và Thế năng"',
    time: '2 giờ trước'
  },
  {
    id: 2,
    type: 'class',
    subject: 'Sinh học',
    description: 'Đã tham gia lớp học "Cấu tạo tế bào"',
    time: '4 giờ trước'
  },
  {
    id: 3,
    type: 'material',
    subject: 'Địa lý',
    description: 'Đã tải tài liệu "Địa lý kinh tế Việt Nam"',
    time: '6 giờ trước'
  }
];

export function DashboardContent() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Thống kê tổng quan */}
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Tổng quan</CardTitle>
          <CardDescription>
            Chào mừng bạn quay trở lại! Đây là tổng quan các hoạt động học tập của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lớp học hôm nay</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">4 lớp trong tuần này</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bài tập cần nộp</CardTitle>
                <ScrollText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">2 bài tập sắp đến hạn</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Giờ học tuần này</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12h</div>
                <p className="text-xs text-muted-foreground">Đã hoàn thành 8h</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
                <CalendarCheck2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">89%</div>
                <p className="text-xs text-muted-foreground">Cao hơn tuần trước 5%</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Lớp học sắp diễn ra */}
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Lớp học sắp diễn ra</CardTitle>
          <CardDescription>Lịch học trong ngày</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingClasses.map((class_) => (
              <div key={class_.id} className="flex flex-col space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{class_.subject}</h4>
                  <Badge variant="outline">{class_.time}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{class_.topic}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Giảng viên: {class_.teacher}</span>
                  <span className="text-muted-foreground">{class_.date}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bài tập sắp đến hạn */}
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Bài tập sắp đến hạn</CardTitle>
          <CardDescription>Danh sách bài tập cần hoàn thành</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="flex flex-col space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{assignment.subject}</h4>
                  <Badge 
                    variant={
                      assignment.status === 'Chưa nộp' 
                        ? 'destructive' 
                        : assignment.status === 'Đang làm' 
                        ? 'default' 
                        : 'secondary'
                    }
                  >
                    {assignment.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{assignment.title}</p>
                <div className="flex items-center justify-end text-xs">
                  <span className="text-muted-foreground">Hạn nộp: {assignment.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hoạt động gần đây */}
      <Card className="col-span-full md:col-span-1">
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
          <CardDescription>Các hoạt động học tập của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex flex-col space-y-2 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">{activity.subject}</h4>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}