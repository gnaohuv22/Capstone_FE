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
  Upload,
  Users,
  Clock,
  BarChart
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UploadProgress } from '@/components/ui/upload-progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Interface cho dữ liệu tài nguyên
interface Resource {
  id: string;
  title: string;
  description: string;
  subject: string;
  type: 'document' | 'video' | 'presentation' | 'exercise' | 'audio' | 'interactive';
  uploadDate: string;
  size: string;
  downloadCount: number;
  viewCount: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  url: string;
  previewAvailable: boolean;
  author: string;
  lastModified: string;
  language: string;
  license: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Mock data cho tài nguyên học tập
const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Giải tích - Đạo hàm và ứng dụng',
    description: 'Tài liệu tổng hợp về đạo hàm và các ứng dụng trong giải tích với nhiều ví dụ thực tế.',
    subject: 'Toán học',
    type: 'document',
    uploadDate: '2024-03-06',
    size: '2.5 MB',
    downloadCount: 125,
    viewCount: 450,
    rating: 4.5,
    ratingCount: 45,
    tags: ['Giải tích', 'Đạo hàm', 'Lý thuyết', 'Bài tập'],
    url: '#',
    previewAvailable: true,
    author: 'Nguyễn Văn A',
    lastModified: '2024-03-07',
    language: 'Tiếng Việt',
    license: 'CC BY-SA',
    difficulty: 'intermediate'
  },
  {
    id: '2',
    title: 'Thí nghiệm Vật lý - Chuyển động của vật',
    description: 'Video minh họa các thí nghiệm về chuyển động của vật trong không gian.',
    subject: 'Vật lý',
    type: 'video',
    uploadDate: '2024-03-05',
    size: '156 MB',
    downloadCount: 89,
    viewCount: 320,
    rating: 4.8,
    ratingCount: 32,
    tags: ['Thí nghiệm', 'Chuyển động', 'Video'],
    url: '#',
    previewAvailable: true,
    author: 'Trần Thị B',
    lastModified: '2024-03-06',
    language: 'Tiếng Việt',
    license: 'CC BY',
    difficulty: 'beginner'
  },
  {
    id: '3',
    title: 'Hóa học hữu cơ - Hidrocacbon',
    description: 'Bài giảng tương tác về cấu trúc và tính chất của Hidrocacbon.',
    subject: 'Hóa học',
    type: 'interactive',
    uploadDate: '2024-03-04',
    size: '85 MB',
    downloadCount: 145,
    viewCount: 410,
    rating: 4.6,
    ratingCount: 38,
    tags: ['Hữu cơ', 'Hidrocacbon', 'Tương tác'],
    url: '#',
    previewAvailable: true,
    author: 'Lê Văn C',
    lastModified: '2024-03-05',
    language: 'Tiếng Việt',
    license: 'CC BY-NC',
    difficulty: 'advanced'
  },
  {
    id: '4',
    title: 'English Grammar - Past Perfect',
    description: 'Audio lessons and exercises for Past Perfect Tense mastery.',
    subject: 'Tiếng Anh',
    type: 'audio',
    uploadDate: '2024-03-03',
    size: '45 MB',
    downloadCount: 234,
    viewCount: 567,
    rating: 4.7,
    ratingCount: 89,
    tags: ['Grammar', 'Past Perfect', 'Listening'],
    url: '#',
    previewAvailable: true,
    author: 'John Smith',
    lastModified: '2024-03-04',
    language: 'English',
    license: 'CC BY-SA',
    difficulty: 'intermediate'
  },
  {
    id: '5',
    title: 'Sinh học - Hệ tuần hoàn',
    description: 'Slide trình bày chi tiết về cấu tạo và chức năng của hệ tuần hoàn.',
    subject: 'Sinh học',
    type: 'presentation',
    uploadDate: '2024-03-02',
    size: '12 MB',
    downloadCount: 178,
    viewCount: 389,
    rating: 4.4,
    ratingCount: 45,
    tags: ['Hệ tuần hoàn', 'Sinh lý học', 'Slide'],
    url: '#',
    previewAvailable: true,
    author: 'Phạm Thị D',
    lastModified: '2024-03-03',
    language: 'Tiếng Việt',
    license: 'CC BY',
    difficulty: 'intermediate'
  },
  {
    id: '6',
    title: 'Lịch sử Việt Nam - Thời kỳ đồ đồng',
    description: 'Bài giảng về văn hóa Đông Sơn và các di tích lịch sử.',
    subject: 'Lịch sử',
    type: 'video',
    uploadDate: '2024-03-01',
    size: '230 MB',
    downloadCount: 156,
    viewCount: 445,
    rating: 4.9,
    ratingCount: 67,
    tags: ['Đông Sơn', 'Văn hóa', 'Cổ đại'],
    url: '#',
    previewAvailable: true,
    author: 'Hoàng Văn E',
    lastModified: '2024-03-02',
    language: 'Tiếng Việt',
    license: 'CC BY-NC-SA',
    difficulty: 'beginner'
  },
  {
    id: '7',
    title: 'Địa lý - Đới khí hậu Trái Đất',
    description: 'Tài liệu tương tác về các đới khí hậu và đặc điểm của chúng.',
    subject: 'Địa lý',
    type: 'interactive',
    uploadDate: '2024-02-29',
    size: '68 MB',
    downloadCount: 198,
    viewCount: 534,
    rating: 4.6,
    ratingCount: 73,
    tags: ['Khí hậu', 'Địa lý tự nhiên', 'Tương tác'],
    url: '#',
    previewAvailable: true,
    author: 'Nguyễn Thị F',
    lastModified: '2024-03-01',
    language: 'Tiếng Việt',
    license: 'CC BY',
    difficulty: 'intermediate'
  },
  {
    id: '8',
    title: 'Toán học - Hình học không gian',
    description: 'Bộ bài tập tương tác 3D về hình học không gian.',
    subject: 'Toán học',
    type: 'exercise',
    uploadDate: '2024-02-28',
    size: '34 MB',
    downloadCount: 245,
    viewCount: 678,
    rating: 4.7,
    ratingCount: 92,
    tags: ['Hình học', '3D', 'Bài tập'],
    url: '#',
    previewAvailable: true,
    author: 'Trần Văn G',
    lastModified: '2024-02-29',
    language: 'Tiếng Việt',
    license: 'CC BY-SA',
    difficulty: 'advanced'
  },
  {
    id: '9',
    title: 'Vật lý - Điện từ học',
    description: 'Bài giảng và thí nghiệm mô phỏng về điện từ trường.',
    subject: 'Vật lý',
    type: 'interactive',
    uploadDate: '2024-02-27',
    size: '95 MB',
    downloadCount: 167,
    viewCount: 489,
    rating: 4.5,
    ratingCount: 56,
    tags: ['Điện từ', 'Mô phỏng', 'Thí nghiệm'],
    url: '#',
    previewAvailable: true,
    author: 'Lê Thị H',
    lastModified: '2024-02-28',
    language: 'Tiếng Việt',
    license: 'CC BY-NC',
    difficulty: 'advanced'
  }
];

// Danh sách các môn học
const subjects = ['Tất cả', 'Toán học', 'Vật lý', 'Hóa học', 'Tiếng Anh', 'Sinh học', 'Lịch sử', 'Địa lý'];

// Danh sách các loại tài nguyên
const resourceTypes = [
  { value: 'all', label: 'Tất cả' },
  { value: 'document', label: 'Tài liệu' },
  { value: 'video', label: 'Video' },
  { value: 'presentation', label: 'Slide' },
  { value: 'exercise', label: 'Bài tập' },
  { value: 'audio', label: 'Audio' },
  { value: 'interactive', label: 'Tương tác' }
];

// Danh sách độ khó
const difficultyLevels = [
  { value: 'all', label: 'Tất cả' },
  { value: 'beginner', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung bình' },
  { value: 'advanced', label: 'Nâng cao' }
];

export function Resources() {
  const [selectedSubject, setSelectedSubject] = useState('Tất cả');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploading, setUploading] = useState<{ name: string; size: number } | null>(null);
  const [activeTab, setActiveTab] = useState('grid');

  // Lấy tất cả các tag từ tài nguyên
  const allTags = Array.from(
    new Set(mockResources.flatMap(resource => resource.tags))
  );

  // Lọc tài nguyên dựa trên các điều kiện
  const filteredResources = mockResources.filter(resource => {
    const matchesSubject = selectedSubject === 'Tất cả' || resource.subject === selectedSubject;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesDifficulty = selectedDifficulty === 'all' || resource.difficulty === selectedDifficulty;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.every(tag => resource.tags.includes(tag));
    
    return matchesSubject && matchesType && matchesDifficulty && matchesSearch && matchesTags;
  });

  // Nhóm tài nguyên theo ngày
  const groupedResources = filteredResources.reduce((groups, resource) => {
    const date = resource.uploadDate;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(resource);
    return groups;
  }, {} as Record<string, Resource[]>);

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

  // Xử lý upload file
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploading({
        name: file.name,
        size: file.size
      });
    }
  };

  // Render icon based on resource type
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
      case 'audio':
        return <FileText className="h-4 w-4" />;
      case 'interactive':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Thanh công cụ chính */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tài nguyên học tập</h1>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Tải lên
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tải lên tài nguyên</DialogTitle>
                <DialogDescription>
                  Chọn file tài nguyên bạn muốn chia sẻ với cộng đồng.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input id="title" placeholder="Nhập tiêu đề tài nguyên..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <Input id="description" placeholder="Mô tả ngắn gọn về tài nguyên..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">File</Label>
                  <Input id="file" type="file" onChange={handleFileUpload} />
                </div>
                {uploading && (
                  <UploadProgress
                    fileName={uploading.name}
                    fileSize={uploading.size}
                    onCancel={() => setUploading(null)}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Bộ lọc và tìm kiếm */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Bộ lọc tài nguyên</CardTitle>
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
                placeholder="Tìm kiếm tài nguyên..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Lọc theo môn học */}
            <div className="space-y-2">
              <Label>Môn học</Label>
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
            </div>

            {/* Lọc theo loại tài nguyên */}
            <div className="space-y-2">
              <Label>Loại tài nguyên</Label>
              <div className="flex flex-wrap gap-2">
                {resourceTypes.map((type) => (
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
            </div>

            {/* Lọc theo độ khó */}
            <div className="space-y-2">
              <Label>Độ khó</Label>
              <div className="flex flex-wrap gap-2">
                {difficultyLevels.map((level) => (
                  <Button
                    key={level.value}
                    variant={selectedDifficulty === level.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDifficulty(level.value)}
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
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

      {/* Chế độ xem */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="grid">
            <BarChart className="mr-2 h-4 w-4" />
            Lưới
          </TabsTrigger>
          <TabsTrigger value="list">
            <FileText className="mr-2 h-4 w-4" />
            Danh sách
          </TabsTrigger>
        </TabsList>

        {/* Chế độ xem lưới */}
        <TabsContent value="grid" className="space-y-6">
          {Object.entries(groupedResources)
            .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
            .map(([date, resources]) => (
              <div key={date} className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(date)}</span>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {resources.map((resource) => (
                    <Card key={resource.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <CardTitle className="text-base">{resource.title}</CardTitle>
                            <CardDescription>{resource.description}</CardDescription>
                          </div>
                          <Badge variant="outline">{resource.subject}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {/* Thông tin chi tiết */}
                        <div className="mb-4 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Tác giả: {resource.author}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Cập nhật: {formatDate(resource.lastModified)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="h-4 w-4" />
                            <span>{resource.rating} ({resource.ratingCount} đánh giá)</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="mb-4 flex flex-wrap gap-1">
                          {resource.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Thông tin và actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {renderTypeIcon(resource.type)}
                              <span>{resource.size}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              <span>{resource.viewCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              <span>{resource.downloadCount}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {resource.previewAvailable && (
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
        </TabsContent>

        {/* Chế độ xem danh sách */}
        <TabsContent value="list">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      {renderTypeIcon(resource.type)}
                      <div>
                        <h3 className="font-medium">{resource.title}</h3>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(resource.uploadDate)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
