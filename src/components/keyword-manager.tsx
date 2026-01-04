'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Tags } from 'lucide-react';

interface KeywordManagerProps {
  keywords: string[];
  setKeywords: React.Dispatch<React.SetStateAction<string[]>>;
}

export function KeywordManager({ keywords, setKeywords }: KeywordManagerProps) {
  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
    const trimmedKeyword = newKeyword.trim();
    if (trimmedKeyword && !keywords.includes(trimmedKeyword)) {
      setKeywords([...keywords, trimmedKeyword]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tags className="h-5 w-5" />
          Relevancy Keywords
        </CardTitle>
        <CardDescription>
          Add keywords to score the relevancy of incoming alerts. These keywords will also guide AI responses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
            placeholder="e.g., 'generative AI'"
          />
          <Button onClick={handleAddKeyword}>Add</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {keywords.length === 0 && <p className="text-sm text-muted-foreground">No keywords added yet.</p>}
          {keywords.map(keyword => (
            <Badge key={keyword} variant="secondary" className="py-1 pl-3 pr-1 text-sm">
              {keyword}
              <button
                onClick={() => handleRemoveKeyword(keyword)}
                className="ml-1 rounded-full p-0.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                aria-label={`Remove ${keyword}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
