"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

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

export function HelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Hướng dẫn làm bài</DialogTitle>
        </DialogHeader>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <motion.div variants={item} className="space-y-2">
            <h3 className="font-semibold text-lg">1. Phần trắc nghiệm</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Đọc kỹ câu hỏi và xem hình minh họa (nếu có)</li>
              <li>Chọn một đáp án bằng cách click vào nút tròn bên cạnh</li>
              <li>Với câu hỏi kéo thả, click và giữ để di chuyển các phần tử vào đúng vị trí</li>
              <li>Nhấn "Kiểm tra đáp án" để xem kết quả</li>
              <li>Nếu sai, em có thể làm lại nhiều lần</li>
            </ul>
          </motion.div>

          <motion.div variants={item} className="space-y-2">
            <h3 className="font-semibold text-lg">2. Phần nộp bài</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Em có thể nộp bài bằng nhiều cách:
                <ul className="list-circle pl-6 mt-2 space-y-2">
                  <li>Kéo thả file vào khung nộp bài</li>
                  <li>Click vào khung để chọn file từ máy tính</li>
                  <li>Sử dụng nút "Chụp ảnh bài làm" để chụp trực tiếp</li>
                </ul>
              </li>
              <li>File được chấp nhận: ảnh (PNG, JPG) và PDF</li>
              <li>Mỗi file không quá 5MB</li>
              <li>Nộp tối đa 5 file một lần</li>
            </ul>
          </motion.div>

          <motion.div variants={item} className="space-y-2">
            <h3 className="font-semibold text-lg">3. Lưu ý quan trọng</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Làm bài tập trước khi hết hạn nộp</li>
              <li>Có thể nộp lại bài nhiều lần nếu chưa hài lòng</li>
              <li>Kiểm tra kỹ bài làm trước khi nộp</li>
              <li>Nếu cần giúp đỡ, hãy hỏi giáo viên hoặc phụ huynh</li>
            </ul>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
} 