'use client';

import type { Alert } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertList } from './alert-list';
import { Badge } from './ui/badge';
import { List, Star } from 'lucide-react';

interface AlertTabsProps {
  allAlerts: Alert[];
  relevantAlerts: Alert[];
  onGenerateDraft: (alertId: string) => void;
}

export function AlertTabs({ allAlerts, relevantAlerts, onGenerateDraft }: AlertTabsProps) {
  return (
    <Tabs defaultValue="all">
      <TabsList className="grid w-full grid-cols-2 h-12">
        <TabsTrigger value="all" className="text-base">
          <List className="mr-2 h-5 w-5" />
          All Alerts
          <Badge variant="secondary" className="ml-2">
            {allAlerts.length}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="relevant" className="text-base">
          <Star className="mr-2 h-5 w-5" />
          Relevant
          <Badge variant="secondary" className="ml-2">
            {relevantAlerts.length}
          </Badge>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all" className="mt-6">
        <AlertList
          alerts={allAlerts}
          onGenerateDraft={onGenerateDraft}
          emptyStateMessage="Import emails to see your alerts here."
        />
      </TabsContent>
      <TabsContent value="relevant" className="mt-6">
        <AlertList
          alerts={relevantAlerts}
          onGenerateDraft={onGenerateDraft}
          emptyStateMessage="No relevant alerts found. Try adjusting keywords or importing more alerts."
        />
      </TabsContent>
    </Tabs>
  );
}
