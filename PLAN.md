# Application Plan

This document outlines the plan for the "Alert Insights" application, which helps users analyze and respond to alerts from various sources.

## 1. Core Features

The application is divided into three main sections:

1.  **Keyword Management**: Users can define a list of keywords that the application will use to score the relevancy of incoming alerts.
2.  **Connectors**: Users can connect to different data sources to import alerts. Initially, we will support Gmail and Google Alerts, with plans to add more (e.g., Slack, news APIs).
3.  **Alerts Inbox**: A central dashboard where all imported alerts are displayed. Alerts are scored for relevancy based on user-defined keywords, and users can generate AI-powered draft responses.

## 2. Frontend Architecture

The frontend will be built with the existing stack: Next.js, React, TypeScript, and ShadCN UI components.

-   **`src/app/page.tsx`**: The main entry point, laying out the three core sections.
-   **`src/components/keyword-manager.tsx`**: UI for adding and removing keywords.
-   **`src/components/connectors/connectors-manager.tsx`**: A new component to manage different data source connectors.
-   **`src/components/connectors/gmail-connector.tsx`**: UI for connecting to Gmail. This will handle the OAuth flow and allow users to specify sender email addresses.
-   **`src/components/connectors/google-alerts-connector.tsx`**: UI for connecting to Google Alerts (details to be defined, likely via RSS or email parsing).
-   **`src/components/alert-tabs.tsx`**: The main inbox UI, with tabs for "All Alerts" and "Relevant Alerts".
-   **`src/components/alert-item.tsx`**: Displays a single alert, its relevancy score, and the AI draft response functionality.

## 3. Backend Architecture (Supabase)

The backend will be powered by Supabase. The user will implement this separately.

### 3.1. Database Schema

We'll use Supabase's PostgreSQL database.

-   **`users`**: Stores user information. This is automatically created by Supabase Auth.
-   **`keywords`**:
    -   `id`: UUID (Primary Key)
    -   `user_id`: UUID (Foreign Key to `auth.users.id`)
    -   `keyword`: TEXT
    -   `created_at`: TIMESTAMPTZ
-   **`connectors`**:
    -   `id`: UUID (Primary Key)
    -   `user_id`: UUID (Foreign Key to `auth.users.id`)
    -   `type`: TEXT (e.g., 'gmail', 'google_alerts')
    -   `config`: JSONB (e.g., for Gmail, `{ "sender_email": "..." }`)
    -   `access_token`: TEXT (Encrypted)
    -   `refresh_token`: TEXT (Encrypted)
    -   `created_at`: TIMESTAMPTZ
-   **`alerts`**:
    -   `id`: UUID (Primary Key)
    -   `user_id`: UUID (Foreign Key to `auth.users.id`)
    -   `connector_id`: UUID (Foreign Key to `connectors.id`)
    -   `title`: TEXT
    -   `snippet`: TEXT
    -   `source`: TEXT
    -   `link`: TEXT
    -   `relevancy_score`: FLOAT
    -   `relevancy_reason`: TEXT
    -   `draft_response`: TEXT
    -   `created_at`: TIMESTAMPTZ

### 3.2. Authentication

-   We will use **Supabase Auth** to handle user sign-up and sign-in.
-   For the Gmail connector, we will implement an OAuth 2.0 flow to get the user's permission to read their emails. The access and refresh tokens will be stored securely in the `connectors` table, encrypted at rest.

### 3.3. API (Supabase Edge Functions)

We will use Supabase Edge Functions (Deno-based) for server-side logic.

-   **`fetch-alerts`**:
    -   This function will be triggered on a schedule (using Supabase's cron jobs).
    -   It will iterate through configured `connectors` for each user.
    -   For Gmail, it will use the stored `access_token` to call the Gmail API and fetch new emails from the specified sender.
    -   It will parse the emails to extract alert information and store them in the `alerts` table.
-   **`score-relevancy`**:
    -   This can be an Edge Function called from the frontend after new alerts are fetched.
    -   It will take an `alert_id` and `user_id` as input.
    -   It fetches the user's keywords and the alert content.
    -   It calls a GenAI model (like Gemini) to calculate a relevancy score.
    -   It updates the `relevancy_score` and `relevancy_reason` fields for the alert in the database.
-   **`draft-response`**:
    -   An Edge Function called from the frontend.
    -   Takes `alert_id` and `user_id`.
    -   Fetches the alert content and user keywords.
    -   Calls the GenAI model to generate a draft response.
    -   Updates the `draft_response` field for the alert.

## 4. Development & Deployment

-   **Frontend**: The Next.js application can be deployed on Vercel or a similar platform.
-   **Backend**: All backend services (database, auth, functions) are hosted on Supabase.
