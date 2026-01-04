# Alert Insights

This is a Next.js application designed to help you import, analyze, and respond to alerts from various sources using AI. The app is structured to be scalable, allowing for the addition of new data connectors over time.

## Tech Stack

-   **Frontend**: [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
-   **UI**: [ShadCN UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/)
-   **AI**: [Genkit](https://firebase.google.com/docs/genkit)
-   **Backend**: Planned for [Supabase](https://supabase.com/) (Database, Auth, Edge Functions)

## Core Features

1.  **Keyword Management**: Define keywords to tailor the AI's analysis and scoring of alerts.
2.  **Connectors**: A flexible system to import alerts from different platforms.
    -   **Gmail**: Connect your Gmail account to pull in alerts from specific senders.
    -   **Google Alerts**: Directly process alerts from Google.
    -   *(Planned)*: Slack, News APIs, etc.
3.  **AI-Powered Analysis**:
    -   **Relevancy Scoring**: Each alert is automatically scored based on your keywords.
    -   **Draft Generation**: Instantly generate a draft response for any alert.

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Navigate to the project directory:
    ```bash
    cd alert-insights
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To run the app in development mode, use the following command. This will start the Next.js app and the Genkit development server concurrently.

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Backend Implementation (Supabase)

This repository contains the frontend implementation. The backend logic, intended for Supabase, is outlined in `PLAN.md`. You will need to set up a Supabase project and implement the database schema and Edge Functions as described in the plan.
