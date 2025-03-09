'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  CheckSquare,
  Settings
} from 'lucide-react';

// Mock data cho chi tiết lớp học
const mockClassDetail = {
  id: 1,
  name: 'Toán học 10A1',
  subject: 'Toán',
  teacher: 'Nguyễn Văn A',
  schedule: 'Thứ 2, 4, 6',
  time: '7:00 - 8:30',
  totalStudents: 35,
  currentUnit: 'Chương 3: Hàm số bậc nhất',
  nextClass: '2024-03-20T07:00:00',
  status: 'active',
  code: 'MATH10A1',
  description: 'Lớp học dành cho học sinh khối 10, tập trung vào các kiến thức cơ bản và nâng cao về Toán học.',
  announcements: [
    {
      id: 1,
      title: 'Thông báo kiểm tra giữa kỳ',
      content: 'Kiểm tra giữa kỳ sẽ diễn ra vào ngày 25/03/2024. Nội dung từ chương 1 đến chương 3.',
      date: '2024-03-15T08:00:00',
      isImportant: true
    },
    {
      id: 2,
      title: 'Thay đổi lịch học',
      content: 'Lớp học ngày 20/03 sẽ được dời sang 21/03 do trùng với hoạt động của trường.',
      date: '2024-03-14T10:00:00',
      isImportant: true
    },
    {
      id: 3,
      title: 'Tài liệu ôn tập',
      content: 'Đã cập nhật tài liệu ôn tập cho bài kiểm tra sắp tới.',
      date: '2024-03-13T14:00:00',
      isImportant: false
    },
    {
      id: 4,
      title: 'Nhắc nhở về bài tập',
      content: 'Các em nhớ hoàn thành bài tập về nhà trước buổi học tới.',
      date: '2024-03-12T09:00:00',
      isImportant: false
    },
    {
      id: 5,
      title: 'Kết quả kiểm tra',
      content: 'Đã cập nhật điểm kiểm tra của tuần trước.',
      date: '2024-03-11T16:00:00',
      isImportant: false
    },
    {
      id: 6,
      title: 'Thông báo nghỉ lễ',
      content: 'Lịch nghỉ lễ sắp tới của lớp.',
      date: '2024-03-10T11:00:00',
      isImportant: true
    },
    {
      id: 7,
      title: 'Cập nhật nội dung học',
      content: 'Điều chỉnh một số nội dung trong chương trình học.',
      date: '2024-03-09T13:00:00',
      isImportant: false
    },
    {
      id: 8,
      title: 'Thông báo họp phụ huynh',
      content: 'Lịch họp phụ huynh học kỳ 2.',
      date: '2024-03-08T08:00:00',
      isImportant: true
    },
    {
      id: 9,
      title: 'Kế hoạch ôn tập',
      content: 'Kế hoạch ôn tập cho kỳ thi sắp tới.',
      date: '2024-03-07T15:00:00',
      isImportant: false
    },
    {
      id: 10,
      title: 'Thông báo về CLB Toán',
      content: 'Thông tin về câu lạc bộ Toán học.',
      date: '2024-03-06T10:00:00',
      isImportant: false
    }
  ],
  assignments: [
    {
      id: 1,
      title: 'Bài tập về nhà - Chương 3',
      content: 'Hoàn thành các bài tập từ trang 45-47.',
      dueDate: '2024-03-22T23:59:59',
      status: 'pending',
      isImportant: true
    },
    {
      id: 2,
      title: 'Bài tập nhóm - Đồ án',
      content: 'Thực hiện đồ án nhóm về ứng dụng hàm số.',
      dueDate: '2024-03-25T23:59:59',
      status: 'pending',
      isImportant: true
    },
    {
      id: 3,
      title: 'Bài tập về nhà - Chương 2',
      content: 'Hoàn thành các bài tập từ trang 30-32.',
      dueDate: '2024-03-15T23:59:59',
      status: 'completed',
      isImportant: false
    }
  ],
  materials: [
    {
      id: 1,
      title: 'Tài liệu chương 3 - Hàm số bậc nhất',
      type: 'pdf',
      uploadDate: '2024-03-15T10:00:00'
    }
  ],
  students: [
    {
      id: 1,
      name: 'Nguyễn Văn X',
      avatar: '/avatars/student1.jpg'
    }
    // Thêm danh sách học sinh
  ]
};

export default function ClassDetailPage() {
  const params = useParams();
  const classId = params.id;
  const [visibleAnnouncements, setVisibleAnnouncements] = useState(5);
  const [visibleAssignments, setVisibleAssignments] = useState(3);

  const loadMoreAnnouncements = () => {
    setVisibleAnnouncements(prev => Math.min(prev + 5, mockClassDetail.announcements.length));
  };

  const loadMoreAssignments = () => {
    setVisibleAssignments(prev => Math.min(prev + 3, mockClassDetail.assignments.length));
  };

  const now = new Date();
  const recentAnnouncements = mockClassDetail.announcements
    .filter(a => new Date(a.date) >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) || a.isImportant);
  const olderAnnouncements = mockClassDetail.announcements
    .filter(a => new Date(a.date) < new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) && !a.isImportant);

  const activeAssignments = mockClassDetail.assignments
    .filter(a => new Date(a.dueDate) >= now || a.status === 'pending');
  const completedAssignments = mockClassDetail.assignments
    .filter(a => new Date(a.dueDate) < now || a.status === 'completed');

  // Trong thực tế, sẽ fetch dữ liệu từ API dựa vào classId
  const classDetail = mockClassDetail;

  const getNextClassStatus = (nextClass: string) => {
    const now = new Date();
    const next = new Date(nextClass);
    const diffHours = (next.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 0) return { text: 'Đã kết thúc', color: 'text-gray-500' };
    if (diffHours <= 24) return { text: 'Sắp diễn ra', color: 'text-green-500' };
    return { text: 'Sắp tới', color: 'text-blue-500' };
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">{classDetail.name}</h2>
            <p className="text-muted-foreground">{classDetail.description}</p>
          </div>
          <Badge variant="outline" className={getNextClassStatus(classDetail.nextClass).color}>
            {getNextClassStatus(classDetail.nextClass).text}
          </Badge>
        </div>

        {/* Thông tin cơ bản */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Giáo viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classDetail.teacher}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lịch học</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classDetail.schedule}</div>
              <p className="text-xs text-muted-foreground">{classDetail.time}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Số học sinh</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classDetail.totalStudents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mã lớp</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{classDetail.code}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="announcements" className="space-y-4">
          <TabsList>
            <TabsTrigger value="announcements" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Thông báo
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4" />
              Bài tập
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Tài liệu
            </TabsTrigger>
            <TabsTrigger value="students" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Học sinh
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Cài đặt
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="space-y-4">
            <div className="space-y-4">
              {recentAnnouncements.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold">Thông báo mới & quan trọng</h3>
                  {recentAnnouncements.slice(0, visibleAnnouncements).map((announcement) => (
                    <Card key={announcement.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            {announcement.title}
                            {announcement.isImportant && (
                              <Badge variant="destructive">Quan trọng</Badge>
                            )}
                          </CardTitle>
                          <span className="text-sm text-muted-foreground">
                            {new Date(announcement.date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{announcement.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {olderAnnouncements.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mt-6">Thông báo cũ hơn</h3>
                  {olderAnnouncements.slice(0, visibleAnnouncements).map((announcement) => (
                    <Card key={announcement.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{announcement.title}</CardTitle>
                          <span className="text-sm text-muted-foreground">
                            {new Date(announcement.date).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p>{announcement.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {visibleAnnouncements < mockClassDetail.announcements.length && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={loadMoreAnnouncements}>
                    Xem thêm thông báo
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-4">
            <div className="space-y-4">
              {activeAssignments.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold">Bài tập đang thực hiện</h3>
                  {activeAssignments.slice(0, visibleAssignments).map((assignment) => (
                    <Card key={assignment.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            {assignment.title}
                            {assignment.isImportant && (
                              <Badge variant="destructive">Quan trọng</Badge>
                            )}
                          </CardTitle>
                          <Badge variant={assignment.status === 'pending' ? 'secondary' : 'default'}>
                            {assignment.status === 'pending' ? 'Chưa nộp' : 'Đã nộp'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Hạn nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{assignment.content}</p>
                        <Button variant="outline">Xem chi tiết</Button>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {completedAssignments.length > 0 && (
                <>
                  <h3 className="text-lg font-semibold mt-6">Bài tập đã hoàn thành</h3>
                  {completedAssignments.slice(0, visibleAssignments).map((assignment) => (
                    <Card key={assignment.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{assignment.title}</CardTitle>
                          <Badge variant="default">Đã nộp</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Đã nộp: {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-4">{assignment.content}</p>
                        <Button variant="outline">Xem chi tiết</Button>
                      </CardContent>
                    </Card>
                  ))}
                </>
              )}

              {visibleAssignments < mockClassDetail.assignments.length && (
                <div className="flex justify-center mt-4">
                  <Button variant="outline" onClick={loadMoreAssignments}>
                    Xem thêm bài tập
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="materials" className="space-y-4">
            {classDetail.materials.map((material) => (
              <Card key={material.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{material.title}</CardTitle>
                    <Badge>{material.type.toUpperCase()}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ngày đăng: {new Date(material.uploadDate).toLocaleDateString('vi-VN')}
                  </p>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">Tải xuống</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {classDetail.students.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200" />
                      <div>
                        <CardTitle className="text-sm">{student.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt lớp học</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline">Chỉnh sửa thông tin</Button>
                  <Button variant="destructive">Rời lớp học</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 