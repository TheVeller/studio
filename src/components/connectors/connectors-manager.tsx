'use client';

import { useState } from 'react';
import type { Alert } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GmailConnector } from './gmail-connector';
import { GoogleAlertsConnector } from './google-alerts-connector';
import { Plug } from 'lucide-react';

interface ConnectorsManagerProps {
  onAlertsImported: (alerts: Alert[]) => void;
  isProcessing: boolean;
}

const connectors = [
  { id: 'gmail', name: 'Gmail', logo: '/gmail.svg', component: GmailConnector, enabled: true },
  { id: 'google_alerts', name: 'Google Alerts', logo: '/google-alerts.svg', component: GoogleAlertsConnector, enabled: true },
  { id: 'slack', name: 'Slack', logo: '/slack.svg', component: null, enabled: false },
  { id: 'web-rss', name: 'Web RSS', logo: '/rss.svg', component: null, enabled: false },
];

export function ConnectorsManager({ onAlertsImported, isProcessing }: ConnectorsManagerProps) {
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);

  const renderConnectorContent = () => {
    if (!selectedConnector) {
      return (
        <div className="text-center text-muted-foreground py-10">
          <p>Select a connector to configure.</p>
        </div>
      );
    }

    const connector = connectors.find(c => c.id === selectedConnector);
    if (!connector || !connector.component) {
      return (
        <div className="text-center text-muted-foreground py-10">
          <p>This connector will be available soon.</p>
        </div>
      );
    }

    const ConnectorComponent = connector.component;
    return <ConnectorComponent onAlertsImported={onAlertsImported} isProcessing={isProcessing} />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Plug className="h-6 w-6" />
          Connectors
        </CardTitle>
        <CardDescription>
          Connect your accounts to start importing and analyzing alerts automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
          <div className="flex flex-col gap-2 border-r pr-4">
            {connectors.map(connector => (
              <Button
                key={connector.id}
                variant={selectedConnector === connector.id ? 'secondary' : 'ghost'}
                className="justify-start gap-3"
                onClick={() => setSelectedConnector(connector.id)}
                disabled={!connector.enabled}
              >
                <img src={connector.logo} alt={`${connector.name} logo`} className="h-5 w-5" />
                <span>{connector.name}</span>
                {!connector.enabled && <span className="text-xs text-muted-foreground ml-auto">(Soon)</span>}
              </Button>
            ))}
          </div>
          <div className="min-h-[200px]">
            {renderConnectorContent()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
