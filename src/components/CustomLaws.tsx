import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, ArrowLeft, ExternalLink, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CustomLaw {
  id: string;
  name: string;
  url: string;
  keywords: string[];
}

interface CustomLawsProps {
  onBack: () => void;
}

export function CustomLaws({ onBack }: CustomLawsProps) {
  const [customLaws, setCustomLaws] = useState<CustomLaw[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    keywords: ""
  });

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
  const saveToLocalStorage = (laws: CustomLaw[]) => {
    try {
      const dataToStore = {
        data: laws,
        timestamp: Date.now()
      };
      localStorage.setItem("customLaws", JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Failed to save customLaws to localStorage:", error);
    }
  };

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedLaws = loadFromLocalStorage("customLaws", []);
    setCustomLaws(savedLaws);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.url.trim()) {
      toast({
        title: "입력 오류",
        description: "법률명과 링크는 필수입니다.",
        variant: "destructive"
      });
      return;
    }

    // 키워드 처리 (최대 7개)
    const keywords = formData.keywords
      .split(",")
      .map(k => k.trim())
      .filter(k => k.length > 0)
      .slice(0, 7);

    const newLaw: CustomLaw = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      url: formData.url.trim(),
      keywords
    };

    const updatedLaws = [...customLaws, newLaw];
    setCustomLaws(updatedLaws);
    saveToLocalStorage(updatedLaws);

    // 폼 초기화
    setFormData({ name: "", url: "", keywords: "" });
    setShowForm(false);

    toast({
      title: "등록 완료",
      description: `${newLaw.name}이(가) 등록되었습니다.`,
    });
  };

  const handleDelete = (id: string) => {
    const updatedLaws = customLaws.filter(law => law.id !== id);
    setCustomLaws(updatedLaws);
    saveToLocalStorage(updatedLaws);

    toast({
      title: "삭제 완료",
      description: "법률이 삭제되었습니다.",
    });
  };

  const handleLinkClick = (url: string, name: string) => {
    window.open(url, "_blank");
    toast({
      title: "외부 링크 열기",
      description: `${name} 페이지를 새 탭에서 엽니다.`,
    });
  };

  const removeKeyword = (lawId: string, keywordIndex: number) => {
    const updatedLaws = customLaws.map(law => {
      if (law.id === lawId) {
        const newKeywords = law.keywords.filter((_, index) => index !== keywordIndex);
        return { ...law, keywords: newKeywords };
      }
      return law;
    });
    setCustomLaws(updatedLaws);
    saveToLocalStorage(updatedLaws);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            목록으로
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">내가 정리한 관련 법</h2>
            <p className="text-muted-foreground">나만의 법률 목록을 관리하세요</p>
          </div>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          법률 추가
        </Button>
      </div>

      {/* 법률 추가 폼 */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>새 법률 등록</CardTitle>
            <CardDescription>법률명, 링크, 키워드를 입력하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lawName">법률명 *</Label>
                <Input
                  id="lawName"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="예: 지방세법"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lawUrl">링크 *</Label>
                <Input
                  id="lawUrl"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://law.go.kr/..."
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="keywords">키워드 (최대 7개)</Label>
                <Input
                  id="keywords"
                  value={formData.keywords}
                  onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="취득세, 재산세, 등록세 (쉼표로 구분)"
                />
                <p className="text-sm text-muted-foreground">
                  키워드를 쉼표(,)로 구분하여 입력하세요. 최대 7개까지 등록 가능합니다.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit">등록</Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: "", url: "", keywords: "" });
                  }}
                >
                  취소
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 등록된 법률 목록 */}
      <div className="space-y-4">
        {customLaws.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <p>등록된 법률이 없습니다.</p>
                <p>새 법률을 추가해보세요.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          customLaws.map((law) => (
            <Card key={law.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{law.name}</h3>
                    
                    {/* 키워드 표시 */}
                    {law.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {law.keywords.map((keyword, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary"
                            className="text-xs flex items-center gap-1"
                          >
                            {keyword}
                            <X 
                              className="h-3 w-3 cursor-pointer hover:text-destructive" 
                              onClick={() => removeKeyword(law.id, index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLinkClick(law.url, law.name)}
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      법령 보기
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(law.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
