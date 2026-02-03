
import React from 'react';

export type QuestionType = 'multiple-choice' | 'matching' | 'short-answer' | 'scenario';
export type Difficulty = 'ง่าย' | 'ปานกลาง' | 'ยาก';

export interface QuizQuestion {
  id: number;
  type: QuestionType;
  difficulty: Difficulty;
  question: string;
  options?: string[]; // For multiple-choice/scenario
  correctAnswer: any; // index for choice, string for short-answer, or specific format for matching
  explanation: string;
  matchingPairs?: { left: string; right: string }[]; // For matching type
}

export interface LessonSection {
  title: string;
  content: string | React.ReactNode;
  type: 'text' | 'table' | 'list' | 'activity' | 'assessment';
}

export interface CurriculumWeek {
  week: number;
  title: string;
  shortDesc: string;
  subtopics: string[];
  assessment: string;
  introduction: string;
  sections: LessonSection[];
  takeaways: string[];
  quiz: QuizQuestion[]; // Quiz specific to this week
}

export interface SitemapItem {
  name: string;
  path: string;
  description: string;
  icon: React.ReactNode;
}

export type AppView = 'home' | 'introduction' | 'curriculum' | 'lesson' | 'quiz' | 'ai-tutor';
