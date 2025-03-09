"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUploader } from "../components/file-uploader";
import { QuizSection } from "../components/quiz-section";
import { HelpDialog } from "../components/help-dialog";
import { Clock, FileText, Trophy } from "lucide-react";
import { motion } from "framer-motion";

// Mock data cho bài tập
const mockAssignment = {
  id: "1",
  title: "Học về phép cộng trong phạm vi 100",
  subject: "Toán",
  dueDate: "2024-03-20T23:59:59",
  description: "Em hãy làm các bài tập về phép cộng trong phạm vi 100 nhé!",
  type: "mixed", // 'quiz' | 'file' | 'mixed'
  status: "in_progress", // 'not_started' | 'in_progress' | 'completed'
  progress: 40,
  quiz: {
    questions: [
      {
        id: "q1",
        type: "multiple_choice",
        question: "25 + 17 = ?",
        options: ["35", "42", "52", "45"],
        correctAnswer: "42",
        image: "/math/addition.png"
      },
      {
        id: "q2",
        type: "drag_drop",
        question: "Kéo các số vào đúng vị trí để hoàn thành phép tính",
        items: ["23", "+", "45", "=", "68"],
        image: "/math/drag-drop.png"
      }
    ]
  }
};

// Tính thời gian còn lại
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

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AssignmentDetail() {
  const [activeTab, setActiveTab] = useState("quiz");
  const remainingTime = getRemainingTime(mockAssignment.dueDate);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-2xl font-bold">{mockAssignment.title}</h1>
          <p className="text-muted-foreground">Môn học: {mockAssignment.subject}</p>
        </motion.div>
        <HelpDialog />
      </div>

      {/* Thông tin và tiến độ */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 md:grid-cols-3"
      >
        <motion.div variants={item}>
          <Card className="p-4 flex items-center gap-4">
            <Clock className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Thời gian còn lại</p>
              <p className="font-semibold">{remainingTime}</p>
            </div>
          </Card>
        </motion.div>
        
        <motion.div variants={item}>
          <Card className="p-4 flex items-center gap-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Tiến độ</p>
              <div className="flex items-center gap-2">
                <Progress value={mockAssignment.progress} className="flex-1" />
                <span className="text-sm font-medium">{mockAssignment.progress}%</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="p-4 flex items-center gap-4">
            <FileText className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Loại bài tập</p>
              <p className="font-semibold">Trắc nghiệm & Nộp bài</p>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Mô tả bài tập */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Mô tả bài tập</h2>
          <p className="text-muted-foreground">{mockAssignment.description}</p>
        </Card>
      </motion.div>

      {/* Tabs cho phần làm bài */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quiz">
              <Trophy className="mr-2 h-4 w-4" />
              Trắc nghiệm
            </TabsTrigger>
            <TabsTrigger value="submit">
              <FileText className="mr-2 h-4 w-4" />
              Nộp bài
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quiz" className="space-y-4">
            <QuizSection questions={mockAssignment.quiz.questions} />
          </TabsContent>

          <TabsContent value="submit" className="space-y-4">
            <FileUploader />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
} 