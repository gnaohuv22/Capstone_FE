'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, Users, Calendar, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { ClassFilters } from './components/class-filters';
import { JoinClassDialog } from './components/join-class-dialog';
import Link from 'next/link';

// Mock data cho danh sách lớp học
const mockClasses = [
  {
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
    code: 'MATH10A1'
  },
  {
    id: 2,
    name: 'Vật lý 10A1',
    subject: 'Vật lý',
    teacher: 'Trần Thị B',
    schedule: 'Thứ 3, 5',
    time: '8:45 - 10:15',
    totalStudents: 32,
    currentUnit: 'Chương 2: Động học chất điểm',
    nextClass: '2024-03-21T08:45:00',
    status: 'active'
  },
  {
    id: 3,
    name: 'Hóa học 10A1',
    subject: 'Hóa học',
    teacher: 'Phạm Văn C',
    schedule: 'Thứ 2, 4',
    time: '10:30 - 12:00',
    totalStudents: 30,
    currentUnit: 'Chương 4: Bảng tuần hoàn',
    nextClass: '2024-03-20T10:30:00',
    status: 'active'
  },
  {
    id: 4,
    name: 'Ngữ văn 10A1',
    subject: 'Ngữ văn',
    teacher: 'Lê Thị D',
    schedule: 'Thứ 3, 6',
    time: '13:30 - 15:00',
    totalStudents: 35,
    currentUnit: 'Truyện Kiều - Nguyễn Du',
    nextClass: '2024-03-22T13:30:00',
    status: 'active'
  }
];

export default function ClassesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredClasses, setFilteredClasses] = useState(mockClasses);
  const [sortConfig, setSortConfig] = useState('name-asc');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    applyFilters({ search: value });
  };

  const handleFilterChange = (filters: any) => {
    applyFilters({ ...filters, search: searchTerm });
  };

  const handleSortChange = (sort: string) => {
    setSortConfig(sort);
    const sorted = [...filteredClasses].sort((a, b) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.nextClass).getTime() - new Date(b.nextClass).getTime();
        case 'date-desc':
          return new Date(b.nextClass).getTime() - new Date(a.nextClass).getTime();
        case 'students-asc':
          return a.totalStudents - b.totalStudents;
        case 'students-desc':
          return b.totalStudents - a.totalStudents;
        default:
          return 0;
      }
    });
    setFilteredClasses(sorted);
  };

  const applyFilters = (filters: any) => {
    let result = mockClasses;

    // Tìm kiếm
    if (filters.search) {
      result = result.filter(
        (cls) =>
          cls.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          cls.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
          cls.teacher.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Lọc theo môn học
    if (filters.subject && filters.subject !== "Tất cả môn học") {
      result = result.filter((cls) => cls.subject === filters.subject);
    }

    // Lọc theo lịch học
    if (filters.schedule && filters.schedule !== "Tất cả") {
      result = result.filter((cls) => cls.schedule.includes(filters.schedule));
    }

    // Lọc theo trạng thái
    if (filters.status && filters.status !== "all") {
      const now = new Date();
      result = result.filter((cls) => {
        const nextClass = new Date(cls.nextClass);
        const diffHours = (nextClass.getTime() - now.getTime()) / (1000 * 60 * 60);

        switch (filters.status) {
          case 'upcoming':
            return diffHours > 0 && diffHours <= 24;
          case 'ongoing':
            return diffHours > -1.5 && diffHours <= 0; // Giả sử mỗi lớp kéo dài 1.5 giờ
          case 'completed':
            return diffHours < -1.5;
          default:
            return true;
        }
      });
    }

    setFilteredClasses(result);
  };

  const handleJoinClass = async (code: string) => {
    // Giả lập API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Kiểm tra mã lớp học
    const classToJoin = mockClasses.find((cls) => cls.code === code);
    if (!classToJoin) {
      throw new Error('Mã lớp học không hợp lệ');
    }
  };

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
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Lớp học của tôi</h2>
            <p className="text-muted-foreground">
              Quản lý và theo dõi các lớp học của bạn
            </p>
          </div>
          <JoinClassDialog onJoinClass={handleJoinClass} />
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tên lớp, môn học hoặc giáo viên..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <ClassFilters
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredClasses.map((cls) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/classes/${cls.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{cls.name}</span>
                      <Badge variant="outline" className={getNextClassStatus(cls.nextClass).color}>
                        {getNextClassStatus(cls.nextClass).text}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{cls.subject}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Giáo viên: {cls.teacher}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{cls.schedule}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{cls.time}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{cls.currentUnit}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <Badge variant="secondary">
                          {cls.totalStudents} học sinh
                        </Badge>
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 