'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { sampleEmailContent, parseEmailContent } from '@/lib/parser';
import { Mail, Paperclip, Loader2, FileText, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import type { Alert } from '@/lib/types';

interface EmailImporterProps {
  onAlertsImported: (alerts: Alert[]) => void;
  isProcessing: boolean;
}

export function EmailImporter({ onAlertsImported, isProcessing }: EmailImporterProps) {
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
    
    const parsedAlerts = parseEmailContent(content);
    if (parsedAlerts.length === 0) {
      toast({
        title: 'Parsing Failed',
        description: 'Could not find any alerts in the provided content. Please check the format.',
        variant: 'destructive',
      });
      return;
    }

    const newAlerts: Alert[] = parsedAlerts.map(pa => ({
      id: crypto.randomUUID(),
      title: pa.title!,
      snippet: pa.snippet!,
      source: pa.source!,
      link: pa.link!,
    }));

    onAlertsImported(newAlerts);
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

  const loadSample = () => {
    setContent(sampleEmailContent);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Mail className="h-6 w-6" />
          Import Google Alerts
        </CardTitle>
        <CardDescription>
          Paste raw email content below or upload .eml/.txt files to begin analyzing your alerts. This is a temporary solution until the Google Alerts connector is fully configured.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste email content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="bg-background focus:bg-white transition-colors"
        />
        <div className="flex items-center gap-4">
          <Label htmlFor="eml-upload" className="flex-1">
             <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()}>
                <Upload className="mr-2 h-4 w-4"/>
                Upload File
             </Button>
             <Input id="eml-upload" type="file" accept=".eml,.txt" onChange={handleFileChange} ref={fileInputRef} className="sr-only" />
          </Label>
          <Separator orientation="vertical" className="h-6"/>
          <Button variant="outline" onClick={loadSample}>
            <FileText className="mr-2 h-4 w-4"/>
            Load Sample
          </Button>
        </div>

        <Button onClick={handleImportClick} disabled={isProcessing} className="w-full text-base py-6">
          {isProcessing ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Paperclip className="mr-2 h-5 w-5" />
          )}
          Import & Analyze Alerts
        </Button>
      </CardContent>
    </Card>
  );
}
