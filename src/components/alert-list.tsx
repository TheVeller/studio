'use client';

import type { Alert } from '@/lib/types';
import { AlertItem } from './alert-item';
import { Inbox } from 'lucide-react';

interface AlertListProps {
  alerts: Alert[];
  onGenerateDraft: (alertId: string) => void;
  emptyStateMessage: string;
}

export function AlertList({ alerts, onGenerateDraft, emptyStateMessage }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
        <div className="rounded-full border-4 border-dashed border-border p-6">
          <Inbox className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="mt-6 text-xl font-semibold font-headline">No Alerts Yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">{emptyStateMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {alerts.map(alert => (
        <AlertItem key={alert.id} alert={alert} onGenerateDraft={onGenerateDraft} />
      ))}
    </div>
  );
}
