"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, FileText, Trophy } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Mock data cho danh sách bài tập
const mockAssignments = [
  {
    id: "1",
    title: "Học về phép cộng trong phạm vi 100",
    subject: "Toán",
    dueDate: "2024-03-20T23:59:59",
    type: "mixed",
    status: "in_progress",
    progress: 40
  },
  {
    id: "2",
    title: "Tập đọc: Truyện cổ tích Việt Nam",
    subject: "Tiếng Việt",
    dueDate: "2024-03-21T23:59:59",
    type: "file",
    status: "not_started",
    progress: 0
  },
  {
    id: "3",
    title: "Vẽ tranh về gia đình",
    subject: "Mỹ thuật",
    dueDate: "2024-03-19T23:59:59",
    type: "file",
    status: "completed",
    progress: 100
  }
];

function getRemainingTime(dueDate: string) {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - now.getTime();
  
  if (diff <= 0) return "Đã hết hạn";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days} ngày ${hours} giờ`;
  return `${hours} giờ`;
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "text-green-500";
    case "in_progress":
      return "text-blue-500";
    case "not_started":
      return "text-yellow-500";
    default:
      return "text-gray-500";
  }
}

function getStatusText(status: string) {
  switch (status) {
    case "completed":
      return "Đã hoàn thành";
    case "in_progress":
      return "Đang làm";
    case "not_started":
      return "Chưa bắt đầu";
    default:
      return "Không xác định";
  }
}

export default function AssignmentsList() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Danh sách bài tập</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockAssignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href={`/assignments/${assignment.id}`}>
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="space-y-2">
                  <h2 className="font-semibold line-clamp-2">{assignment.title}</h2>
                  <p className="text-sm text-muted-foreground">Môn học: {assignment.subject}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{getRemainingTime(assignment.dueDate)}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className={getStatusColor(assignment.status)}>
                      {getStatusText(assignment.status)}
                    </span>
                    <span className="font-medium">{assignment.progress}%</span>
                  </div>
                  <Progress value={assignment.progress} />
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {assignment.type === "mixed" ? (
                    <>
                      <Trophy className="h-4 w-4" />
                      <span>Trắc nghiệm</span>
                      <span className="mx-2">•</span>
                      <FileText className="h-4 w-4" />
                      <span>Nộp bài</span>
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      <span>Nộp bài</span>
                    </>
                  )}
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 