# Fit It On – AI Virtual Try-On Web App

**Fit It On** is a full-stack AI-powered virtual try-on app that lets users upload a photo of themselves and a piece of clothing to instantly visualize how it would look on them. Built for accessibility and ease, the app includes a free trial experience (no signup required), premium upgrade tiers, and a secure, privacy-first user experience.

Try it live → [https://www.fititon.app](https://www.fititon.app)

---

## Features

- Upload your photo and any clothing image
- AI automatically detects clothing type and fuses the two
- View your past try-ons in your personal gallery
- Download the final image
- 3 free trials — no signup required
- Premium tiers for more try-ons and access
- Instant premium upgrade after payment via webhook
- Daily job checks to handle subscription status

---

## For Users – How It Works

1. Go to [https://www.fititon.app](https://www.fititon.app)
2. Click **"Get Started"** – no signup required.
3. Upload your **photo** and **any piece of clothing**.
4. Let the AI handle it — your try-on result will appear in seconds.
5. Save or download your generated try-on.
6. Want more tries? You can sign up and upgrade to a premium plan!

> ⚠️ Please make sure to read our [Privacy Policy](https://www.fititon.app/privacy-policy) before uploading any photos.

---

## Tech Stack

- **Frontend**: Next.js, React.js, TypeScript, Tailwind CSS, Shadcn UI
- **State Management**: Zustand
- **Authentication & DB**: Supabase (Auth + Storage)
- **Payments**: Lemon Squeezy (via Webhooks)
- **Image Processing**: External hosted AI API
- **Monitoring & Analytics**: PostHog
- **Hosting**: Vercel
- **Scheduled Tasks**: GitHub Actions (daily cron jobs)

---

## For Developers – Local Setup

> ⚠️ The app depends on external API services for image generation and payment processing. You will need to set up and supply the correct API keys to run it locally.

### 1. Clone the repo

```bash
git clone https://github.com/xCordeva/fit-it-on.git
cd fit-it-on
```
### 2. Install dependencies
```bash
pnpm install
```
### 3. Environment setup
Create a .env.local file and provide the following:
```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_AI_API_URL=
AI_API_SECRET_KEY=

LEMON_SQUEEZY_API_KEY=
LEMON_WEBHOOK_SECRET=

POSTHOG_PROJECT_API_KEY=
```
> You'll also need to configure Supabase Storage policies, RLS rules, and connect webhooks from Lemon Squeezy to your /api/webhook endpoint.

### 4. Start the app
```bash
pnpm dev
```
App will be running on http://localhost:3000

## Contributing
Have ideas, found a bug, or want to add a feature? Feel free to fork the repo and open a pull request.


## Contact
For questions, feedback, or collaboration inquiries, reach out at Ahmad.Abdelaall.Abas@gmail.com

