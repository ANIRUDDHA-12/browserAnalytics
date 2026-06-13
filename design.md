# FeedLoop System Architecture & Design Specification (Mastercard Inspired Edition)

FeedLoop is a B2B SaaS platform providing a lightweight, privacy-focused feedback widget for web developers. This document defines the database schema, API contracts, vanilla JS client widget logic, and Next.js SaaS dashboard structure, styled and engineered strictly according to the Mastercard Design System guidelines.

---

## 1. Database Schema (Supabase PostgreSQL)

We use Supabase PostgreSQL with Row Level Security (RLS) enabled on all tables.

### Tables

#### `projects`
Stores B2B client project registrations.
```sql
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    domain TEXT NOT NULL, -- Allowed origin domain for CORS/ingestion validation (e.g., 'example.com')
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own projects" 
    ON public.projects 
    FOR ALL 
    USING (auth.uid() = user_id);
```

#### `feedback`
Stores feedback entries submitted by end-users.
```sql
CREATE TYPE emotion_type AS ENUM ('love', 'thinking', 'bug');

CREATE TABLE public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    emotion emotion_type NOT NULL,
    message TEXT NOT NULL,
    screenshot_path TEXT, -- Nullable path to image in Supabase Storage
    url TEXT NOT NULL, -- Page URL where feedback was submitted
    browser_metadata JSONB NOT NULL, -- User agent, viewport, language, etc.
    category TEXT, -- Set asynchronously by AI categorization webhook
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policies
-- Next.js API routes run with service role privileges to insert feedback.
-- B2B users can select feedback for their own projects.
CREATE POLICY "Users can read feedback for their own projects"
    ON public.feedback
    FOR SELECT
    USING (
        project_id IN (
            SELECT id FROM public.projects WHERE user_id = auth.uid()
        )
    );
```

### Real-Time Subscriptions
We will enable Supabase Realtime for the `feedback` table so the dashboard automatically appends new feedback submissions and shows AI categories as they populate.
```sql
alter publication supabase_realtime add table public.feedback;
```

---

## 2. API Contracts

All endpoints are hosted under `/api/v1`.

### 1. Ingestion CORS Guard
Every API endpoint validates the `Origin` or `Referer` header against the registered project domain.
* **Algorithm**:
  1. Retrieve `projectId` from request.
  2. Query `public.projects` to get the registered `domain`.
  3. Parse the incoming request's `Origin` or `Referer` header.
  4. If they do not match (or wildcard subdomains aren't covered), return `403 Forbidden`.

### 2. Rate Limiting
* Endpoint: `/api/v1/ingest` and `/api/v1/pre-signed-url`.
* Mechanism: IP-based rate limiting (Max 5 requests per minute per IP).
* Payload Cap: Incoming request bodies strictly capped at 2MB.

---

### Endpoint: `GET /api/v1/pre-signed-url`
Retrieves a pre-signed PUT URL to upload a screenshot directly to Supabase Storage.

* **Headers Required**:
  * `Origin` or `Referer` (For domain validation)
* **Query Parameters**:
  * `projectId`: `UUID`
  * `fileName`: `string` (e.g., `screenshot_[timestamp].png`)
* **Response `200 OK`**:
  ```json
  {
    "uploadUrl": "https://[project].supabase.co/storage/v1/object/sign/screenshots/...",
    "screenshotPath": "screenshots/[projectId]/[fileName]"
  }
  ```
* **Response `403 Forbidden`**:
  ```json
  { "error": "Unauthorized origin" }
  ```

---

### Endpoint: `POST /api/v1/ingest`
Ingests user text feedback, browser metadata, and the uploaded screenshot reference.

* **Headers Required**:
  * `Origin` or `Referer` (For domain validation)
* **Request Body**:
  ```json
  {
    "projectId": "UUID",
    "emotion": "love" | "thinking" | "bug",
    "message": "string",
    "url": "string",
    "browserMetadata": {
      "userAgent": "string",
      "language": "string",
      "viewportWidth": 1920,
      "viewportHeight": 1080
    },
    "screenshotPath": "string" // Nullable
  }
  ```
* **Response `200 OK`**:
  ```json
  {
    "success": true,
    "feedbackId": "UUID"
  }
  ```

---

### Endpoint: `POST /api/v1/webhooks/classify`
Invoked securely by a Supabase Database Webhook when a new row is inserted into `public.feedback`.

* **Authorization**: Shared secret header verification (`x-feedloop-webhook-secret`).
* **Request Body**:
  ```json
  {
    "type": "INSERT",
    "table": "feedback",
    "record": {
      "id": "UUID",
      "message": "string",
      "emotion": "string",
      "project_id": "UUID"
    }
  }
  ```
* **Processing logic**:
  1. Webhook parses the text `message`.
  2. Forwards text to AI API (Gemini/OpenAI) using a fast structured-output call.
  3. Prompts the model to return a single-category label (e.g., `"Bug"`, `"UI/UX"`, `"Feature Request"`, `"Performance"`, `"General"`).
  4. Updates the matching row in `public.feedback` with the category.
* **Response `200 OK`**:
  ```json
  { "success": true, "category": "Bug" }
  ```

---

## 3. Client-Side Vanilla JS Widget (`feedloop-widget`)

The client script is packaged into a single lightweight bundle, utilizing a Web Component (Shadow DOM) to avoid styling conflicts with the host website.

### UI Styling (Mastercard Theme)
* **Font**: Sofia Sans / Arial fallbacks, headline tracking `-2%`.
* **Colors**: Putty Cream (`#F3F0EE`), Lifted Cream (`#FCFBFA`), Ink Black (`#141413`), Signal Orange (`#CF4500`), Slate Gray (`#696969`).
* **Floating Trigger Button**: A perfect circle (`50%` radius), `56px` diameter, floating at the bottom-right of the viewport. Ink Black background, Canvas Cream text/icon, with a Level 1 shadow (`rgba(0, 0, 0, 0.04) 0px 4px 24px 0px`).
* **Widget Dialog**:
  * Shape: Stadium card with a `24px` radius.
  * Background: Lifted Cream (`#FCFBFA`).
  * Border: `1.5px solid #141413` (thin, high contrast).
  * Header/Eyebrow: Uppercase bold tracked label prefixed with a small dot (`• FEEDBACK`).
  * Textarea: Styled in Canvas Cream (`#F3F0EE`), border `1.5px solid #141413`, text Ink Black (`#141413`), radius `8px`.
  * CTA Buttons:
    * Submit: Primary Ink Pill (Ink Black `#141413` background, Canvas Cream `#F3F0EE` text, `20px` radius, padding `6px 24px`, weight `500`).
    * Back/Cancel: Outlined Pill (White `#FFFFFF` background, Ink Black `#141413` text, `1.5px solid #141413` border, `20px` radius, padding `6px 24px`).

### Client-Side Masking Strategy
Before drawing the screenshot using `html2canvas`:
1. Find all elements matching the selector:
   `input[type="password"]`, `[autocomplete="cc-number"]`, `input[type="email"]`, `.feedloop-mask`
2. Temporarily replace their visual display or text:
   - For inputs: Cache original value, set `input.value = "••••••••"`.
   - For text elements (targeted by `.feedloop-mask`): Cache original `innerHTML`, replace with `████████`.
3. Temporarily apply class to `<feedloop-widget>` parent containing `display: none !important` so the widget itself is completely hidden during screen capture.
4. Execute `html2canvas(document.body, { useCORS: true })`.
5. Restore cached values and widget visibility immediately.
6. Fallback: If `html2canvas` fails (throws `SecurityError`), abort screenshot and proceed with text-only POST.

---

## 4. Next.js SaaS Dashboard UI/UX (Mastercard Theme)

The dashboard uses Next.js, styled strictly under the Mastercard Editorial Aesthetic.

### Core Visual Rules
* **Theme**: Putty-cream canvas as the default body background (`#F3F0EE`).
* **Secondary Surface**: Lifted Cream (`#FCFBFA`) for paper-on-paper card sections.
* **Branding Accent**: Spark of Signal Orange (`#CF4500`) used on eyebrow dots and indicator signals.
* **Typography**: Sofia Sans (fallback stack: `SofiaSans, Arial, sans-serif`).
  * Headers: Weight 500, letter-spacing `-2%`.
  * Body copy: Weight 450 (softer than regular 400).
  * Eyebrows: Weight 700, uppercase, letter-spacing `+4%`, prefixed with a bullet dot (e.g. `• ANALYTICS`).
* **Borders**: Thin, high-contrast boundaries (`1.5px solid #141413`).
* **Radius Scale**:
  * Button/Input Radius: `20px` (standard Ink Pill).
  * Card Radius: `40px` (stadium cards).
  * Chips / Small Actions: `24px` or `999px` (pill chips).
* **Elevation & Depth**:
  * Primary Canvas: Putty Cream (`#F3F0EE`).
  * Floating Nav/Elevated Cards: Soft halo shadow (`rgba(0, 0, 0, 0.08) 0px 24px 48px`).

---

### Dashboard Layout & Routes

#### 1. Floating Nav Pill (Global Header)
* Container: White (`#FFFFFF`) pill floating `24px` below the top of the viewport.
* Radius: `999px`.
* Padding: `16px 40px`.
* Shadow: Level 1 (`rgba(0, 0, 0, 0.04) 0px 4px 24px`).
* Elements: Left-aligned Mastercard-inspired branding logomark, centered primary navigation links, right-aligned User Profile chip.

#### 2. Project List (`/dashboard`)
* Background: Putty Cream (`#F3F0EE`).
* Headers: Large conversational H1 set at weight 500, `-2%` letter-spacing.
* Project Cards:
  * Stadium format (`40px` radius) using Lifted Cream (`#FCFBFA`) background.
  * Thin `1.5px` Ink Black outline.
  * Right-aligned circular micro-CTA (`50%` radius, white background, black arrow icon) docked to open details.
  * Eyebrow labels with small orange dots (`• REGISTRY`).

#### 3. Project Detail View (`/dashboard/projects/[projectId]`)
* Split Layout:
  * **Left Navigation Column (Feedback List)**:
    * Real-time stream of incoming reviews.
    * Each card has a Lifted Cream (`#FCFBFA`) background, `20px` radius, showing the emotion tag as a small white pill chip (😍, 🤔, or 🐛) and the AI category tag.
  * **Right Panel (Detail Panel)**:
    * Displays selected feedback, browser meta (resolution, OS, user agent).
    * Screenshot preview is contained inside a **Hero Media Frame** (stadium crop with a `40px` border-radius, dark background).
    * High-contrast editorial style.

---

## 5. Verification Plan

### Automated Verification
* Run unit tests for Next.js API routes under local dev environment.
* Validate domain origin header validation against registered project domains.
* Verify rate-limiter locks down endpoints after 5 requests in a 60-second window.

### Manual Verification
* Deploy a test page loading the widget from local development.
* Check browser logs to verify canvas fallback works correctly when loading uncooperative third-party assets.
* Verify client-side masking by inspecting the database records to ensure password/email values are strictly replaced with `"••••••••"` and `"████████"`.
* Inspect layout visually to ensure colors match Putty Cream (`#F3F0EE`) and Ink Black (`#141413`) with correct typography weights and border radiuses.
