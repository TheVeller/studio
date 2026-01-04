'use server';

import { generateDraftResponse } from '@/ai/flows/draft-response-generation';
import { scoreRelevancy } from '@/ai/flows/relevancy-scoring';
import type { Alert } from './types';

export async function scoreAlertAction(
  alert: Pick<Alert, 'title' | 'snippet'>,
  keywords: string[]
) {
  try {
    if (keywords.length === 0) {
      return { relevancyScore: 0, reason: 'No keywords provided to score against.' };
    }
    const result = await scoreRelevancy({
      title: alert.title,
      snippet: alert.snippet,
      keywords,
    });
    return result;
  } catch (error) {
    console.error('Error scoring relevancy:', error);
    return { relevancyScore: -1, reason: 'Failed to score relevancy due to an unexpected error.' };
  }
}

export async function draftResponseAction(
  alert: Pick<Alert, 'title' | 'snippet' | 'source'>,
  userKeywords: string[]
) {
  try {
    const result = await generateDraftResponse({
      alertTitle: alert.title,
      alertSnippet: alert.snippet,
      alertSource: alert.source,
      userKeywords,
    });
    return result;
  } catch (error) {
    console.error('Error drafting response:', error);
    return { draftResponse: 'Failed to generate draft due to an unexpected error.' };
  }
}
