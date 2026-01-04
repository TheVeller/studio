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
import { ExternalLink, Bot, Loader2, Sparkles, AlertTriangle, Info } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AlertItemProps {
  alert: Alert;
  onGenerateDraft: (alertId: string) => void;
}

const getScoreBadge = (score?: number, reason?: string) => {
  if (typeof score === 'undefined') return null;

  if (score < 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="destructive">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Error
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>{reason || 'An unknown error occurred during scoring.'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const roundedScore = Math.round(score * 100);
  let colorClass = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
  let ringClass = 'ring-gray-500/30';
  if (roundedScore >= 70) {
    colorClass = 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    ringClass = 'ring-green-500/30';
  }
  else if (roundedScore >= 40) {
    colorClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    ringClass = 'ring-yellow-500/30';
  }
  else {
    colorClass = 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    ringClass = 'ring-red-500/30';
  }


  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className={`border-0 ${colorClass} ring-1 ring-inset ${ringClass}`}>
            {`Relevancy: ${roundedScore}%`}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{reason}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function AlertItem({ alert, onGenerateDraft }: AlertItemProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between gap-4">
          <CardTitle className="font-headline text-lg">{alert.title}</CardTitle>
          <Button variant="ghost" size="icon" asChild className="flex-shrink-0">
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
            <Skeleton className="h-6 w-32 rounded-full" />
          ) : (
            getScoreBadge(alert.relevancyScore, alert.relevancyReason)
          )}
        </div>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1" className="border-none">
            <AccordionTrigger asChild>
               <div className="w-full">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                  <Sparkles className="mr-2 h-4 w-4 text-primary/80" />
                  AI Draft Response
                </Button>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              {alert.isDrafting && !alert.draftResponse ? (
                <div className="flex items-center justify-center rounded-md border bg-secondary/50 p-4">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  <span>Generating draft...</span>
                </div>
              ) : alert.draftResponse ? (
                 <div className="relative">
                  <Textarea readOnly value={alert.draftResponse} rows={6} className="bg-secondary/30 pr-10" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-7 w-7"
                    onClick={() => navigator.clipboard.writeText(alert.draftResponse || '')}
                  >
                    <span className="sr-only">Copy</span>
                    <Bot className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 rounded-md border-2 border-dashed bg-secondary/30 p-8 text-center">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
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
