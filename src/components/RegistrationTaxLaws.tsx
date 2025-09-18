import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, ArrowLeft, Book, Plus, Edit, Trash2, Search } from "lucide-react";
import { useState, useEffect } from "react";

// Import law data
import {
  localTaxActRegistration,
  localTaxActDecreeRegistration,
  localTaxActRuleRegistration,
  specialLocalTaxRestrictionActRegistration,
  specialLocalTaxRestrictionActDecreeRegistration
} from "@/data/registrationTaxLawsData";

interface LawItem {
  title: string;
  url: string;
  keywords: string[];
}

interface LawSection {
  title: string;
  laws: LawItem[];
}

interface EditKeywordsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lawTitle: string;
  keywords: string[];
  onSave: (keywords: string[]) => void;
}

// 키워드 편집 다이얼로그 컴포넌트
function EditKeywordsDialog({ isOpen, onOpenChange, lawTitle, keywords, onSave }: EditKeywordsDialogProps) {
  const [currentKeywords, setCurrentKeywords] = useState<string[]>(keywords);
  const [newKeyword, setNewKeyword] = useState("");

  const addKeyword = () => {
    if (newKeyword.trim() && currentKeywords.length < 7 && !currentKeywords.includes(newKeyword.trim())) {
      setCurrentKeywords([...currentKeywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  const removeKeyword = (index: number) => {
    setCurrentKeywords(currentKeywords.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave(currentKeywords);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>키워드 편집</DialogTitle>
          <DialogDescription className="text-sm">
            {lawTitle}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {currentKeywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs px-2 py-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeKeyword(index)}
              >
                {keyword}
                <Trash2 className="h-3 w-3 ml-1" />
              </Badge>
            ))}
          </div>
          {currentKeywords.length < 7 && (
            <div className="flex gap-2">
              <Input
                placeholder="새 키워드 입력"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                className="flex-1"
              />
              <Button onClick={addKeyword} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            최대 7개의 키워드를 추가할 수 있습니다. ({currentKeywords.length}/7)
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleSave}>
            저장
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Combine all data
const registrationTaxLaws: LawSection[] = [
  ...localTaxActRegistration,
  ...localTaxActDecreeRegistration,
  localTaxActRuleRegistration,
  ...specialLocalTaxRestrictionActRegistration,
  ...specialLocalTaxRestrictionActDecreeRegistration
];

interface RegistrationTaxLawsProps {
  onBack: () => void;
  searchQuery?: string;
}

export const RegistrationTaxLaws = ({ onBack, searchQuery = "" }: RegistrationTaxLawsProps) => {
  const [laws, setLaws] = useState<LawSection[]>(registrationTaxLaws);
  const [editingLaw, setEditingLaw] = useState<{sectionIndex: number, lawIndex: number} | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 2년(24개월) = 2 * 365 * 24 * 60 * 60 * 1000 ms
  const TWO_YEARS_IN_MS = 2 * 365 * 24 * 60 * 60 * 1000;

  // localStorage에서 데이터를 불러오는 함수 (2년 기한 체크)
  const loadFromLocalStorage = (key: string, defaultValue: any) => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;
      
      const parsedData = JSON.parse(stored);
      const now = Date.now();
      
      // 2년이 지났는지 확인
      if (parsedData.timestamp && now - parsedData.timestamp > TWO_YEARS_IN_MS) {
        localStorage.removeItem(key);
        return defaultValue;
      }
      
      return parsedData.data || parsedData; // 이전 버전 호환성
    } catch (error) {
      console.error(`Failed to load ${key} from localStorage:`, error);
      return defaultValue;
    }
  };

  // localStorage에 데이터를 저장하는 함수 (타임스탬프 포함)
  const saveToLocalStorage = (lawsData: LawSection[]) => {
    try {
      const dataToStore = {
        data: lawsData,
        timestamp: Date.now()
      };
      localStorage.setItem("registrationTaxLaws", JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Failed to save registrationTaxLaws to localStorage:", error);
    }
  };

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedLaws = loadFromLocalStorage("registrationTaxLaws", registrationTaxLaws);
    setLaws(savedLaws);
  }, []);

  // 키워드 검색 필터링
  const filteredLaws = laws.map(section => ({
    ...section,
    laws: section.laws.filter(law => {
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        law.title.toLowerCase().includes(query) ||
        law.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    })
  })).filter(section => section.laws.length > 0);

  const handleLawClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleKeywordSave = (newKeywords: string[]) => {
    if (editingLaw) {
      const newLaws = [...laws];
      newLaws[editingLaw.sectionIndex].laws[editingLaw.lawIndex].keywords = newKeywords;
      setLaws(newLaws);
      saveToLocalStorage(newLaws);
      setEditingLaw(null);
    }
  };

  const openKeywordEditor = (sectionIndex: number, lawIndex: number) => {
    setEditingLaw({ sectionIndex, lawIndex });
    setDialogOpen(true);
  };

  return (
    <Card className="bg-card/80 backdrop-blur shadow-card border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-xl font-bold text-law-primary flex items-center gap-2">
            <Book className="h-5 w-5" />
            등록면허세 관련법
          </CardTitle>
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground">
            "{searchQuery}" 검색 결과 ({filteredLaws.reduce((acc, section) => acc + section.laws.length, 0)}개)
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {filteredLaws.map((section, sectionIndex) => {
          const originalSectionIndex = laws.findIndex(s => s.title === section.title);
          return (
            <div key={sectionIndex}>
              <h3 className="font-semibold text-lg text-law-primary mb-3 border-b border-border pb-2">
                {section.title}
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {section.laws.map((law, lawIndex) => {
                  const originalLawIndex = laws[originalSectionIndex].laws.findIndex(l => l.title === law.title);
                  return (
                    <div
                      key={lawIndex}
                      className="p-3 border border-border rounded-lg hover:bg-accent hover:border-law-primary transition-colors duration-200 group bg-card/30"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <button
                          onClick={() => handleLawClick(law.url)}
                          className="text-left flex-1"
                        >
                          <span className="text-sm font-medium text-foreground group-hover:text-law-primary block">
                            {law.title}
                          </span>
                        </button>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openKeywordEditor(originalSectionIndex, originalLawIndex)}
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLawClick(law.url)}
                            className="h-6 w-6 p-0 opacity-50 group-hover:opacity-100 transition-opacity"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      {law.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {law.keywords.map((keyword, keywordIndex) => (
                            <Badge 
                              key={keywordIndex} 
                              variant="outline" 
                              className="text-xs px-2 py-0.5 text-law-secondary border-law-secondary/30"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        {filteredLaws.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-law-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-law-primary" />
            </div>
            <p className="text-lg font-medium text-foreground">검색 결과가 없습니다</p>
            <p className="text-muted-foreground mt-2">다른 키워드로 검색해보세요</p>
          </div>
        )}
      </CardContent>

      {editingLaw && (
        <EditKeywordsDialog
          isOpen={dialogOpen}
          onOpenChange={setDialogOpen}
          lawTitle={laws[editingLaw.sectionIndex].laws[editingLaw.lawIndex].title}
          keywords={laws[editingLaw.sectionIndex].laws[editingLaw.lawIndex].keywords}
          onSave={handleKeywordSave}
        />
      )}
    </Card>
  );
};
