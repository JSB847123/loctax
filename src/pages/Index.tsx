import { useState } from "react";
import { SearchHeader } from "@/components/SearchHeader";
import { QuickLinks } from "@/components/QuickLinks";
import { SearchResults } from "@/components/SearchResults";
import { UserSidebar } from "@/components/UserSidebar";
import { BasicLawLinks } from "@/components/BasicLawLinks";
import { FAQ } from "@/components/FAQ";
import { PropertyTaxCalculator } from "@/components/PropertyTaxCalculator";
import { PropertyTaxLaws } from "@/components/PropertyTaxLaws";
import { AcquisitionTaxLaws } from "@/components/AcquisitionTaxLaws";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface MonthlySchedules {
  [month: string]: string[];
}

// Mock data for demonstration
const mockSearchResults = [
  {
    id: "1",
    title: "지방세법 제11조 (재산세의 납세의무자)",
    description: "재산세는 과세기준일 현재 토지, 건축물, 주택을 소유한 자에게 부과한다. 다만, 지상권, 전세권 그 밖에 사용·수익을 목적으로 하는 권리의 목적이 된 토지의 경우에는 그 권리자에게 부과할 수 있다.",
    type: "law" as const,
  },
  {
    id: "2", 
    title: "대법원 2023도1234 판결",
    description: "재산세 부과처분 취소 사건에서 과세객체의 소유권 인정 범위에 관한 판시",
    court: "대법원",
    date: "2023.05.15",
    caseNumber: "2023도1234",
    type: "precedent" as const,
  }
];

const initialNotes = [
  "재산세 계산 시 주의사항 확인 필요",
  "지방세법 개정 내용 검토"
];

const initialMonthlySchedules: MonthlySchedules = {
  "3월": ["재산세 신고 준비", "부동산 시세 조사"],
  "6월": ["재산세 납부 기한"],
  "9월": ["재산세 2차 납부"]
};

const Index = () => {
  const [searchResults, setSearchResults] = useState(mockSearchResults);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  const [monthlySchedules, setMonthlySchedules] = useState<MonthlySchedules>(initialMonthlySchedules);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [showPropertyTaxLaws, setShowPropertyTaxLaws] = useState(false);
  const [showAcquisitionTaxLaws, setShowAcquisitionTaxLaws] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setHasSearched(true);
    
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsSearching(false);
      toast({
        title: "검색 완료",
        description: `"${query}"에 대한 검색 결과를 찾았습니다.`,
      });
    }, 1000);
  };

  const handleQuickLinkClick = (title: string, isExternal?: boolean) => {
    if (isExternal) {
      toast({
        title: "외부 링크",
        description: "재산세 계산기 페이지로 이동합니다. (베타 버전)",
      });
      return;
    }
    
    if (title === "취득세 관련법") {
      setShowAcquisitionTaxLaws(true);
      toast({
        title: "취득세 관련법",
        description: "취득세 관련 법령 목록을 표시합니다.",
      });
      return;
    }
    
    if (title === "재산세 관련법") {
      setShowPropertyTaxLaws(true);
      toast({
        title: "재산세 관련법",
        description: "재산세 관련 법령 목록을 표시합니다.",
      });
      return;
    }
    
    if (title === "기타 관련법") {
      toast({
        title: "기타 관련법",
        description: "기타 관련 법령 목록을 표시합니다. (준비 중)",
      });
      return;
    }
    
    toast({
      title: "검색 시작",
      description: `${title} 관련 법령을 검색합니다.`,
    });
    handleSearch(title);
  };

  const handleBackToQuickLinks = () => {
    setShowPropertyTaxLaws(false);
    setShowAcquisitionTaxLaws(false);
  };

  const handleResultClick = (result: any) => {
    toast({
      title: "상세 내용",
      description: `${result.title}의 상세 내용을 확인합니다.`,
    });
  };

  const handleNotesChange = (newNotes: string[]) => {
    setNotes(newNotes);
  };

  const handleMonthlySchedulesChange = (newSchedules: MonthlySchedules) => {
    setMonthlySchedules(newSchedules);
  };

  const handleFAQsChange = (newFAQs: any[]) => {
    setFaqs(newFAQs);
  };

  return (
    <div className="min-h-screen bg-law-background">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        {/* Calculator positioned at top right */}
        <div className="absolute top-4 right-4 z-10 hidden lg:block">
          <PropertyTaxCalculator />
        </div>
        
        <div className="relative container mx-auto px-4 py-12 lg:py-20">
          <div className="text-center mb-8">
            <h1 className="text-4xl lg:text-6xl font-bold text-law-primary mb-8">
              취득세, 재산세 법령 정보 모음
            </h1>
          </div>
          
          <SearchHeader onSearch={handleSearch} />
        </div>
      </div>

      {/* Basic Law Links Section */}
      <div className="container mx-auto px-4 py-6">
        <BasicLawLinks />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {!hasSearched ? (
              <>
                {showPropertyTaxLaws ? (
                  <PropertyTaxLaws onBack={handleBackToQuickLinks} />
                ) : showAcquisitionTaxLaws ? (
                  <AcquisitionTaxLaws onBack={handleBackToQuickLinks} />
                ) : (
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">관련법 모음</h2>
                    <QuickLinks onLinkClick={handleQuickLinkClick} />
                  </div>
                )}
                
                {/* Mobile Calculator */}
                <div className="lg:hidden">
                  <PropertyTaxCalculator />
                </div>
                
                {/* FAQ Section */}
                <div className="mt-8">
                  <FAQ faqs={faqs} onFAQsChange={handleFAQsChange} />
                </div>
              </>
            ) : (
              <SearchResults 
                results={searchResults}
                totalCount={searchResults.length}
                onResultClick={handleResultClick}
                isLoading={isSearching}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <UserSidebar 
              notes={notes}
              onNotesChange={handleNotesChange}
              monthlySchedules={monthlySchedules}
              onMonthlySchedulesChange={handleMonthlySchedulesChange}
            />
          </div>
        </div>
      </div>


    </div>
  );
};

export default Index;
