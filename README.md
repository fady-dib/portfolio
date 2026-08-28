# fadydib.com

Portfolio site for Fady Dib, Full Stack Developer. [www.fadydib.com](https://www.fadydib.com)

Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS v4. Deployed on Vercel.

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev
```

The site runs without any environment variables — only the contact form needs them.

| Script | |
|---|---|
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm test` | Run the test suite |
| `npm run lint` | Lint |

## Environment variables

See `.env.example` for the full list and where each value comes from. The server-side keys must also be set in the Vercel dashboard under **Settings → Environment Variables**, or the contact form will work locally and fail in production.

Two of them are not optional for the form to send:

- `EMAILJS_PRIVATE_KEY` — from the EmailJS dashboard under Account → API Keys, with "Allow API calls" enabled
- `RECAPTCHA_SECRET_KEY` — from the Google reCAPTCHA admin console

## Notes

`docs/superpowers/` holds the design spec and implementation plan from the migration off Create React App.
