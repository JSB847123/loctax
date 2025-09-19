import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit3, HelpCircle, Trash2, Check, X, Grid3X3, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const defaultFAQs: FAQItem[] = [
  {
    id: "1",
    question: "도시지역분은 무엇인가요? 납부해야 하나요?",
    answer: `지방세법 제112조(재산세 도시지역분)

구 도시계획세가 재산세에 통합되면서 도시지역분으로 규정되었습니다.

과세대상
• 국토의 계획 및 이용에 관한 법률 제6조에 따른 도시지역 안의 토지 또는 건축물
• 제외대상: 공공시설용지, 개발제한구역내 지상건축물·골프장·유원지·기타이용시설이 없는 토지
• 부과지역은 자치단체 조례로 고시됩니다

세율
시가표준액의 1,000분의 1.4 (0.14%)

쉬운 설명
도시지역분은 도시계획구역 안에 있는 부동산에 재산세와 함께 추가로 부과되는 세금입니다.
이 세금은 도시의 도로, 상하수도, 공원 등 각종 도시계획 사업 비용을 마련하기 위해 도시 지역 내 집이나 건물 소유자에게 일률적으로 부과됩니다.

계산 방법
재산세 과세표준 × 0.14% = 도시지역분 세액`
  }
];

interface FAQProps {
  faqs?: FAQItem[];
  onFAQsChange?: (faqs: FAQItem[]) => void;
}

export const FAQ = ({ faqs: initialFAQs = defaultFAQs, onFAQsChange }: FAQProps) => {
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [editQuestion, setEditQuestion] = useState("");
  const [editAnswer, setEditAnswer] = useState("");
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const { toast } = useToast();

  // props가 변경될 때 상태 동기화
  useEffect(() => {
    setFaqs(initialFAQs);
  }, [initialFAQs]);

  const updateFAQs = (newFAQs: FAQItem[]) => {
    setFaqs(newFAQs);
    onFAQsChange?.(newFAQs);
  };

  const handleAddFAQ = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const newFAQ: FAQItem = {
        id: Date.now().toString(),
        question: newQuestion.trim(),
        answer: newAnswer.trim()
      };
      const updatedFAQs = [...faqs, newFAQ];
      updateFAQs(updatedFAQs);
      setNewQuestion("");
      setNewAnswer("");
      setIsAdding(false);
      toast({
        title: "FAQ 추가됨",
        description: "새로운 FAQ가 성공적으로 추가되었습니다.",
      });
    }
  };

  const handleEditFAQ = (id: string) => {
    if (editQuestion.trim() && editAnswer.trim()) {
      const updatedFAQs = faqs.map(faq => 
        faq.id === id 
          ? { ...faq, question: editQuestion.trim(), answer: editAnswer.trim() }
          : faq
      );
      updateFAQs(updatedFAQs);
      setEditingId(null);
      setEditQuestion("");
      setEditAnswer("");
      toast({
        title: "FAQ 수정됨",
        description: "FAQ가 성공적으로 수정되었습니다.",
      });
    }
  };

  const handleDeleteFAQ = (id: string) => {
    const updatedFAQs = faqs.filter(faq => faq.id !== id);
    updateFAQs(updatedFAQs);
    toast({
      title: "FAQ 삭제됨",
      description: "FAQ가 성공적으로 삭제되었습니다.",
    });
  };

  const startEditing = (faq: FAQItem) => {
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditQuestion("");
    setEditAnswer("");
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setNewQuestion("");
    setNewAnswer("");
  };

  const formatAnswer = (answer: string) => {
    return answer.split('\n').map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Section headings (과세대상, 세율, 쉬운 설명, 계산 방법 등)
      if (line.trim() === '과세대상' || line.trim() === '세율' || 
          line.trim() === '쉬운 설명' || line.trim() === '계산 방법') {
        return (
          <div key={index} className="font-semibold text-law-primary mb-2 mt-3">
            {line.trim()}
          </div>
        );
      }
      
      // Bullet points
      if (line.startsWith('• ')) {
        return (
          <div key={index} className="ml-4 mb-1">
            <span className="text-law-accent mr-2">•</span>
            {line.slice(2)}
          </div>
        );
      }
      
      // Regular text
      return (
        <div key={index} className="mb-2 leading-relaxed">
          {line}
        </div>
      );
    });
  };

  return (
    <Card className="bg-card/80 backdrop-blur shadow-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-law-primary flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            자주 묻는 질문
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* 보기 모드 전환 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
              className="h-8 w-8 p-0"
              title={viewMode === 'card' ? '리스트 보기' : '카드 보기'}
            >
              {viewMode === 'card' ? (
                <List className="h-4 w-4" />
              ) : (
                <Grid3X3 className="h-4 w-4" />
              )}
            </Button>
            {!isAdding && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAdding(true)}
                className="border-law-primary text-law-primary hover:bg-law-primary hover:text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-1" />
                FAQ 추가
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'card' ? (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-b border-border group">
                {editingId === faq.id ? (
                  <div className="py-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">질문</label>
                      <Input
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                        placeholder="질문을 입력하세요..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">답변</label>
                      <Textarea
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                        placeholder="답변을 입력하세요..."
                        className="min-h-[120px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFAQ(faq.id)}
                        className="h-8 px-3"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        저장
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        className="h-8 px-3"
                      >
                        <X className="h-4 w-4 mr-1" />
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <AccordionTrigger className="text-left hover:text-law-primary">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-medium">{faq.question}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(faq);
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFAQ(faq.id);
                            }}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      <div className="space-y-1">
                        {formatAnswer(faq.answer)}
                      </div>
                    </AccordionContent>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div key={faq.id} className="group">
                {editingId === faq.id ? (
                  <div className="p-4 border border-border rounded-lg space-y-4 bg-card/30">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">질문</label>
                      <Input
                        value={editQuestion}
                        onChange={(e) => setEditQuestion(e.target.value)}
                        placeholder="질문을 입력하세요..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">답변</label>
                      <Textarea
                        value={editAnswer}
                        onChange={(e) => setEditAnswer(e.target.value)}
                        placeholder="답변을 입력하세요..."
                        className="min-h-[120px]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditFAQ(faq.id)}
                        className="h-8 px-3"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        저장
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEditing}
                        className="h-8 px-3"
                      >
                        <X className="h-4 w-4 mr-1" />
                        취소
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 bg-card/50 rounded-lg border-l-4 border-law-primary/20 hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-law-primary mb-1">{faq.question}</p>
                      <p className="text-xs text-muted-foreground truncate" title={faq.answer}>
                        {faq.answer.split('\n')[0]}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(faq)}
                        className="h-6 w-6 p-0"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {isAdding && (
          <div className="mt-4">
            <div className={viewMode === 'card' ? "py-4 space-y-4 border-b border-border bg-card/30 rounded-lg px-4" : "p-4 border border-border rounded-lg space-y-4 bg-card/30"}>
              <div className="space-y-2">
                <label className="text-sm font-medium">질문</label>
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="질문을 입력하세요..."
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">답변</label>
                <Textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="답변을 입력하세요..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddFAQ}
                  className="h-8 px-3"
                >
                  <Check className="h-4 w-4 mr-1" />
                  추가
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelAdding}
                  className="h-8 px-3"
                >
                  <X className="h-4 w-4 mr-1" />
                  취소
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {!isAdding && (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-4 border-border hover:bg-accent"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            새 FAQ 추가
          </Button>
        )}
      </CardContent>
    </Card>
  );
};