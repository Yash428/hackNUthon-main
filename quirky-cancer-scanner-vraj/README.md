# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/212a8194-b852-4edc-9299-53797400fa88

## Cancer Assistant Chatbot

This project includes a Cancer Assistant chatbot powered by Google's Generative AI (Gemini). The chatbot can:

- Answer questions about cancer
- Analyze uploaded medical scans
- Provide information about symptoms and treatments

### Setup for Chatbot

1. Get a Google Generative AI API key from [Google AI Studio](https://ai.google.dev/)
2. Create a `.env` file in the root directory with:
   ```
   GOOGLE_API_KEY=your_gemini_api_key_here
   VITE_API_URL=http://localhost:3000
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start both the frontend and API server:
   ```
   npm run start
   ```
5. Access the chatbot at: http://localhost:5173/chatbot

### API Endpoints

- **Text Chat**: POST to `/api/chat/send` with JSON body `{ "message": "your question", "history": [] }`
- **File Upload**: POST to `/api/chat/send-file` with FormData containing `file` and optional `message`

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/212a8194-b852-4edc-9299-53797400fa88) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/212a8194-b852-4edc-9299-53797400fa88) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
