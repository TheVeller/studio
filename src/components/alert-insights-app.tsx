'use client';

import { useState, useTransition } from 'react';
import type { Alert } from '@/lib/types';
import { Header } from '@/components/header';
import { KeywordManager } from '@/components/keyword-manager';
import { ConnectorsManager } from '@/components/connectors/connectors-manager';
import { AlertTabs } from '@/components/alert-tabs';
import { draftResponseAction, scoreAlertAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';
import { Inbox } from 'lucide-react';

export function AlertInsightsApp() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [keywords, setKeywords] = useState<string[]>(['AI', 'startup', 'generative AI']);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAlertsImported = (newAlerts: Alert[]) => {
    startTransition(() => {
      if (newAlerts.length === 0) {
        toast({
          title: 'No New Alerts',
          description: 'Could not find any new alerts to import.',
          variant: 'default',
        });
        return;
      }

      const alertsToScore = newAlerts.map(alert => ({ ...alert, isScoring: true }));
      setAlerts(prev => [...alertsToScore, ...prev]);
      
      toast({
        title: 'Import Successful',
        description: `Imported ${newAlerts.length} new alert(s). Scoring relevancy...`,
      });


      if (keywords.length === 0) {
        toast({
          title: 'No Keywords',
          description: 'Imported alerts but cannot score relevancy without keywords.',
        });
        alertsToScore.forEach(alert => {
          setAlerts(prev =>
            prev.map(a => (a.id === alert.id ? { ...a, isScoring: false, relevancyScore: -1, relevancyReason: "No keywords to score." } : a))
          );
        });
        return;
      }

      alertsToScore.forEach(async alert => {
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
    <div className="flex min-h-screen flex-col bg-secondary/40">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl p-4 py-8 md:p-8">
          <div className="flex flex-col gap-8">
            <KeywordManager keywords={keywords} setKeywords={setKeywords} />
            <ConnectorsManager onAlertsImported={handleAlertsImported} isProcessing={isPending} />

            <div>
              <div className='flex items-center gap-2 mb-4 px-2'>
                <Inbox className="h-6 w-6" />
                <h2 className='text-2xl font-headline'>Alerts Inbox</h2>
              </div>
              <Separator className="mb-8" />
              <AlertTabs
                allAlerts={alerts}
                relevantAlerts={relevantAlerts}
                onGenerateDraft={handleGenerateDraft}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
