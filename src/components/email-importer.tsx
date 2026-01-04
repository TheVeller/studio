'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { sampleEmailContent } from '@/lib/parser';
import { Mail, Paperclip, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface EmailImporterProps {
  onImport: (content: string) => void;
  isProcessing: boolean;
}

export function EmailImporter({ onImport, isProcessing }: EmailImporterProps) {
  const [content, setContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImportClick = () => {
    if (!content.trim()) {
      toast({
        title: 'Content is empty',
        description: 'Please paste email content or upload a file.',
        variant: 'destructive',
      });
      return;
    }
    onImport(content);
    setContent('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast({
          title: 'File Too Large',
          description: 'Please upload files smaller than 1MB.',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target?.result as string;
        setContent(prev => `${prev}\n---\n${fileContent}`.trim());
        toast({
          title: 'File Loaded',
          description: `${file.name} has been added to the text area.`,
        });
      };
      reader.onerror = () => {
        toast({
          title: 'File Read Error',
          description: `Could not read ${file.name}.`,
          variant: 'destructive',
        });
      }
      reader.readAsText(file);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Import Google Alerts
        </CardTitle>
        <CardDescription>
          Paste email content below or upload .eml files. Separate multiple alerts with "---".
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder={sampleEmailContent}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="bg-background"
        />
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
            <div className="w-full sm:w-auto">
              <Label htmlFor="eml-upload" className="sr-only">Upload .eml file</Label>
              <Input id="eml-upload" type="file" accept=".eml,.txt" onChange={handleFileChange} ref={fileInputRef} className="text-sm file:mr-2 file:text-primary file:font-semibold file:rounded-full file:border-0 file:bg-primary/10 hover:file:bg-primary/20"/>
            </div>
            <Button onClick={handleImportClick} disabled={isProcessing} className="w-full sm:w-auto">
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Paperclip className="mr-2 h-4 w-4" />
              )}
              Import & Analyze
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
