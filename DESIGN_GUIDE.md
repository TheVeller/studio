# Design Guide

This guide provides the design principles and styles for the "Alert Insights" application.

## 1. Color Palette

The UI uses a modern and clean color scheme. The theme is defined in `src/app/globals.css` using HSL CSS variables for easy customization.

-   **Primary (`--primary`)**: A strong, vibrant blue used for interactive elements like buttons, links, and focus rings.
-   **Background (`--background`)**: A light, neutral off-white for the main application background, providing a clean canvas for content.
-   **Card (`--card`)**: A pure white used for card backgrounds, making them stand out against the main background.
-   **Secondary/Muted (`--secondary`, `--muted`)**: Light grays used for secondary text, borders, and disabled elements.
-   **Accent (`--accent`)**: A color used for hover states and selected items, often a lighter shade of the primary color.
-   **Destructive (`--destructive`)**: Red, reserved for error messages, delete actions, and other destructive operations.

## 2. Typography

The application uses two primary fonts, defined in `src/app/layout.tsx` and configured in `tailwind.config.ts`.

-   **Headline Font (`--font-lexend`)**: Used for main titles and headings (`<CardTitle>`, etc.). It's a clean, modern sans-serif that provides a strong visual anchor.
-   **Body Font (`--font-inter`)**: Used for all other text, including descriptions, paragraphs, and UI elements. It's highly readable at all sizes.

## 3. Layout and Spacing

-   **Consistency**: We use Tailwind CSS utility classes for all spacing (margin, padding, gaps). This ensures consistency across the application.
-   **Container**: The main content is wrapped in a container with a `max-width` of `5xl` to ensure readability on large screens.
-   **Component Spacing**: Components are spaced using `gap-8` in flex containers to provide ample breathing room.
-   **Cards**: `Card` components from ShadCN are the primary building blocks for UI sections. They have consistent padding (`p-6` for header/content, `pt-0` to connect them) and a subtle `shadow-sm` that increases to `shadow-md` on hover.

## 4. Component Styling

-   **Buttons (`Button`)**: Use the `default` variant for primary actions and `outline` or `ghost` for secondary actions. Icons are frequently used to provide visual cues.
-   **Badges (`Badge`)**: Used for displaying status (like relevancy score) or keywords. They have distinct color variations based on context (e.g., green for high relevancy, red for low).
-   **Inputs & Textarea**: Have a clean, consistent style with a focus ring that uses the primary color.
-   **Icons**: We use the `lucide-react` library for all icons. Icons should be clear, simple, and consistently sized (`h-4 w-4` or `h-5 w-5` is common).
-   **Connectors**: Connector logos should be visually distinct and placed within a `Card` or similar container. When a connector is not yet available, it should be grayed out and include a "Coming Soon" label.

## 5. User Experience (UX) Principles

-   **Clarity**: The UI should be intuitive. Labels, descriptions, and placeholder text should guide the user.
-   **Feedback**: The application must provide immediate feedback for user actions. This includes loading spinners (`Loader2`) during asynchronous operations (like importing or generating drafts) and toasts for success or error messages.
-   **Progressive Disclosure**: Complex functionality, like the AI draft response, is initially hidden within an `Accordion`. This keeps the primary UI clean and allows users to access advanced features when needed.
-   **Scalability**: The design (e.g., the Connectors section) should be flexible enough to accommodate future additions without requiring a major redesign.
