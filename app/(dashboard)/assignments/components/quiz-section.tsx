"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import Image from "next/image";
import { Check, X } from "lucide-react";

interface Question {
  id: string;
  type: "multiple_choice" | "drag_drop";
  question: string;
  options?: string[];
  correctAnswer?: string;
  items?: string[];
  image?: string;
}

interface QuizSectionProps {
  questions: Question[];
}

export function QuizSection({ questions }: QuizSectionProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleDragEnd = (result: any, questionId: string) => {
    if (!result.destination) return;

    const items = Array.from(dragItems[questionId]);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDragItems(prev => ({ ...prev, [questionId]: items }));
    handleAnswerChange(questionId, items.join(""));
  };

  const [dragItems, setDragItems] = useState<Record<string, string[]>>(() => {
    const items: Record<string, string[]> = {};
    questions.forEach(q => {
      if (q.type === "drag_drop" && q.items) {
        items[q.id] = [...q.items].sort(() => Math.random() - 0.5);
      }
    });
    return items;
  });

  const isCorrect = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return false;
    
    if (question.type === "multiple_choice") {
      return answers[questionId] === question.correctAnswer;
    } else if (question.type === "drag_drop") {
      return answers[questionId] === question.items?.join("");
    }
    return false;
  };

  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <Card key={question.id} className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{question.question}</h3>
              {showResults && (
                <div className="flex items-center gap-2">
                  {isCorrect(question.id) ? (
                    <div className="flex items-center text-green-500">
                      <Check className="h-4 w-4 mr-1" />
                      <span>Đúng rồi!</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-500">
                      <X className="h-4 w-4 mr-1" />
                      <span>Chưa đúng, làm lại nhé!</span>
                    </div>
                  )}
                </div>
              )}
            </div>
            {question.image && (
              <div className="relative h-24 w-24">
                <Image
                  src={question.image}
                  alt="Question illustration"
                  fill
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {question.type === "multiple_choice" && question.options && (
            <RadioGroup
              value={answers[question.id]}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              className="grid grid-cols-2 gap-4"
            >
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                  <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.type === "drag_drop" && dragItems[question.id] && (
            <DragDropContext onDragEnd={(result) => handleDragEnd(result, question.id)}>
              <Droppable droppableId={question.id} direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex gap-2 p-4 bg-muted rounded-lg"
                  >
                    {dragItems[question.id].map((item, index) => (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-2 bg-background rounded border cursor-move"
                          >
                            {item}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
        </Card>
      ))}

      <div className="flex justify-end">
        <Button 
          onClick={() => setShowResults(true)}
          disabled={Object.keys(answers).length !== questions.length}
        >
          Kiểm tra đáp án
        </Button>
      </div>
    </div>
  );
} 