'use client';

import type { Alert } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Textarea } from '@/components/ui/textarea';
import { ExternalLink, Bot, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface AlertItemProps {
  alert: Alert;
  onGenerateDraft: (alertId: string) => void;
}

const getScoreBadge = (score?: number) => {
  if (typeof score === 'undefined') return null;

  if (score < 0) {
    return (
      <Badge variant="destructive" className="bg-red-100 text-red-800">
        <AlertTriangle className="mr-1 h-3 w-3" />
        Error
      </Badge>
    );
  }

  const roundedScore = Math.round(score * 100);
  let colorClass = 'bg-gray-100 text-gray-800';
  if (roundedScore >= 70) colorClass = 'bg-green-100 text-green-800';
  else if (roundedScore >= 40) colorClass = 'bg-yellow-100 text-yellow-800';
  else colorClass = 'bg-red-100 text-red-800';

  return (
    <Badge variant="outline" className={`border-0 ${colorClass}`}>
      {`Relevancy: ${roundedScore}%`}
    </Badge>
  );
};

export function AlertItem({ alert, onGenerateDraft }: AlertItemProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between gap-4">
          <CardTitle className="text-lg">{alert.title}</CardTitle>
          <Button variant="ghost" size="icon" asChild>
            <a href={alert.link} target="_blank" rel="noopener noreferrer" aria-label="Open source link">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        <CardDescription>{alert.source}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{alert.snippet}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-2">
          {alert.isScoring ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            getScoreBadge(alert.relevancyScore)
          )}
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger asChild>
              <Button variant="secondary" className="w-full justify-between">
                <span>
                  <Sparkles className="mr-2 inline-block h-4 w-4 text-primary/80" />
                  AI Draft Response
                </span>
                <Bot className="h-4 w-4" />
              </Button>
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              {alert.isDrafting && !alert.draftResponse ? (
                <div className="flex items-center justify-center rounded-md border p-4">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Generating draft...</span>
                </div>
              ) : alert.draftResponse ? (
                <Textarea readOnly value={alert.draftResponse} rows={5} className="bg-background" />
              ) : (
                <div className="flex flex-col items-center gap-4 rounded-md border p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    Generate an AI-powered draft response based on this alert.
                  </p>
                  <Button onClick={() => onGenerateDraft(alert.id)} disabled={alert.isDrafting}>
                    {alert.isDrafting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Draft
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardFooter>
    </Card>
  );
}
