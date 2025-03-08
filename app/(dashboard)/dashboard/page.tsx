import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardContent } from './dashboard-content';
import { Schedule } from './schedule';
import { Progress } from './progress';
import { Materials } from './materials';

export default async function DashboardPage() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="schedule">Lịch học</TabsTrigger>
          <TabsTrigger value="progress">Tiến độ</TabsTrigger>
          <TabsTrigger value="materials" className="hidden sm:flex">
            Tài liệu
          </TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Tạo ghi chú
            </span>
          </Button>
        </div>
      </div>

      <TabsContent value="overview" className="space-y-4">
        <DashboardContent />
      </TabsContent>

      <TabsContent value="schedule" className="space-y-4">
        <Schedule />
      </TabsContent>

      <TabsContent value="progress" className="space-y-4">
        <Progress />
      </TabsContent>

      <TabsContent value="materials" className="space-y-4">
        <Materials />
      </TabsContent>
    </Tabs>
  );
}