# ArtEcho 🎨

**Where Local Art Finds a Global Echo.**

ArtEcho is a modern web application designed to bridge the gap between local artisans and a global audience. It empowers craftspeople by providing them with powerful AI tools to tell their stories, market their products, and connect with brands that align with their style.

## About The Project

In a world of mass production, the unique stories behind handmade crafts are often lost. ArtEcho was created to solve this problem by giving artisans a platform to shine. By leveraging generative AI, the platform helps artisans create compelling marketing materials, generate audio stories for their products, and find the right buyers—all without needing any technical expertise.

This creates a richer, more meaningful connection between the creator and the consumer, turning every purchase into a story.

## Key Features

- **AI Story Card Generator**: Artisans can input details about themselves and their products, and the AI will generate a beautiful, engaging story card. It also creates an audio version of the story, making it accessible to everyone.

- **AI Brand Matchmaker**: Brands can describe their style and desired market trends (e.g., "minimalist, sustainable"), and the AI will analyze the available artisans and products to recommend the perfect partners.

- **Virtual Exhibition**: Buyers can explore a curated gallery of unique products. Clicking on an item opens a "Story Card Modal," which uses AI to generate a fresh narrative and audio story on the spot.

- **Artisan & Product Profiles**: Clean, detailed pages for each product and artisan, highlighting their craft, location, and personal journey.

## How ArtEcho Empowers Local Artisans

ArtEcho is more than just a marketplace; it's a digital partner for artisans.

- **Effortless Marketing**: It automates the creation of high-quality marketing content, saving artisans time and effort.
- **Authentic Storytelling**: It helps translate the artisan's personal story and cultural heritage into a format that resonates with modern consumers.
- **Increased Discovery**: The AI matchmaking tool helps artisans get discovered by brands and buyers who are actively looking for their unique style.

## Technology Stack

ArtEcho is built with a modern, full-stack technology set designed for performance, scalability, and a great developer experience.

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **AI & Generative Features**: [Google's Genkit](https://firebase.google.com/docs/genkit) (with Gemini models)
-   **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🌐 Live Demo
Check out the live version here: [InternLink Live Demo](https://inquisitive-lollipop-d5ae22.netlify.app/)


This project was made with the help of Firebase Studio.

## Deploying to Netlify

Follow these steps to deploy ArtEcho to Netlify using the official Next.js plugin.

1. Create a new site on Netlify and connect your GitHub repository.
2. In the Netlify site settings, under "Build & deploy":
	- Build command: `npm run build`
	- Publish directory: `.next`
3. Add environment variables required by your app in Site settings > Build & deploy > Environment > Environment variables. Common variables used by Firebase or any third-party services might include:
	- (Set any Firebase env vars or API keys your project requires)
4. Install the Netlify Next.js plugin (the `netlify.toml` in the repo already enables it). Netlify will read `netlify.toml` on deploy.
5. Optionally set the Node version in Netlify to match `.nvmrc` (Node 20) or add an `ENGINES` field in `package.json`.

Notes:
- This repository includes a sample `netlify.toml` and `.nvmrc` (Node 20). The project uses Next.js 15 which relies on the Netlify Next.js plugin to properly handle App Router and server components.
- Keep secrets out of the repo. Use Netlify's environment variables panel for all API keys.
