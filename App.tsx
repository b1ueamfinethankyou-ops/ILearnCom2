
import React, { useState } from 'react';
import { 
  Menu, X, ChevronRight, Cpu, Layout, Layers, Settings, Globe, Shield, 
  Search, Send, Sparkles, BrainCircuit,
  Home, Map, BookOpen, FileText, CheckCircle, ArrowLeft,
  Terminal, Monitor, MousePointer2, HardDrive, ListChecks,
  AlertCircle, CheckCircle2, Info, Image as ImageIcon, Loader2,
  MessageSquare, ScrollText, UserCircle2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { AppView, CurriculumWeek, QuizQuestion, Difficulty } from './types';
import { CURRICULUM, SITEMAP_DATA } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedWeek, setSelectedWeek] = useState<CurriculumWeek | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [chatInput, setChatInput] = useState('');

  // States for AI Image Generation
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});
  const [imageLoading, setImageLoading] = useState<Record<string, boolean>>({});

  const handleSidebarToggle = () => setSidebarOpen(!sidebarOpen);

  const generateStepImage = async (stepTitle: string, stepDesc: string) => {
    const key = `${stepTitle}`;
    if (generatedImages[key] || imageLoading[key]) return;

    setImageLoading(prev => ({ ...prev, [key]: true }));
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Professional 3D isometric illustration for a vocational computer course. Scene: ${stepTitle}. Detail: ${stepDesc}. Style: clean, modern, educational, white background, soft lighting, tech-focused.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Data = part.inlineData.data;
            setGeneratedImages(prev => ({ ...prev, [key]: `data:image/png;base64,${base64Data}` }));
            break;
          }
        }
      }
    } catch (error) {
      console.error("Image generation failed", error);
    } finally {
      setImageLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    setAiLoading(true);
    setAiMessage('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: chatInput,
        config: {
          systemInstruction: "คุณคือเพื่อนสนิทร่วมชั้นเรียน ปวช. ที่เก่งคอมพิวเตอร์มาก ชอบแบ่งปันความรู้กับเพื่อนๆ ใช้ภาษาเป็นกันเองแบบเพื่อนคุยกัน (แทนตัวเองว่า 'เรา', เรียกผู้ใช้ว่า 'นาย' หรือ 'เธอ' หรือ 'เพื่อน') อธิบายเรื่องคอมพิวเตอร์ให้เข้าใจง่ายๆ มีมุกตลกบ้างนิดหน่อย เน้นความสนุกในการเรียนรู้ร่วมกัน",
        }
      });
      setAiMessage(response.text || "โทษทีเพื่อน เราคิดไม่ออก ลองถามอีกทีนะ");
      setChatInput('');
    } catch (error) {
      setAiMessage("เห้ยเพื่อน ระบบมันเอ๋อๆ อะ แป๊บนึงนะ!");
    } finally {
      setAiLoading(false);
    }
  };

  const handleNextLesson = () => {
    if (!selectedWeek) {
      setCurrentView('curriculum');
      return;
    }

    const nextWeek = CURRICULUM.find(w => w.week === selectedWeek.week + 1);
    
    if (nextWeek) {
      setSelectedWeek(nextWeek);
      setQuizSubmitted(false);
      setUserAnswers({});
      setCurrentView('lesson');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setSelectedWeek(null);
      setQuizSubmitted(false);
      setUserAnswers({});
      setCurrentView('curriculum');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch(diff) {
      case 'ง่าย': return 'text-green-600 bg-green-50';
      case 'ปานกลาง': return 'text-orange-600 bg-orange-50';
      case 'ยาก': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const renderHome = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-8 text-white shadow-xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-4">หวัดดีเพื่อน! มาเรียนคอมฯ กัน 🚀</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            พวกเราชาว ปวช. จะมาเปลี่ยนเรื่องเทคนิคยากๆ ให้กลายเป็นเรื่องจิ๊บๆ 
            เรียนสนุก เข้าใจง่าย เหมือนนั่งติวกับเพื่อนสนิทหน้าห้องเรียนเลย
          </p>
          <button 
            onClick={() => setCurrentView('introduction')}
            className="mt-6 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors inline-flex items-center gap-2"
          >
            อ่านคำนำก่อนเริ่ม <ChevronRight size={18} />
          </button>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Cpu size={300} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentView('curriculum')}>
          <BookOpen className="text-blue-500 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">บทเรียนเข้มข้น</h3>
          <p className="text-gray-600">เนื้อหา 4 สัปดาห์ ครอบคลุมพื้นฐานคอมพิวเตอร์ทั้งหมด</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentView('quiz')}>
          <CheckCircle className="text-green-500 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">วัดความรู้</h3>
          <p className="text-gray-600">ทำแบบทดสอบเพื่อเช็คความเข้าใจ พร้อมคำอธิบายละเอียด</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setCurrentView('ai-tutor')}>
          <MessageSquare className="text-purple-500 mb-4" size={32} />
          <h3 className="text-xl font-bold mb-2">ถามพี่ AI</h3>
          <p className="text-gray-600">สงสัยตรงไหน ถามพี่ Gemini ได้ตลอด 24 ชม. เลยเพื่อน!</p>
        </div>
      </div>
    </div>
  );

  const renderIntroduction = () => (
    <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500 py-10">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-blue-100 text-blue-600 rounded-3xl mb-2">
          <ScrollText size={48} />
        </div>
        <h2 className="text-4xl font-bold text-gray-900">คำนำ (Foreword)</h2>
        <p className="text-xl text-gray-500">"เรียนคอมฯ ไม่ได้ยาก แค่ต้องรู้จักวิธีคุยกับมัน"</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6 leading-relaxed text-gray-700">
        <p>
          สวัสดีน้องๆ นักศึกษาระดับ <span className="font-bold text-blue-600 underline">ประกาศนียบัตรวิชาชีพ (ปวช.)</span> ทุกคนครับ! 
          ในยุคที่ทุกอย่างขับเคลื่อนด้วยเทคโนโลยี ความรู้เรื่องคอมพิวเตอร์ไม่ใช่แค่ 'วิชาเรียน' แต่มันคือ 'อาวุธ' 
          ที่จะช่วยให้น้องๆ ก้าวหน้าในสายงานอาชีพที่น้องเลือก ไม่ว่าจะเป็นช่างไฟฟ้า ช่างยนต์ บัญชี หรือการตลาด
        </p>
        <p>
          แพลตฟอร์ม <strong>ILearnCom</strong> นี้ ถูกออกแบบมาโดยเน้นความ <strong>"ง่าย จริงใจ และใช้งานได้จริง"</strong> 
          เราตัดศัพท์เทคนิคที่น่าปวดหัวทิ้งไป และแทนที่ด้วยคำอธิบายที่เหมือนพี่สอนน้อง เพื่อนติวให้เพื่อน 
          เพื่อให้น้องๆ เข้าใจถึงแก่นแท้ของการทำงานของอุปกรณ์ (Hardware) ระบบปฏิบัติการ (Software) 
          และความปลอดภัยในโลกดิจิทัล
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 items-center">
            <CheckCircle2 className="text-green-500" size={24} />
            <p className="text-sm font-medium">เนื้อหากระชับ เข้าใจง่าย</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 items-center">
            <CheckCircle2 className="text-green-500" size={24} />
            <p className="text-sm font-medium">มีภาพประกอบจาก AI</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 items-center">
            <CheckCircle2 className="text-green-500" size={24} />
            <p className="text-sm font-medium">ถาม-ตอบกับ AI ติวเตอร์</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex gap-4 items-center">
            <CheckCircle2 className="text-green-500" size={24} />
            <p className="text-sm font-medium">แบบทดสอบวัดผลทันที</p>
          </div>
        </div>
        <p>
          พี่หวังว่าความรู้ใน 4 บทเรียนนี้ จะเป็นรากฐานสำคัญที่ทำให้น้องๆ ใช้งานคอมพิวเตอร์ได้อย่างมั่นใจ 
          และสามารถแก้ปัญหาพื้นฐานได้ด้วยตัวเองเหมือนช่างคอมมืออาชีพครับ
        </p>
        <div className="pt-6 border-t border-gray-50 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">I</div>
          <div>
            <p className="font-bold text-gray-900">คณะผู้จัดทำ ILearnCom</p>
            <p className="text-xs text-gray-400">เพื่อการศึกษาไทยในยุคดิจิทัล</p>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setCurrentView('curriculum')}
        className="w-full py-5 bg-blue-600 text-white rounded-3xl font-bold text-xl shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3"
      >
        เริ่มบทเรียนแรกกันเลย! <ChevronRight />
      </button>
    </div>
  );

  const renderCurriculum = () => (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">บทเรียนคอมพิวเตอร์</h2>
      <div className="grid gap-6">
        {CURRICULUM.map((week) => (
          <div 
            key={week.week}
            className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-300 transition-all cursor-pointer"
            onClick={() => { setSelectedWeek(week); setCurrentView('lesson'); }}
          >
            <div className="flex items-start gap-6">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {week.week}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{week.title}</h3>
                <p className="text-gray-600 mb-4">{week.shortDesc}</p>
                <div className="flex flex-wrap gap-2">
                  {week.subtopics.slice(0, 3).map((topic, i) => (
                    <span key={i} className="px-3 py-1 bg-gray-50 text-gray-500 text-xs rounded-full">
                      {topic}
                    </span>
                  ))}
                  {week.subtopics.length > 3 && (
                    <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs rounded-full">
                      +{week.subtopics.length - 3} หัวข้อ
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLesson = () => {
    if (!selectedWeek) return null;
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <button 
          onClick={() => setCurrentView('curriculum')}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft size={18} /> กลับไปหน้าบทเรียน
        </button>

        <div className="space-y-4">
          <div className="inline-block px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            สัปดาห์ที่ {selectedWeek.week}
          </div>
          <h2 className="text-4xl font-bold text-gray-900">{selectedWeek.title}</h2>
          <p className="text-lg text-gray-600 leading-relaxed">{selectedWeek.introduction}</p>
        </div>

        <div className="space-y-12">
          {selectedWeek.sections.map((section, idx) => (
            <section key={idx} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-500 rounded-full" />
                {section.title}
              </h3>
              
              <div className="prose prose-blue max-w-none">
                {typeof section.content === 'string' && section.type === 'activity' ? (
                  <div className="grid gap-6">
                    {JSON.parse(section.content).map((step: any) => (
                      <div key={step.step} className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                              {step.step}
                            </span>
                            <h4 className="font-bold text-gray-800">{step.title}</h4>
                          </div>
                          <p className="text-gray-600">{step.desc}</p>
                          <button 
                            onClick={() => generateStepImage(step.title, step.desc)}
                            className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:underline"
                            disabled={imageLoading[step.title]}
                          >
                            {imageLoading[step.title] ? <Loader2 className="animate-spin" size={14} /> : <ImageIcon size={14} />}
                            {generatedImages[step.title] ? 'ดูรูปประกอบอีกรอบ' : 'เจนรูปประกอบด้วย AI'}
                          </button>
                        </div>
                        {(generatedImages[step.title] || imageLoading[step.title]) && (
                          <div className="md:w-1/2 aspect-video rounded-xl bg-gray-200 overflow-hidden flex items-center justify-center relative">
                            {imageLoading[step.title] ? (
                              <div className="flex flex-col items-center gap-2 text-gray-400">
                                <Loader2 className="animate-spin" size={32} />
                                <span className="text-xs">กำลังวาดรูปให้เพื่อนอยู่...</span>
                              </div>
                            ) : (
                              <img src={generatedImages[step.title]} alt={step.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : section.content}
              </div>
            </section>
          ))}
        </div>

        <div className="bg-gray-900 rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Sparkles className="text-yellow-400" /> สรุปสิ่งที่เราได้เรียนรู้
          </h3>
          <ul className="space-y-4">
            {selectedWeek.takeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="text-green-400 shrink-0 mt-1" size={20} />
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => setCurrentView('quiz')}
            className="mt-8 w-full py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
          >
            ทำแบบทดสอบประจำสัปดาห์ <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    const questions = selectedWeek ? selectedWeek.quiz : CURRICULUM.flatMap(w => w.quiz);
    
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900">คลังข้อสอบวัดความรู้</h2>
          <p className="text-gray-600">
            {selectedWeek ? `แบบทดสอบสัปดาห์ที่ ${selectedWeek.week}: ${selectedWeek.title}` : 'รวมข้อสอบทั้งหมดจากทุกบทเรียน'}
          </p>
        </div>

        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">ข้อที่ {idx + 1}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(q.difficulty)}`}>
                  {q.difficulty}
                </span>
              </div>
              
              <h4 className="text-xl font-bold text-gray-800 leading-relaxed">{q.question}</h4>

              {(q.type === 'multiple-choice' || q.type === 'scenario') && (
                <div className="grid gap-3">
                  {q.options?.map((opt, i) => {
                    const isSelected = userAnswers[q.id] === i;
                    const isCorrect = q.correctAnswer === i;
                    const showFeedback = quizSubmitted;
                    
                    let bgClass = "bg-gray-50 border-gray-200 hover:border-blue-400";
                    if (isSelected) bgClass = "bg-blue-50 border-blue-500 text-blue-700";
                    if (showFeedback) {
                      if (isCorrect) bgClass = "bg-green-50 border-green-500 text-green-700";
                      else if (isSelected) bgClass = "bg-red-50 border-red-500 text-red-700";
                    }

                    return (
                      <button
                        key={i}
                        disabled={quizSubmitted}
                        onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: i }))}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between group ${bgClass}`}
                      >
                        <span>{opt}</span>
                        {showFeedback && isCorrect && <CheckCircle2 size={18} />}
                        {showFeedback && isSelected && !isCorrect && <X size={18} />}
                      </button>
                    );
                  })}
                </div>
              )}

              {q.type === 'short-answer' && (
                <div className="space-y-4">
                  <input 
                    type="text"
                    disabled={quizSubmitted}
                    placeholder="พิมพ์คำตอบที่นี่..."
                    value={userAnswers[q.id] || ''}
                    onChange={(e) => setUserAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className="w-full p-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-all"
                  />
                  {quizSubmitted && (
                    <div className={`p-4 rounded-xl ${
                      userAnswers[q.id]?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim() 
                        ? 'bg-green-50 text-green-700' 
                        : 'bg-red-50 text-red-700'
                    }`}>
                      <p className="font-bold">คำตอบที่ถูกต้อง: {q.correctAnswer}</p>
                    </div>
                  )}
                </div>
              )}

              {q.type === 'matching' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-500 italic">การจับคู่จะใช้การตอบแบบเลือกคู่ (จำลอง)</p>
                  <div className="grid gap-2">
                    {q.matchingPairs?.map((pair, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 border rounded-xl">
                        <span className="font-bold text-blue-600 min-w-[100px]">{pair.left}</span>
                        <ChevronRight size={14} className="text-gray-400" />
                        <span className="text-gray-700">{pair.right}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {quizSubmitted && (
                <div className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
                  <Info className="text-blue-500 shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-blue-800 mb-1">เฉลยเพื่อน!</p>
                    <p className="text-blue-700 text-sm">{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {!quizSubmitted ? (
          <button 
            onClick={() => setQuizSubmitted(true)}
            className="w-full py-5 bg-blue-600 text-white rounded-3xl font-bold text-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
          >
            ส่งคำตอบตรวจเลย
          </button>
        ) : (
          <button 
            onClick={handleNextLesson}
            className="w-full py-5 bg-gray-900 text-white rounded-3xl font-bold text-xl shadow-lg hover:bg-black transition-all flex items-center justify-center gap-3"
          >
            ไปบทเรียนต่อไป <ChevronRight />
          </button>
        )}
      </div>
    );
  };

  const renderAITutor = () => (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col animate-in fade-in duration-500">
      <div className="mb-8 flex items-center gap-4 p-6 bg-purple-50 rounded-3xl border border-purple-100">
        <div className="p-3 bg-purple-600 rounded-2xl text-white">
          <BrainCircuit size={32} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-purple-900">พี่ AI ติวเตอร์ส่วนตัว</h2>
          <p className="text-purple-700">สงสัยเรื่องคอมฯ ตรงไหน ถามเราได้เลยนะเพื่อน เดี๋ยวเราสรุปให้ง่ายๆ</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-4 custom-scrollbar">
        {aiMessage && (
          <div className="flex gap-4 animate-in slide-in-from-left">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
              <Sparkles size={20} />
            </div>
            <div className="bg-white p-6 rounded-2xl rounded-tl-none border border-purple-100 shadow-sm max-w-[85%]">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{aiMessage}</p>
            </div>
          </div>
        )}
        {aiLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white animate-pulse">
              <Loader2 className="animate-spin" />
            </div>
            <div className="bg-gray-100 p-6 rounded-2xl rounded-tl-none animate-pulse w-48">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        )}
        {!aiMessage && !aiLoading && (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 opacity-50">
            <MessageSquare size={64} />
            <p>ยังไม่มีข้อความ ลองพิมพ์ถามมาสิเพื่อน!</p>
          </div>
        )}
      </div>

      <form onSubmit={handleAskAI} className="relative">
        <input 
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="นายอยากรู้อะไรเกี่ยวกับคอมพิวเตอร์เหรอ? พิมพ์มาเลย..."
          className="w-full p-5 pr-20 bg-white border-2 border-purple-200 rounded-3xl focus:border-purple-500 outline-none shadow-sm transition-all text-lg"
        />
        <button 
          type="submit"
          disabled={aiLoading || !chatInput.trim()}
          className="absolute right-3 top-3 bottom-3 px-6 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 disabled:bg-gray-300 transition-all flex items-center gap-2 font-bold"
        >
          <Send size={18} /> ถาม
        </button>
      </form>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-100 transition-all duration-300 flex flex-col z-50`}>
        <div className="p-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0">
            <Monitor size={24} />
          </div>
          {sidebarOpen && <h1 className="font-bold text-xl text-gray-800 truncate">ILearnCom</h1>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto custom-scrollbar">
          {SITEMAP_DATA.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                setCurrentView(item.path as AppView);
                if (item.path !== 'lesson') setSelectedWeek(null);
              }}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group ${
                currentView === item.path ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="font-medium truncate">{item.name}</span>}
              {currentView === item.path && sidebarOpen && (
                <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4">
          <button 
            onClick={handleSidebarToggle}
            className="w-full flex items-center justify-center p-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-all"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto pb-20">
          {currentView === 'home' && renderHome()}
          {currentView === 'introduction' && renderIntroduction()}
          {currentView === 'curriculum' && renderCurriculum()}
          {currentView === 'lesson' && renderLesson()}
          {currentView === 'quiz' && renderQuiz()}
          {currentView === 'ai-tutor' && renderAITutor()}
        </div>
      </main>
    </div>
  );
};

export default App;
