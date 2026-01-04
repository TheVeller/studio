'use client';

import { useState, useTransition } from 'react';
import type { Alert } from '@/lib/types';
import { Header } from '@/components/header';
import { KeywordManager } from '@/components/keyword-manager';
import { EmailImporter } from '@/components/email-importer';
import { AlertTabs } from '@/components/alert-tabs';
import { parseEmailContent } from '@/lib/parser';
import { draftResponseAction, scoreAlertAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export function AlertInsightsApp() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [keywords, setKeywords] = useState<string[]>(['AI', 'startup', 'generative AI']);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleImport = (content: string) => {
    startTransition(() => {
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
        isScoring: true,
      }));

      setAlerts(prev => [...newAlerts, ...prev]);

      if (keywords.length === 0) {
        toast({
          title: 'No Keywords',
          description: 'Imported alerts but cannot score relevancy without keywords.',
        });
        newAlerts.forEach(alert => {
          setAlerts(prev =>
            prev.map(a => (a.id === alert.id ? { ...a, isScoring: false, relevancyScore: -1, relevancyReason: "No keywords to score." } : a))
          );
        });
        return;
      }

      newAlerts.forEach(async alert => {
        const scoreResult = await scoreAlertAction(alert, keywords);
        setAlerts(prev =>
          prev.map(a =>
            a.id === alert.id
              ? {
                  ...a,
                  isScoring: false,
                  relevancyScore: scoreResult.relevancyScore,
                  relevancyReason: scoreResult.reason,
                }
              : a
          )
        );
      });
    });
  };

  const handleGenerateDraft = (alertId: string) => {
    startTransition(() => {
      const alert = alerts.find(a => a.id === alertId);
      if (!alert) return;

      setAlerts(prev => prev.map(a => (a.id === alertId ? { ...a, isDrafting: true } : a)));

      draftResponseAction(alert, keywords).then(result => {
        setAlerts(prev =>
          prev.map(a =>
            a.id === alertId
              ? {
                  ...a,
                  isDrafting: false,
                  draftResponse: result.draftResponse,
                }
              : a
          )
        );
      });
    });
  };

  const relevantAlerts = alerts.filter(a => a.relevancyScore && a.relevancyScore >= 0.5);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="container mx-auto max-w-4xl p-4 py-8 md:p-8">
        <div className="flex flex-col gap-8">
          <KeywordManager keywords={keywords} setKeywords={setKeywords} />
          <EmailImporter onImport={handleImport} isProcessing={isPending} />
          <AlertTabs
            allAlerts={alerts}
            relevantAlerts={relevantAlerts}
            onGenerateDraft={handleGenerateDraft}
          />
        </div>
      </div>
    </div>
  );
}
