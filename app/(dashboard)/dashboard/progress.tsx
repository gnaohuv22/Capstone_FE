'use client';

import { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Interface cho dữ liệu tiến độ học tập
interface ProgressData {
  date: string;
  minutesStudied: number;
  completedTasks: number;
  totalTasks: number;
}

interface CourseProgress {
  id: string;
  name: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastActivity: string;
}

// Mock data cho tiến độ học tập
const mockProgressData: ProgressData[] = [
  // Dữ liệu 30 ngày gần đây
  ...Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      minutesStudied: Math.floor(Math.random() * 180) + 30, // 30-210 phút
      completedTasks: Math.floor(Math.random() * 5), // 0-4 nhiệm vụ
      totalTasks: Math.floor(Math.random() * 3) + 5, // 5-7 nhiệm vụ
    };
  }),
];

// Mock data cho khóa học
const mockCourseProgress: CourseProgress[] = [
  {
    id: '1',
    name: 'Toán học - Đại số',
    progress: 75,
    totalLessons: 20,
    completedLessons: 15,
    lastActivity: '2 ngày trước'
  },
  {
    id: '2',
    name: 'Vật lý - Cơ học',
    progress: 60,
    totalLessons: 15,
    completedLessons: 9,
    lastActivity: '1 ngày trước'
  },
  {
    id: '3',
    name: 'Hóa học - Hữu cơ',
    progress: 40,
    totalLessons: 25,
    completedLessons: 10,
    lastActivity: '4 ngày trước'
  },
  {
    id: '4',
    name: 'Tiếng Anh - Grammar',
    progress: 90,
    totalLessons: 10,
    completedLessons: 9,
    lastActivity: 'hôm nay'
  }
];

export function Progress() {
  const [timeRange, setTimeRange] = useState('7days');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  // Lọc dữ liệu theo time range
  const getFilteredData = () => {
    let filteredData = [...mockProgressData];
    
    if (timeRange === '7days') {
      filteredData = filteredData.slice(-7);
    } else if (timeRange === '14days') {
      filteredData = filteredData.slice(-14);
    } else if (timeRange === '30days') {
      filteredData = filteredData.slice(-30);
    } else if (timeRange === 'custom') {
      filteredData = filteredData.filter(
        (item) => item.date >= dateRange.from && item.date <= dateRange.to
      );
    }
    
    return filteredData;
  };

  // Tính toán các chỉ số tổng hợp
  const calculateStats = (data: ProgressData[]) => {
    const totalMinutes = data.reduce((sum, item) => sum + item.minutesStudied, 0);
    const totalCompletedTasks = data.reduce((sum, item) => sum + item.completedTasks, 0);
    const totalTasks = data.reduce((sum, item) => sum + item.totalTasks, 0);
    const completionRate = totalTasks > 0 ? (totalCompletedTasks / totalTasks) * 100 : 0;
    
    return {
      totalMinutes,
      totalCompletedTasks,
      completionRate: Math.round(completionRate)
    };
  };

  const filteredData = getFilteredData();
  const stats = calculateStats(filteredData);

  // Toggle course selection
  const toggleCourse = (courseId: string) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter(id => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Bộ lọc */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Bộ lọc</CardTitle>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Lọc</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Chọn khoảng thời gian */}
            <div>
              <label className="text-sm font-medium mb-2 block">Khoảng thời gian</label>
              <Select 
                value={timeRange} 
                onValueChange={setTimeRange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khoảng thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 ngày gần đây</SelectItem>
                  <SelectItem value="14days">14 ngày gần đây</SelectItem>
                  <SelectItem value="30days">30 ngày gần đây</SelectItem>
                  <SelectItem value="custom">Tùy chỉnh</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Hiển thị bộ chọn khoảng thời gian tùy chỉnh */}
            {timeRange === 'custom' && (
              <>
                <div>
                  <label htmlFor="date-from" className="text-sm font-medium mb-2 block">Từ ngày</label>
                  <input
                    id="date-from"
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Từ ngày"
                  />
                </div>
                <div>
                  <label htmlFor="date-to" className="text-sm font-medium mb-2 block">Đến ngày</label>
                  <input
                    id="date-to"
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Đến ngày"
                  />
                </div>
              </>
            )}

            {/* Lọc khóa học */}
            <div>
              <label className="text-sm font-medium mb-2 block">Khóa học</label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {selectedCourses.length === 0 
                      ? 'Tất cả khóa học'
                      : `${selectedCourses.length} khóa học`}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Chọn khóa học</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {mockCourseProgress.map((course) => (
                    <DropdownMenuItem 
                      key={course.id}
                      onClick={() => toggleCourse(course.id)}
                      className="flex items-center gap-2"
                    >
                      <input 
                        id={`course-${course.id}`}
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => {}}
                        className="h-4 w-4"
                        aria-label={`Chọn khóa học ${course.name}`}
                      />
                      <label htmlFor={`course-${course.id}`}>{course.name}</label>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thống kê tổng quan */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng thời gian học</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(stats.totalMinutes / 60)}h {stats.totalMinutes % 60}p
            </div>
            <p className="text-xs text-muted-foreground">
              Trong {filteredData.length} ngày
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Bài tập hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompletedTasks}</div>
            <p className="text-xs text-muted-foreground">
              Tỷ lệ hoàn thành: {stats.completionRate}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Trung bình mỗi ngày</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(stats.totalMinutes / filteredData.length)} phút
            </div>
            <p className="text-xs text-muted-foreground">
              {(stats.totalCompletedTasks / filteredData.length).toFixed(1)} bài tập/ngày
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ tiến độ học tập */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Thời gian học tập theo ngày</CardTitle>
          <CardDescription>
            Thời gian học tập và số bài tập hoàn thành theo ngày
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            {/* Biểu đồ cột hiển thị thời gian học tập */}
            <div className="h-full w-full flex flex-col">
              <div className="flex-1 flex items-end space-x-2 pb-4">
                {filteredData.slice(-7).map((data, index) => {
                  // Tìm giá trị lớn nhất để chuẩn hóa
                  const maxMinutes = Math.max(...filteredData.slice(-7).map(d => d.minutesStudied));
                  // Tính chiều cao tương đối (tối đa 180px)
                  const barHeight = maxMinutes > 0 
                    ? Math.max(20, (data.minutesStudied / maxMinutes) * 180) 
                    : 0;
                  
                  return (
                    <div key={index} className="group relative flex-1 flex flex-col items-center">
                      <div className="relative flex flex-col items-center justify-end h-[200px]">
                        <div 
                          className="w-full max-w-[50px] bg-primary/80 hover:bg-primary rounded-t-md transition-all duration-200" 
                          style={{ height: `${barHeight}px` }}
                        ></div>
                        {/* Thêm nhãn giá trị */}
                        <span className="absolute -top-6 text-xs font-medium">
                          {data.minutesStudied}
                        </span>
                      </div>
                      
                      <div className="absolute bottom-full mb-2 hidden group-hover:block rounded bg-black/80 px-2 py-1 text-xs text-white z-10">
                        <div className="font-medium">{data.minutesStudied} phút</div>
                        <div className="text-xs opacity-80">{data.completedTasks} bài tập</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Trục thời gian (ngày) */}
              <div className="flex justify-between border-t pt-2">
                {filteredData.slice(-7).map((data, index) => (
                  <div key={index} className="text-xs text-center flex-1 px-1">
                    {new Date(data.date).toLocaleDateString('vi-VN', { weekday: 'short' }).replace(',', '')}
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(data.date).getDate()}/{new Date(data.date).getMonth() + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thêm biểu đồ thứ hai - Biểu đồ hoàn thành nhiệm vụ */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nhiệm vụ hoàn thành theo ngày</CardTitle>
          <CardDescription>
            Tỷ lệ hoàn thành nhiệm vụ trong khoảng thời gian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <div className="h-full w-full flex flex-col">
              <div className="flex-1 flex items-end space-x-2 pb-4">
                {filteredData.slice(-7).map((data, index) => {
                  // Tìm giá trị lớn nhất
                  const maxTasks = Math.max(...filteredData.slice(-7).map(d => d.totalTasks));
                  // Tính chiều cao tương đối (tối đa 150px)
                  const completedHeight = maxTasks > 0 
                    ? Math.max(10, (data.completedTasks / maxTasks) * 150) 
                    : 0;
                  const pendingHeight = maxTasks > 0 
                    ? Math.max(5, ((data.totalTasks - data.completedTasks) / maxTasks) * 150) 
                    : 0;
                  
                  const completionRate = data.totalTasks > 0 
                    ? (data.completedTasks / data.totalTasks) * 100 
                    : 0;
                    
                  return (
                    <div key={index} className="group relative flex-1 flex flex-col items-center">
                      <div className="relative flex flex-col items-center justify-end h-[150px]">
                        <div className="w-full max-w-[50px] flex flex-col-reverse">
                          {/* Phần hoàn thành */}
                          <div 
                            className="w-full bg-green-500/80 hover:bg-green-500 rounded-t-md transition-all duration-200" 
                            style={{ height: `${completedHeight}px` }}
                          ></div>
                          {/* Phần còn lại */}
                          <div 
                            className="w-full bg-gray-200 dark:bg-gray-700" 
                            style={{ height: `${pendingHeight}px` }}
                          ></div>
                        </div>
                        {/* Thêm nhãn tỷ lệ */}
                        <span className="absolute -top-6 text-xs font-medium">
                          {Math.round(completionRate)}%
                        </span>
                      </div>
                      
                      <div className="absolute bottom-full mb-2 hidden group-hover:block rounded bg-black/80 px-2 py-1 text-xs text-white z-10">
                        <div className="font-medium">{data.completedTasks}/{data.totalTasks} nhiệm vụ</div>
                        <div className="text-xs opacity-80">{completionRate.toFixed(0)}% hoàn thành</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Trục thời gian (ngày) - tương tự như biểu đồ trên */}
              <div className="flex justify-between border-t pt-2">
                {filteredData.slice(-7).map((data, index) => (
                  <div key={index} className="text-xs text-center flex-1 px-1">
                    {new Date(data.date).toLocaleDateString('vi-VN', { weekday: 'short' }).replace(',', '')}
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(data.date).getDate()}/{new Date(data.date).getMonth() + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tiến độ theo khóa học */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tiến độ khóa học</CardTitle>
          <CardDescription>
            Tiến độ học tập của các khóa học đang tham gia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockCourseProgress.map((course) => (
              <div key={course.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">{course.name}</h4>
                  <span className="text-sm">{course.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div 
                    className="h-full rounded-full bg-primary" 
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.completedLessons}/{course.totalLessons} bài học</span>
                  <span>Hoạt động gần nhất: {course.lastActivity}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 