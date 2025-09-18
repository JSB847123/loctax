import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Plus, Edit3, Trash2, Check, X, Globe, ExternalLink, Calendar, Grid3X3, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MonthlySchedules {
  [month: string]: string[];
}

interface UserSidebarProps {
  notes: string[];
  onNotesChange?: (notes: string[]) => void;
  monthlySchedules?: MonthlySchedules;
  onMonthlySchedulesChange?: (schedules: MonthlySchedules) => void;
}

const frequentSites = [
  {
    title: "부동산 공시가격 알리미",
    url: "https://www.realtyprice.kr/notice/main/mainBody.htm",
  },
  {
    title: "한국지방세연구원",
    url: "https://www.olta.re.kr/main.do",
  },
  {
    title: "택스넷",
    url: "https://www.taxnet.co.kr/",
  },
  {
    title: "렌트홈",
    url: "https://intra.renthome.go.kr/intraportal/login/login.open",
  },
];

const MONTHS = [
  "1월", "2월", "3월", "4월", "5월", "6월",
  "7월", "8월", "9월", "10월", "11월", "12월"
];

export function UserSidebar({ 
  notes: initialNotes = [],
  onNotesChange,
  monthlySchedules: initialMonthlySchedules = {},
  onMonthlySchedulesChange
}: UserSidebarProps) {
  const [notes, setNotes] = useState<string[]>(initialNotes);
  const [isAdding, setIsAdding] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newNote, setNewNote] = useState("");
  const [editNote, setEditNote] = useState("");
  
  // 메모 보기 모드 상태
  const [noteViewMode, setNoteViewMode] = useState<'card' | 'list'>('card');
  
  // 월별 일정 상태
  const [monthlySchedules, setMonthlySchedules] = useState<MonthlySchedules>(initialMonthlySchedules);
  const [addingMonth, setAddingMonth] = useState<string | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<{month: string, index: number} | null>(null);
  const [newSchedule, setNewSchedule] = useState("");
  const [editSchedule, setEditSchedule] = useState("");
  
  const { toast } = useToast();

  // props가 변경될 때 상태 동기화
  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  useEffect(() => {
    setMonthlySchedules(initialMonthlySchedules);
  }, [initialMonthlySchedules]);

  const updateNotes = (newNotes: string[]) => {
    setNotes(newNotes);
    onNotesChange?.(newNotes);
  };

  const updateMonthlySchedules = (newSchedules: MonthlySchedules) => {
    setMonthlySchedules(newSchedules);
    onMonthlySchedulesChange?.(newSchedules);
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const updatedNotes = [...notes, newNote.trim()];
      updateNotes(updatedNotes);
      setNewNote("");
      setIsAdding(false);
      toast({
        title: "메모 추가됨",
        description: "새 메모가 성공적으로 추가되었습니다.",
      });
    }
  };

  const handleEditNote = (index: number) => {
    if (editNote.trim()) {
      const updatedNotes = [...notes];
      updatedNotes[index] = editNote.trim();
      updateNotes(updatedNotes);
      setEditingIndex(null);
      setEditNote("");
      toast({
        title: "메모 수정됨",
        description: "메모가 성공적으로 수정되었습니다.",
      });
    }
  };

  const handleDeleteNote = (index: number) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    updateNotes(updatedNotes);
    toast({
      title: "메모 삭제됨",
      description: "메모가 성공적으로 삭제되었습니다.",
    });
  };

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditNote(notes[index]);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditNote("");
  };

  const cancelAdding = () => {
    setIsAdding(false);
    setNewNote("");
  };

  const handleSiteClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // 월별 일정 관리 함수들
  const handleAddSchedule = (month: string) => {
    if (newSchedule.trim()) {
      const updatedSchedules = { ...monthlySchedules };
      if (!updatedSchedules[month]) {
        updatedSchedules[month] = [];
      }
      updatedSchedules[month] = [...updatedSchedules[month], newSchedule.trim()];
      updateMonthlySchedules(updatedSchedules);
      setNewSchedule("");
      setAddingMonth(null);
      toast({
        title: "일정 추가됨",
        description: `${month} 일정이 성공적으로 추가되었습니다.`,
      });
    }
  };

  const handleEditSchedule = (month: string, index: number) => {
    if (editSchedule.trim()) {
      const updatedSchedules = { ...monthlySchedules };
      updatedSchedules[month][index] = editSchedule.trim();
      updateMonthlySchedules(updatedSchedules);
      setEditingSchedule(null);
      setEditSchedule("");
      toast({
        title: "일정 수정됨",
        description: `${month} 일정이 성공적으로 수정되었습니다.`,
      });
    }
  };

  const handleDeleteSchedule = (month: string, index: number) => {
    const updatedSchedules = { ...monthlySchedules };
    updatedSchedules[month] = updatedSchedules[month].filter((_, i) => i !== index);
    if (updatedSchedules[month].length === 0) {
      delete updatedSchedules[month];
    }
    updateMonthlySchedules(updatedSchedules);
    toast({
      title: "일정 삭제됨",
      description: `${month} 일정이 성공적으로 삭제되었습니다.`,
    });
  };

  const startEditingSchedule = (month: string, index: number) => {
    setEditingSchedule({ month, index });
    setEditSchedule(monthlySchedules[month][index]);
  };

  const cancelEditingSchedule = () => {
    setEditingSchedule(null);
    setEditSchedule("");
  };

  const cancelAddingSchedule = () => {
    setAddingMonth(null);
    setNewSchedule("");
  };

  return (
    <div className="space-y-6">
      {/* 자주가는 사이트 섹션 */}
      <Card className="bg-gradient-card border-law-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-4 w-4 text-law-primary" />
            자주가는 사이트
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {frequentSites.map((site, index) => (
            <button
              key={index}
              onClick={() => handleSiteClick(site.url)}
              className="w-full p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-colors group text-left"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground group-hover:text-law-primary">
                  {site.title}
                </span>
                <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-law-primary" />
              </div>
            </button>
          ))}
        </CardContent>
      </Card>
      {/* 메모 섹션 */}
      <Card className="bg-gradient-card border-law-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <StickyNote className="h-4 w-4 text-law-primary" />
              메모
            </CardTitle>
            <div className="flex items-center gap-1">
              {/* 보기 모드 전환 버튼 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setNoteViewMode(noteViewMode === 'card' ? 'list' : 'card')}
                className="h-8 w-8 p-0"
                title={noteViewMode === 'card' ? '리스트 보기' : '카드 보기'}
              >
                {noteViewMode === 'card' ? (
                  <List className="h-4 w-4" />
                ) : (
                  <Grid3X3 className="h-4 w-4" />
                )}
              </Button>
              {!isAdding && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAdding(true)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {notes.length === 0 && !isAdding ? (
            <p className="text-sm text-muted-foreground">메모가 없습니다</p>
          ) : (
            <>
              {notes.map((note, index) => (
                <div key={index} className="group relative">
                  {editingIndex === index ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="min-h-[60px] text-xs"
                        placeholder="메모를 입력하세요..."
                      />
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditNote(index)}
                          className="h-6 px-2"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                          className="h-6 px-2"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : noteViewMode === 'card' ? (
                    <div className="p-3 bg-white/50 rounded-lg">
                      <p className="text-xs leading-relaxed mb-2">{note}</p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(index)}
                          className="h-6 px-2"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(index)}
                          className="h-6 px-2 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 bg-white/30 rounded border-l-2 border-law-primary/30 hover:bg-white/50 transition-colors">
                      <p className="text-xs leading-relaxed flex-1 truncate pr-2" title={note}>
                        {note}
                      </p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(index)}
                          className="h-5 w-5 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(index)}
                          className="h-5 w-5 p-0 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isAdding && (
                <div className="space-y-2">
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="min-h-[60px] text-xs"
                    placeholder="새 메모를 입력하세요..."
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAddNote}
                      className="h-6 px-2"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={cancelAdding}
                      className="h-6 px-2"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {!isAdding && notes.length > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 border-law-border"
              onClick={() => setIsAdding(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              메모 추가
            </Button>
          )}
        </CardContent>
      </Card>

      {/* 월별 일정 섹션 */}
      <Card className="bg-gradient-card border-law-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4 text-law-primary" />
            월별 일정
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-4">
          {MONTHS.map((month) => (
            <div key={month} className="border border-law-border/30 rounded-lg p-3 bg-white/30">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-foreground">{month}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAddingMonth(month)}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {monthlySchedules[month]?.map((schedule, index) => (
                  <div key={index} className="group">
                    {editingSchedule?.month === month && editingSchedule?.index === index ? (
                      <div className="space-y-2">
                        <Input
                          value={editSchedule}
                          onChange={(e) => setEditSchedule(e.target.value)}
                          className="text-xs h-8"
                          placeholder="일정을 입력하세요..."
                        />
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSchedule(month, index)}
                            className="h-6 px-2"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={cancelEditingSchedule}
                            className="h-6 px-2"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 bg-white/50 rounded text-xs">
                        <span className="flex-1">{schedule}</span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditingSchedule(month, index)}
                            className="h-5 w-5 p-0"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSchedule(month, index)}
                            className="h-5 w-5 p-0 text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {addingMonth === month && (
                  <div className="space-y-2">
                    <Input
                      value={newSchedule}
                      onChange={(e) => setNewSchedule(e.target.value)}
                      className="text-xs h-8"
                      placeholder="새 일정을 입력하세요..."
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddSchedule(month)}
                        className="h-6 px-2"
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelAddingSchedule}
                        className="h-6 px-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {!monthlySchedules[month]?.length && addingMonth !== month && (
                  <p className="text-xs text-muted-foreground text-center py-2">
                    일정이 없습니다
                  </p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}