import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ExternalLink, ArrowLeft, Book, Plus, Edit, Trash2, Search } from "lucide-react";
import { useState, useEffect } from "react";

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

const defaultPropertyTaxLaws: LawSection[] = [
  {
    title: "통칙",
    laws: [
      { title: "지방세법 제104조 (정의)", url: "https://law.go.kr/법령/지방세법/제104조", keywords: ["재산세", "정의", "토지", "건축물", "주택"] },
      { title: "지방세법 제105조 (과세대상)", url: "https://law.go.kr/법령/지방세법/제105조", keywords: ["재산세", "과세대상", "토지", "건축물", "주택"] },
      { title: "지방세법 제106조 (과세대상의 구분 등)", url: "https://law.go.kr/법령/지방세법/제106조", keywords: ["재산세", "과세대상", "구분", "종합합산과세대상", "별도합산과세대상"] },
      { title: "지방세법 제106조의2 (분리과세대상 토지 타당성 평가 등)", url: "https://law.go.kr/법령/지방세법/제106조의2", keywords: [] },
      { title: "지방세법 제107조 (납세의무자)", url: "https://law.go.kr/법령/지방세법/제107조", keywords: ["재산세", "납세의무자", "사실상소유자", "공유재산", "공부상소유자"] },
      { title: "지방세법 제108조 (납세지)", url: "https://law.go.kr/법령/지방세법/제108조", keywords: ["재산세", "납세지", "토지소재지", "건축물소재지", "주택소재지"] },
      { title: "지방세법 제109조 (비과세)", url: "https://law.go.kr/법령/지방세법/제109조", keywords: ["재산세", "비과세", "국가", "지방자치단체", "공용"] },
    ]
  },
  {
    title: "지방세법 시행령 - 통칙",
    laws: [
      { title: "지방세법 시행령 제101조(별도합산과세대상 토지의 범위)", url: "https://law.go.kr/법령/지방세법 시행령/제101조", keywords: ["별도합산", "토지", "범위", "공장용건축물", "부속토지"] },
      { title: "지방세법 시행령 제102조(분리과세대상 토지의 범위)", url: "https://law.go.kr/법령/지방세법 시행령/제102조", keywords: ["분리과세", "토지", "범위", "공장용지", "전답"] },
      { title: "지방세법 시행령 제103조(건축물의 범위 등)", url: "https://law.go.kr/법령/지방세법 시행령/제103조", keywords: ["건축물", "범위", "건축허가", "착공", "지상정착물"] },
      { title: "지방세법 시행령 제103조의2(철거·멸실된 건축물 또는 주택의 범위)", url: "https://law.go.kr/법령/지방세법 시행령/제103조의2", keywords: ["철거", "멸실", "건축물", "주택", "범위"] },
      { title: "지방세법 시행령 제104조(도시지역)", url: "https://law.go.kr/법령/지방세법 시행령/제104조", keywords: ["도시지역", "국토의계획및이용에관한법률", "제6조", "규정", "지역"] },
      { title: "지방세법 시행령 제105조(주택 부속토지의 범위 산정)", url: "https://law.go.kr/법령/지방세법 시행령/제105조", keywords: ["주택부속토지", "범위", "산정", "경계", "바닥면적"] },
      { title: "지방세법 시행령 제105조의2(공부상 등재현황에 따른 부과)", url: "https://law.go.kr/법령/지방세법 시행령/제105조의2", keywords: ["공부상등재현황", "부과", "재산세", "과세대상물건", "이용"] },
      { title: "지방세법 시행령 제105조의3(분리과세대상 토지 타당성 평가 등)", url: "https://law.go.kr/법령/지방세법 시행령/제105조의3", keywords: ["분리과세대상토지", "타당성평가", "확대", "추가", "중앙행정기관"] },
      { title: "지방세법 시행령 제106조(납세의무자의 범위 등)", url: "https://law.go.kr/법령/지방세법 시행령/제106조", keywords: ["납세의무자", "범위", "매수계약자", "주된상속자", "사실상소유자"] },
      { title: "지방세법 시행령 제107조(수익사업의 범위)", url: "https://law.go.kr/법령/지방세법 시행령/제107조", keywords: ["수익사업", "범위", "법인세법", "제4조제3항", "규정"] },
      { title: "지방세법 시행령 제108조(비과세)", url: "https://law.go.kr/법령/지방세법 시행령/제108조", keywords: ["비과세", "도로", "하천", "제방", "구거"] },
    ]
  },
  {
    title: "과세표준과 세율",
    laws: [
      { title: "지방세법 제110조(과세표준)", url: "https://law.go.kr/법령/지방세법/제110조", keywords: ["재산세", "과세표준", "시가표준액", "공정시장가액비율", "주택"] },
      { title: "지방세법 제111조(세율)", url: "https://law.go.kr/법령/지방세법/제111조", keywords: ["재산세", "세율", "토지", "건축물", "주택"] },
      { title: "지방세법 제111조의2(1세대 1주택에 대한 주택 세율 특례)", url: "https://law.go.kr/법령/지방세법/제111조의2", keywords: ["재산세", "1세대1주택", "세율특례", "시가표준액", "9억원"] },
      { title: "지방세법 제112조(재산세 도시지역분)", url: "https://law.go.kr/법령/지방세법/제112조", keywords: ["재산세", "도시지역분", "적용대상지역", "토지", "건축물"] },
      { title: "지방세법 제113조(세율적용)", url: "https://law.go.kr/법령/지방세법/제113조", keywords: ["재산세", "세율적용", "토지", "주택", "구분"] },
      { title: "지방세법 시행령 제109조(공정시장가액비율)", url: "https://law.go.kr/법령/지방세법 시행령/제109조", keywords: ["공정시장가액비율", "토지", "건축물", "주택", "시가표준액"] },
      { title: "지방세법 시행령 제109조의2(과세표준상한액)", url: "https://law.go.kr/법령/지방세법 시행령/제109조의2", keywords: ["과세표준상한액", "주택", "직전연도", "시가표준액", "공정시장가액비율"] },
      { title: "지방세법 시행령 제110조(공장용 건축물)", url: "https://law.go.kr/법령/지방세법 시행령/제110조", keywords: ["공장용건축물", "제조", "가공", "수선", "인쇄"] },
      { title: "지방세법 시행령 제110조의2(재산세 세율 특례 대상 1세대 1주택의 범위)", url: "https://law.go.kr/법령/지방세법 시행령/제110조의2", keywords: ["재산세", "세율특례", "1세대1주택", "범위", "세대별주민등록표"] },
      { title: "지방세법 시행령 제111조(토지 등의 범위)", url: "https://law.go.kr/법령/지방세법 시행령/제111조", keywords: ["토지", "범위", "도시지역", "건축물", "주택"] },
      { title: "지방세법 시행령 제112조(주택의 구분)", url: "https://law.go.kr/법령/지방세법 시행령/제112조", keywords: ["주택", "구분", "다가구주택", "1가구", "1구"] },
    ]
  },
  {
    title: "지역자원시설세",
    laws: [
      { title: "지방세법 제141조(목적)", url: "https://law.go.kr/법령/지방세법/제141조", keywords: ["지역자원시설세", "목적", "지역자원", "보호", "환경개선"] },
      { title: "지방세법 제142조(과세대상)", url: "https://law.go.kr/법령/지방세법/제142조", keywords: ["지역자원시설세", "과세대상", "특정자원분", "특정시설분", "소방분"] },
      { title: "지방세법 제143조(납세의무자)", url: "https://law.go.kr/법령/지방세법/제143조", keywords: ["지역자원시설세", "납세의무자", "발전용수", "지하수", "지하자원"] },
      { title: "지방세법 제144조(납세지)", url: "https://law.go.kr/법령/지방세법/제144조", keywords: ["지역자원시설세", "납세지", "발전소소재지", "채수공소재지", "광업권"] },
      { title: "지방세법 제145조(비과세)", url: "https://law.go.kr/법령/지방세법/제145조", keywords: ["지역자원시설세", "비과세", "국가", "지방자치단체", "개발"] },
      { title: "지방세법 제146조(과세표준과 세율)", url: "https://law.go.kr/법령/지방세법/제146조", keywords: ["지역자원시설세", "과세표준", "세율", "특정자원분", "특정시설분"] },
      { title: "지방세법 제147조(부과·징수)", url: "https://law.go.kr/법령/지방세법/제147조", keywords: ["지역자원시설세", "부과", "징수", "특정자원분", "신고납부"] },
      { title: "지방세법 제148조(소액 징수면제)", url: "https://law.go.kr/법령/지방세법/제148조", keywords: ["지역자원시설세", "소액", "징수면제", "고지서", "2천원"] },
      { title: "지방세법 시행령 제136조(과세대상)", url: "https://law.go.kr/법령/지방세법 시행령/제136조", keywords: ["지역자원시설세", "과세대상", "특정자원분", "특정시설분", "발전용수"] },
      { title: "지방세법 시행령 제137조(비과세)", url: "https://law.go.kr/법령/지방세법 시행령/제137조", keywords: ["지역자원시설세", "비과세", "시설", "소방분", "제외"] },
      { title: "지방세법 시행령 제138조(화재위험 건축물 등)", url: "https://law.go.kr/법령/지방세법 시행령/제138조", keywords: ["화재위험건축물", "저유장", "주유소", "정유소", "유흥장"] },
      { title: "지방세법 시행령 제139조(납세고지)", url: "https://law.go.kr/법령/지방세법 시행령/제139조", keywords: ["납세고지", "소방분", "지역자원시설세", "재산세", "납기"] },
      { title: "지방세법 시행규칙 제74조(과세대상 용수)", url: "https://law.go.kr/법령/지방세법 시행규칙/제74조", keywords: ["지역자원시설세", "과세대상", "용수", "생활용수", "공업용수"] },
      { title: "지방세법 시행규칙 제75조(다른 용도와 겸용되거나 구분 사용되는 화재위험 건축물의 세액 산정방법 등)", url: "https://law.go.kr/법령/지방세법 시행규칙/제75조", keywords: ["지역자원시설세", "화재위험", "건축물", "세액", "산정방법"] },
    ]
  },
  {
    title: "지방교육세",
    laws: [
      { title: "지방세법 제149조(목적)", url: "https://law.go.kr/법령/지방세법/제149조", keywords: ["지방교육세", "목적", "지방교육", "질적향상", "재정확충"] },
      { title: "지방세법 제150조(납세의무자)", url: "https://law.go.kr/법령/지방세법/제150조", keywords: ["지방교육세", "납세의무자", "취득세", "등록면허세", "레저세"] },
      { title: "지방세법 제151조(과세표준과 세율)", url: "https://law.go.kr/법령/지방세법/제151조", keywords: ["지방교육세", "과세표준", "세율", "취득물건", "등록면허세액"] },
      { title: "지방세법 제152조(신고 및 납부와 부과·징수)", url: "https://law.go.kr/법령/지방세법/제152조", keywords: ["지방교육세", "신고", "납부", "부과징수", "취득세"] },
      { title: "지방세법 제153조(부족세액의 추징 및 가산세)", url: "https://law.go.kr/법령/지방세법/제153조", keywords: ["지방교육세", "부족세액", "추징", "가산세", "신고의무"] },
      { title: "지방세법 제154조(환급)", url: "https://law.go.kr/법령/지방세법/제154조", keywords: ["지방교육세", "환급", "지방세환급금", "과세표준", "세목별세액"] },
      { title: "지방세법 시행령 제140조(과세표준의 계산)", url: "https://law.go.kr/법령/지방세법 시행령/제140조", keywords: ["지방교육세", "과세표준", "계산", "가산세", "산입"] },
      { title: "지방세법 시행령 제141조(신고납부와 부과·징수)", url: "https://law.go.kr/법령/지방세법 시행령/제141조", keywords: ["지방교육세", "신고납부", "부과징수", "납세의무자", "신고서"] },
    ]
  },
  {
    title: "부과·징수",
    laws: [
      { title: "지방세법 제114조(과세기준일)", url: "https://law.go.kr/법령/지방세법/제114조", keywords: ["재산세", "과세기준일", "매년", "6월1일", "기준"] },
      { title: "지방세법 제115조(납기)", url: "https://law.go.kr/법령/지방세법/제115조", keywords: ["재산세", "납기", "토지", "건축물", "주택"] },
      { title: "지방세법 제116조(징수방법 등)", url: "https://law.go.kr/법령/지방세법/제116조", keywords: ["재산세", "징수방법", "보통징수", "납세고지서", "발급"] },
      { title: "지방세법 제117조(물납)", url: "https://law.go.kr/법령/지방세법/제117조", keywords: ["재산세", "물납", "납부세액", "1천만원", "부동산"] },
      { title: "지방세법 제118조(분할납부)", url: "https://law.go.kr/법령/지방세법/제118조", keywords: ["재산세", "분할납부", "납부세액", "250만원", "3개월"] },
      { title: "지방세법 제118조의2(납부유예)", url: "https://law.go.kr/법령/지방세법/제118조의2", keywords: ["재산세", "납부유예", "1세대1주택", "신청", "담보"] },
      { title: "지방세법 제119조(소액 징수면제)", url: "https://law.go.kr/법령/지방세법/제119조", keywords: ["재산세", "소액", "징수면제", "고지서", "2천원"] },
      { title: "지방세법 제119조의2(신탁재산 수탁자의 물적납세의무)", url: "https://law.go.kr/법령/지방세법/제119조의2", keywords: ["신탁재산", "수탁자", "물적납세의무", "위탁자", "체납"] },
      { title: "지방세법 제119조의3(향교 및 종교단체에 대한 특례)", url: "https://law.go.kr/법령/지방세법/제119조의3", keywords: ["향교", "종교단체", "특례", "개별단체", "합산과세"] },
      { title: "지방세법 제120조(신고의무)", url: "https://law.go.kr/법령/지방세법/제120조", keywords: ["재산세", "신고의무", "소유권변동", "상속", "종중재산"] },
      { title: "지방세법 제121조(재산세 과세대장의 비치 등)", url: "https://law.go.kr/법령/지방세법/제121조", keywords: ["재산세", "과세대장", "비치", "전산처리", "작성"] },
      { title: "지방세법 제122조(세 부담의 상한)", url: "https://law.go.kr/법령/지방세법/제122조", keywords: ["재산세", "세부담", "상한", "산출세액", "직전연도"] },
      { title: "지방세법 제123조(부동산 과세자료분석 전담기구의 설치 등)", url: "https://law.go.kr/법령/지방세법/제123조", keywords: ["부동산", "과세자료분석", "전담기구", "설치", "행정안전부"] },
    ]
  },
  {
    title: "지방세법 시행규칙",
    laws: [
      { title: "지방세법 시행규칙 제49조(건축물 시가표준액의 기준)", url: "https://law.go.kr/법령/지방세법 시행규칙/제49조", keywords: ["재산세", "건축물", "시가표준액", "기준", "과세기준일"] },
      { title: "지방세법 시행규칙 제50조(공장입지기준면적)", url: "https://law.go.kr/법령/지방세법 시행규칙/제50조", keywords: ["재산세", "공장", "입지기준면적", "행정안전부령", "별표"] },
      { title: "지방세법 시행규칙 제50조의2(분리과세대상 토지 적용의 신청)", url: "https://law.go.kr/법령/지방세법 시행규칙/제50조의2", keywords: ["재산세", "분리과세", "토지", "적용", "신청"] },
      { title: "지방세법 시행규칙 제51조(지상정착물의 범위)", url: "https://law.go.kr/법령/지방세법 시행규칙/제51조", keywords: ["재산세", "지상정착물", "범위", "가스배관시설", "송수신시설"] },
      { title: "지방세법 시행규칙 제52조(공장용 건축물의 범위)", url: "https://law.go.kr/법령/지방세법 시행규칙/제52조", keywords: ["재산세", "공장용", "건축물", "범위", "제조시설용"] },
      { title: "지방세법 시행규칙 제53조(주된 상속자의 기준)", url: "https://law.go.kr/법령/지방세법 시행규칙/제53조", keywords: ["재산세", "주된상속자", "기준", "상속지분", "나이"] },
      { title: "지방세법 시행규칙 제54조(납세의무 통지)", url: "https://law.go.kr/법령/지방세법 시행규칙/제54조", keywords: ["재산세", "납세의무", "통지", "사용자", "서식"] },
      { title: "지방세법 시행규칙 제55조(공장용 건축물의 범위)", url: "https://law.go.kr/법령/지방세법 시행규칙/제55조", keywords: ["재산세", "도시지역분", "공장용", "건축물", "범위"] },
      { title: "지방세법 시행규칙 제56조(공장의 범위와 적용기준)", url: "https://law.go.kr/법령/지방세법 시행규칙/제56조", keywords: ["재산세", "공장", "범위", "적용기준", "과세기준일"] },
      { title: "지방세법 시행규칙 제56조의2(재산세 세율 특례 적용을 위한 신청)", url: "https://law.go.kr/법령/지방세법 시행규칙/제56조의2", keywords: ["재산세", "세율", "특례", "신청", "주택수"] },
      { title: "지방세법 시행규칙 제57조(재산세 도시지역분 과세대상 토지의 범위)", url: "https://law.go.kr/법령/지방세법 시행규칙/제57조", keywords: ["재산세", "도시지역분", "과세대상", "토지", "범위"] },
      { title: "지방세법 시행규칙 제58조(재산세의 합산 및 세액산정 등)", url: "https://law.go.kr/법령/지방세법 시행규칙/제58조", keywords: ["재산세", "합산", "세액산정", "부과절차", "징수방법"] },
      { title: "지방세법 시행규칙 제59조(재산세의 물납 절차 등)", url: "https://law.go.kr/법령/지방세법 시행규칙/제59조", keywords: ["재산세", "물납", "절차", "신청", "허가"] },
      { title: "지방세법 시행규칙 제60조(시가로 인정되는 부동산가액)", url: "https://law.go.kr/법령/지방세법 시행규칙/제60조", keywords: ["재산세", "시가", "부동산가액", "과세기준일", "감정가액"] },
      { title: "지방세법 시행규칙 제61조(분할납부신청)", url: "https://law.go.kr/법령/지방세법 시행규칙/제61조", keywords: ["재산세", "분할납부", "신청", "별지서식", "기한"] },
      { title: "지방세법 시행규칙 제61조의2(신탁재산 물적납세의무 납부통지서)", url: "https://law.go.kr/법령/지방세법 시행규칙/제61조의2", keywords: ["재산세", "신탁재산", "물적납세의무", "납부통지서", "수탁자"] },
      { title: "지방세법 시행규칙 제61조의3(향교 및 종교단체에 대한 재산세 특례 신청)", url: "https://law.go.kr/법령/지방세법 시행규칙/제61조의3", keywords: ["재산세", "향교", "종교단체", "특례", "신청"] },
      { title: "지방세법 시행규칙 제61조의4(주택 재산세액의 납부유예)", url: "https://law.go.kr/법령/지방세법 시행규칙/제61조의4", keywords: ["재산세", "주택", "납부유예", "신청서", "서류"] },
      { title: "지방세법 시행규칙 제62조(재산세 납세의무자의 신고 등)", url: "https://law.go.kr/법령/지방세법 시행규칙/제62조", keywords: ["재산세", "납세의무자", "신고", "소유권변동", "신탁재산"] },
      { title: "지방세법 시행규칙 제63조(과세대장 직권등재)", url: "https://law.go.kr/법령/지방세법 시행규칙/제63조", keywords: ["재산세", "과세대장", "직권등재", "통지", "납세의무자"] },
      { title: "지방세법 시행규칙 제64조(과세대장 비치)", url: "https://law.go.kr/법령/지방세법 시행규칙/제64조", keywords: ["재산세", "과세대장", "비치", "서식", "비과세"] },
      { title: "지방세법 시행규칙 제64조의2(직전 연도의 재산세액 상당액 계산식)", url: "https://law.go.kr/법령/지방세법 시행규칙/제64조의2", keywords: ["재산세", "직전연도", "세액상당액", "계산식", "주택"] },
    ]
  }
];

interface PropertyTaxLawsProps {
  onBack: () => void;
  searchQuery?: string;
}

export const PropertyTaxLaws = ({ onBack, searchQuery = "" }: PropertyTaxLawsProps) => {
  const [laws, setLaws] = useState<LawSection[]>(defaultPropertyTaxLaws);
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
      localStorage.setItem("propertyTaxLaws", JSON.stringify(dataToStore));
    } catch (error) {
      console.error("Failed to save propertyTaxLaws to localStorage:", error);
    }
  };

  // 로컬 스토리지에서 데이터 로드
  useEffect(() => {
    const savedLaws = loadFromLocalStorage("propertyTaxLaws", defaultPropertyTaxLaws);
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
            재산세 관련법
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