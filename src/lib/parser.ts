import type { Alert } from './types';

// This is a simplified parser for demonstration.
// It expects a specific format where alerts are separated by '---'
// and fields are prefixed (e.g., 'Title:').
// A real-world implementation would need a more robust HTML/email parsing library.
export function parseEmailContent(content: string): Partial<Alert>[] {
  const alerts: Partial<Alert>[] = [];
  const alertSections = content.split('---').filter(section => section.trim() !== '');

  for (const section of alertSections) {
    const lines = section.trim().split('\n');
    const titleLine = lines.find(line => line.toLowerCase().startsWith('title:'));
    const snippetLine = lines.find(line => line.toLowerCase().startsWith('snippet:'));
    const sourceLine = lines.find(line => line.toLowerCase().startsWith('source:'));
    const linkLine = lines.find(line => line.toLowerCase().startsWith('link:'));
    
    if (titleLine && snippetLine && sourceLine && linkLine) {
      alerts.push({
        title: titleLine.substring(titleLine.indexOf(':') + 1).trim(),
        snippet: snippetLine.substring(snippetLine.indexOf(':') + 1).trim(),
        source: sourceLine.substring(sourceLine.indexOf(':') + 1).trim(),
        link: linkLine.substring(linkLine.indexOf(':') + 1).trim(),
      });
    }
  }

  return alerts;
}

export const sampleEmailContent = `Title: AI startups raise $50B in 2023
Snippet: A new report shows that investment in artificial intelligence startups has reached a new peak, with a focus on generative AI and large language models.
Source: TechCrunch
Link: https://techcrunch.com/example-ai-funding
---
Title: Google announces new 'Roboto' font update
Snippet: The popular font 'Roboto' has received an update, improving readability across devices and adding new variable font axes for developers.
Source: Google Fonts Blog
Link: https://fonts.google.com/example-roboto-update
---
Title: Local bakery wins national pie contest
Snippet: "The Sweet Slice" bakery on Main Street has been awarded the "Best Apple Pie" in the country, drawing praise from judges for its flaky crust and unique spice blend.
Source: Anytown Gazette
Link: https://anytowngazette.com/example-pie
`;
