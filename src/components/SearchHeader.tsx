import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface SearchHeaderProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchHeader({ onSearch, placeholder = "법령 관련 키워드 검색" }: SearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>([]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      if (!searchTags.includes(searchQuery.trim())) {
        setSearchTags([...searchTags, searchQuery.trim()]);
      }
      setSearchQuery("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSearchTags(searchTags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="relative">
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="h-12 pl-12 pr-4 text-lg bg-background/80 backdrop-blur border-border shadow-card rounded-full"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Button
          onClick={handleSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 px-6 rounded-full shadow-button bg-law-primary hover:bg-law-primary/90 text-primary-foreground"
          variant="default"
        >
          검색
        </Button>
      </div>
      
      {searchTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {searchTags.map((tag, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-3 py-1 bg-secondary/80 text-secondary-foreground border-border hover:bg-secondary"
            >
              {tag}
              <X
                className="ml-2 h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}