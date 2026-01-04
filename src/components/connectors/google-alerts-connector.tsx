'use client';

import { useState } from 'react';
import type { Alert } from '@/lib/types';
import { CardTitle } from '@/components/ui/card';
import { EmailImporter } from '../email-importer';


interface GoogleAlertsConnectorProps {
  onAlertsImported: (alerts: Alert[]) => void;
  isProcessing: boolean;
}

export function GoogleAlertsConnector({ onAlertsImported, isProcessing }: GoogleAlertsConnectorProps) {
  
  return (
    <div className="flex flex-col gap-4">
      <CardTitle className="text-lg font-semibold flex items-center gap-2">
        <img src="/google-alerts.svg" alt="Google Alerts logo" className="h-6 w-6" />
        Configure Google Alerts
      </CardTitle>

      {/* For now, we reuse the email importer as a stand-in */}
      <EmailImporter onAlertsImported={onAlertsImported} isProcessing={isProcessing} />
    </div>
  );
}
