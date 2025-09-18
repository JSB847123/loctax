import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ExternalLink, ArrowLeft, Book, Plus, Edit, Trash2, Search } from "lucide-react";
import { useState, useEffect } from "react";

// Import law data
import { localTaxActDecree, localTaxActRule } from "@/data/acquisitionTaxLawsData1";
import { specialLocalTaxRestrictionAct } from "@/data/acquisitionTaxLawsData2";
import { specialLocalTaxRestrictionActDecree, specialLocalTaxRestrictionActRule } from "@/data/acquisitionTaxLawsData3";

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

// 지방세법 데이터
const localTaxAct: LawSection[] = [
  {
    title: "지방세법 - 통칙",
    laws: [
      {
        title: "지방세법 제6조(정의)",
        url: "https://www.law.go.kr/법령/지방세법/제6조",
        keywords: ["취득세", "용어", "정의", "취득", "부동산"]
      },
      {
        title: "지방세법 제7조(납세의무자 등)",
        url: "https://www.law.go.kr/법령/지방세법/제7조",
        keywords: ["취득세", "납세의무자", "취득", "부동산등", "소유자"]
      },
      {
        title: "지방세법 제8조(납세지)",
        url: "https://www.law.go.kr/법령/지방세법/제8조",
        keywords: ["취득세", "납세지", "부동산", "소재지", "차량"]
      },
      {
        title: "지방세법 제9조(비과세)",
        url: "https://www.law.go.kr/법령/지방세법/제9조",
        keywords: ["취득세", "비과세", "국가", "지방자치단체", "신탁"]
      }
    ]
  },
  {
    title: "지방세법 - 과세표준과 세율",
    laws: [
      {
        title: "지방세법 제10조(과세표준의 기준)",
        url: "https://www.law.go.kr/법령/지방세법/제10조",
        keywords: ["취득세", "과세표준", "기준", "취득당시가액", "연부금액"]
      },
      {
        title: "지방세법 제10조의2(무상취득의 경우 과세표준)",
        url: "https://www.law.go.kr/법령/지방세법/제10조의2",
        keywords: ["취득세", "무상취득", "과세표준", "시가인정액", "시가표준액"]
      },
      {
        title: "지방세법 제10조의3(유상승계취득의 경우 과세표준)",
        url: "https://www.law.go.kr/법령/지방세법/제10조의3",
        keywords: ["취득세", "유상승계취득", "과세표준", "사실상취득가격", "시가인정액"]
      },
      {
        title: "지방세법 제10조의4(원시취득의 경우 과세표준)",
        url: "https://www.law.go.kr/법령/지방세법/제10조의4",
        keywords: ["취득세", "원시취득", "과세표준", "사실상취득가격", "시가표준액"]
      },
      {
        title: "지방세법 제10조의5(무상취득ㆍ유상승계취득·원시취득의 경우 과세표준에 대한 특례)",
        url: "https://www.law.go.kr/법령/지방세법/제10조의5",
        keywords: ["취득세", "과세표준", "특례", "차량", "기계장비"]
      },
      {
        title: "지방세법 제10조의6(취득으로 보는 경우의 과세표준)",
        url: "https://www.law.go.kr/법령/지방세법/제10조의6",
        keywords: ["취득세", "과세표준", "지목변경", "과점주주", "증가가액"]
      },
      {
        title: "지방세법 제10조의7(취득의 시기)",
        url: "https://www.law.go.kr/법령/지방세법/제10조의7",
        keywords: ["취득세", "취득시기", "취득유형별", "대통령령", "규정"]
      },
      {
        title: "지방세법 제11조(부동산 취득의 세율)",
        url: "https://www.law.go.kr/법령/지방세법/제11조",
        keywords: ["부동산", "취득", "세율", "상속", "무상취득"]
      },
      {
        title: "지방세법 제12조(부동산 외 취득의 세율)",
        url: "https://www.law.go.kr/법령/지방세법/제12조",
        keywords: ["부동산외", "취득", "세율", "선박", "차량"]
      },
      {
        title: "지방세법 제13조(과밀억제권역 안 취득 등 중과)",
        url: "https://www.law.go.kr/법령/지방세법/제13조",
        keywords: ["과밀억제권역", "취득", "중과", "본점", "공장"]
      },
      {
        title: "지방세법 제13조의2(법인의 주택 취득 등 중과)",
        url: "https://www.law.go.kr/법령/지방세법/제13조의2",
        keywords: ["법인", "주택취득", "중과", "1세대2주택", "조정대상지역"]
      },
      {
        title: "지방세법 제13조의3(주택 수의 판단 범위)",
        url: "https://www.law.go.kr/법령/지방세법/제13조의3",
        keywords: ["주택수", "판단범위", "신탁", "조합원입주권", "주택분양권"]
      },
      {
        title: "지방세법 제14조(조례에 따른 세율 조정)",
        url: "https://www.law.go.kr/법령/지방세법/제14조",
        keywords: ["세율조정", "조례", "지방자치단체", "100분의50", "가감"]
      },
      {
        title: "지방세법 제15조(세율의 특례)",
        url: "https://www.law.go.kr/법령/지방세법/제15조",
        keywords: ["세율", "특례", "환매등기", "상속", "법인합병"]
      },
      {
        title: "지방세법 제16조(세율 적용)",
        url: "https://www.law.go.kr/법령/지방세법/제16조",
        keywords: ["세율적용", "토지", "건축물", "취득", "추징"]
      },
      {
        title: "지방세법 제17조(면세점)",
        url: "https://www.law.go.kr/법령/지방세법/제17조",
        keywords: ["취득세", "면세점", "취득가액", "50만원", "부과"]
      }
    ]
  },
  {
    title: "지방세법 - 부과ㆍ징수",
    laws: [
      {
        title: "지방세법 제18조(징수방법)",
        url: "https://www.law.go.kr/법령/지방세법/제18조",
        keywords: ["취득세", "징수방법", "신고납부", "규정", "방법"]
      },
      {
        title: "지방세법 제19조(통보 등)",
        url: "https://www.law.go.kr/법령/지방세법/제19조",
        keywords: ["취득세", "과세물건", "매각", "통보", "신고"]
      },
      {
        title: "지방세법 제20조(신고 및 납부)",
        url: "https://www.law.go.kr/법령/지방세법/제20조",
        keywords: ["취득세", "신고", "납부", "취득일", "과세표준"]
      },
      {
        title: "지방세법 제21조(부족세액의 추징 및 가산세)",
        url: "https://www.law.go.kr/법령/지방세법/제21조",
        keywords: ["취득세", "부족세액", "추징", "가산세", "신고의무"]
      },
      {
        title: "지방세법 제22조(등기자료의 통보)",
        url: "https://www.law.go.kr/법령/지방세법/제22조",
        keywords: ["등기자료", "통보", "등기등록관서", "납세지", "지방자치단체"]
      },
      {
        title: "지방세법 제22조의2(장부 등의 작성과 보존)",
        url: "https://www.law.go.kr/법령/지방세법/제22조의2",
        keywords: ["장부", "작성", "보존", "취득당시가액", "증거서류"]
      },
      {
        title: "지방세법 제22조의3(가족관계등록 전산정보 등의 공동이용)",
        url: "https://www.law.go.kr/법령/지방세법/제22조의3",
        keywords: ["가족관계등록", "전산정보", "공동이용", "주택소유관계", "확인"]
      },
      {
        title: "지방세법 제22조의4(증여세 관련 자료의 통보)",
        url: "https://www.law.go.kr/법령/지방세법/제22조의4",
        keywords: ["증여세", "관련자료", "통보", "부동산", "부과징수"]
      }
    ]
  }
];

// Combine all data
const acquisitionTaxLaws: LawSection[] = [
  ...localTaxAct,
  ...localTaxActDecree,
  localTaxActRule,
  ...specialLocalTaxRestrictionAct,
  ...specialLocalTaxRestrictionActDecree,
  specialLocalTaxRestrictionActRule
];

interface AcquisitionTaxLawsProps {
  onBack: () => void;
  searchQuery?: string;
}

export const AcquisitionTaxLaws = ({ onBack, searchQuery = "" }: AcquisitionTaxLawsProps) => {
  const [laws, setLaws] = useState<LawSection[]>(acquisitionTaxLaws);
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
      localStorage.setItem("acquisitionTaxLaws", JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Failed to save acquisitionTaxLaws to localStorage:", error);
    }
  };

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedLaws = loadFromLocalStorage("acquisitionTaxLaws", acquisitionTaxLaws);
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
            취득세 관련법
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

// Component is already exported above