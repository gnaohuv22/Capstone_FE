'use client';

import { useState } from 'react';
import { 
  Book, 
  Calendar, 
  Download, 
  Eye, 
  FileText, 
  Filter, 
  Search, 
  Star,
  Tags,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

// Interface cho dữ liệu tài liệu
interface Material {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'document' | 'video' | 'presentation' | 'exercise';
  uploadDate: string;
  size: string;
  downloadCount: number;
  tags: string[];
  url: string;
  previewAvailable: boolean;
}

// Mock data cho tài liệu học tập
const mockMaterials: Material[] = [
  {
    id: '1',
    title: 'Giải tích - Đạo hàm và ứng dụng',
    description: 'Tài liệu tổng hợp về đạo hàm và các ứng dụng trong giải tích.',
    subject: 'Toán học',
    type: 'document',
    uploadDate: '2024-03-06',
    size: '2.5 MB',
    downloadCount: 125,
    tags: ['Giải tích', 'Đạo hàm', 'Lý thuyết'],
    url: '#',
    previewAvailable: true
  },
  {
    id: '2',
    title: 'Bài giảng: Cơ học Newton',
    description: 'Video bài giảng về các định luật Newton và bài tập áp dụng.',
    subject: 'Vật lý',
    type: 'video',
    uploadDate: '2024-03-05',
    size: '450 MB',
    downloadCount: 89,
    tags: ['Cơ học', 'Video', 'Bài giảng'],
    url: '#',
    previewAvailable: true
  },
  {
    id: '3',
    title: 'Hidrocacbon - Cấu trúc và tính chất',
    description: 'Slide trình bày về cấu trúc và tính chất của Hidrocacbon.',
    subject: 'Hóa học',
    type: 'presentation',
    uploadDate: '2024-03-04',
    size: '5.8 MB',
    downloadCount: 67,
    tags: ['Hữu cơ', 'Hidrocacbon', 'Slide'],
    url: '#',
    previewAvailable: true
  },
  {
    id: '4',
    title: 'Bài tập Past Perfect Tense',
    description: 'Bộ bài tập thì quá khứ hoàn thành với đáp án chi tiết.',
    subject: 'Tiếng Anh',
    type: 'exercise',
    uploadDate: '2024-03-03',
    size: '1.2 MB',
    downloadCount: 234,
    tags: ['Grammar', 'Bài tập', 'Đáp án'],
    url: '#',
    previewAvailable: true
  }
];

// Danh sách các môn học
const subjects = ['Tất cả', 'Toán học', 'Vật lý', 'Hóa học', 'Tiếng Anh'];

// Danh sách các loại tài liệu
const materialTypes = [
  { value: 'all', label: 'Tất cả' },
  { value: 'document', label: 'Tài liệu' },
  { value: 'video', label: 'Video' },
  { value: 'presentation', label: 'Slide' },
  { value: 'exercise', label: 'Bài tập' }
];

export function Materials() {
  const [selectedSubject, setSelectedSubject] = useState('Tất cả');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Lấy tất cả các tag từ tài liệu
  const allTags = Array.from(
    new Set(mockMaterials.flatMap(material => material.tags))
  );

  // Lọc tài liệu dựa trên các điều kiện
  const filteredMaterials = mockMaterials.filter(material => {
    const matchesSubject = selectedSubject === 'Tất cả' || material.subject === selectedSubject;
    const matchesType = selectedType === 'all' || material.type === selectedType;
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => material.tags.includes(tag));
    
    return matchesSubject && matchesType && matchesSearch && matchesTags;
  });

  // Nhóm tài liệu theo ngày
  const groupedMaterials = filteredMaterials.reduce((groups, material) => {
    const date = material.uploadDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(material);
    return groups;
  }, {} as Record<string, Material[]>);

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Render icon based on material type
  const renderTypeIcon = (type: string) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Book className="h-4 w-4" />;
      case 'presentation':
        return <FileText className="h-4 w-4" />;
      case 'exercise':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Bộ lọc và tìm kiếm */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Bộ lọc tài liệu</CardTitle>
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>Lọc</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Thanh tìm kiếm */}
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tài liệu..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Lọc theo môn học */}
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject(subject)}
                >
                  {subject}
                </Button>
              ))}
            </div>

            {/* Lọc theo loại tài liệu */}
            <div className="flex flex-wrap gap-2">
              {materialTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.value)}
                >
                  {type.label}
                </Button>
              ))}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tags className="h-4 w-4" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danh sách tài liệu */}
      <div className="space-y-6">
        {Object.entries(groupedMaterials)
          .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
          .map(([date, materials]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(date)}</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {materials.map((material) => (
                  <Card key={material.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{material.title}</CardTitle>
                          <CardDescription>{material.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{material.subject}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Tags */}
                      <div className="mb-4 flex flex-wrap gap-1">
                        {material.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Thông tin và actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {renderTypeIcon(material.type)}
                            <span>{material.size}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-4 w-4" />
                            <span>{material.downloadCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {material.previewAvailable && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Star className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
} 