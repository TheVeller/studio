'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import type { Alert } from '@/lib/types';
import { Mail, CheckCircle, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface GmailConnectorProps {
  onAlertsImported: (alerts: Alert[]) => void;
  isProcessing: boolean;
}

export function GmailConnector({ onAlertsImported, isProcessing }: GmailConnectorProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [senderEmail, setSenderEmail] = useState('googlealerts-noreply@google.com');
  const { toast } = useToast();

  const handleAuth = () => {
    // Placeholder for Supabase OAuth flow
    toast({
      title: 'Connecting to Gmail...',
      description: 'You will be redirected to grant permissions.',
    });
    // In a real app, this would initiate the OAuth flow with Supabase
    setTimeout(() => {
      setIsAuthenticated(true);
      toast({
        title: 'Successfully Connected!',
        description: 'You can now configure the sender email.',
      });
    }, 1500);
  };

  const handleFetch = () => {
    // Placeholder for fetching emails via a Supabase Edge Function
    toast({
      title: 'Fetching Emails...',
      description: `Checking for new alerts from ${senderEmail}.`,
    });
    // This would trigger the 'fetch-alerts' edge function
    onAlertsImported([]);
  };


  return (
    <div className="flex flex-col gap-4">
      <CardTitle className="text-lg font-semibold flex items-center gap-2">
        <img src="/gmail.svg" alt="Gmail logo" className="h-6 w-6" />
        Configure Gmail Connector
      </CardTitle>

      {!isAuthenticated ? (
        <div className="flex flex-col items-center justify-center text-center p-6 border-2 border-dashed rounded-lg">
          <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="mb-4 text-muted-foreground">Permissions required to read your emails.</p>
          <Button onClick={handleAuth}>
            Connect to Gmail
          </Button>
        </div>
      ) : (
        <div className="p-6 border rounded-lg bg-secondary/30">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <p className="font-medium">Gmail Account Connected</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender-email">Sender Email Address</Label>
            <p className="text-xs text-muted-foreground">
              Specify the email address that sends your alerts (e.g., Google Alerts).
            </p>
            <Input
              id="sender-email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="e.g., alerts@example.com"
            />
          </div>
           <Button onClick={handleFetch} disabled={isProcessing} className="mt-4 w-full">
            Fetch New Alerts
          </Button>
        </div>
      )}
    </div>
  );
}
