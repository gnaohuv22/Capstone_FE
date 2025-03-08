import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GraduationCap, Users, BookOpen, Calendar } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/20 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <GraduationCap className="mx-auto h-16 w-16 text-primary" />
        <h1 className="mt-8 text-4xl font-bold tracking-tight">
          Nền tảng học tập trực tuyến
        </h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Học tập mọi lúc, mọi nơi với những bài giảng chất lượng
        </p>

        {/* Feature Cards */}
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Users className="mx-auto h-10 w-10 text-primary" />
            <h3 className="mt-4 font-semibold">Giáo viên chất lượng</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Đội ngũ giáo viên giàu kinh nghiệm, tận tâm với học sinh
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <BookOpen className="mx-auto h-10 w-10 text-primary" />
            <h3 className="mt-4 font-semibold">Tài liệu phong phú</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Kho tài liệu đa dạng, cập nhật thường xuyên
            </p>
          </div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <Calendar className="mx-auto h-10 w-10 text-primary" />
            <h3 className="mt-4 font-semibold">Lịch học linh hoạt</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tự do sắp xếp thời gian học tập phù hợp
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-16 space-y-4 md:space-x-4 md:space-y-0">
          <Link href="/register">
            <Button size="lg" className="min-w-[200px]">
              Đăng ký ngay
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="min-w-[200px]">
              Đăng nhập
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-16 grid gap-8 text-center md:grid-cols-3">
          <div>
            <h4 className="text-2xl font-bold">1000+</h4>
            <p className="text-sm text-muted-foreground">Học sinh đang theo học</p>
          </div>
          <div>
            <h4 className="text-2xl font-bold">50+</h4>
            <p className="text-sm text-muted-foreground">Giáo viên chất lượng</p>
          </div>
          <div>
            <h4 className="text-2xl font-bold">100+</h4>
            <p className="text-sm text-muted-foreground">Khóa học đa dạng</p>
          </div>
        </div>
      </div>
    </div>
  );
} 