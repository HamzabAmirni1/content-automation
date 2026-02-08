# Content Automation Bot (AI Video Creator)

This project automates the creation of short-form videos (Shorts, Reels, TikToks) using AI.

## Features
- **AI Scripting**: Uses Google Gemini to generate titles, scripts, and image prompts.
- **AI Image Generation**: Uses Pollinations AI (Flux) to create high-quality vertical visuals.
- **Video Editing**: Uses FFmpeg to merge images into a vertical video format (1080x1920).
- **Social Media Ready**: Basic structure for uploading to YouTube, Facebook, TikTok, and Instagram.

## Requirements
1. **Node.js**: Installed.
2. **FFmpeg**: You MUST install FFmpeg on your system for the video editing to work.
   - For Windows: `choco install ffmpeg` or download from [ffmpeg.org](https://ffmpeg.org).
3. **API Keys**:
   - `GEMINI_API_KEY`: For AI content.
   - Social Media API Keys (OAuth2) for automated uploading.

## Installation
```bash
cd content-automation
npm install
```

## Setup
Create a `.env` file based on `.env.example` and add your API keys.

## 🔗 Connect Your Accounts (Kifach trbet les comptes)

### 1. YouTube
1. Sir l [Google Cloud Console](https://console.cloud.google.com/).
2. Create a Project o activi **YouTube Data API v3**.
3. Create **OAuth 2.0 Client IDs** (Web application).
4. Add `http://localhost:3000` to "Authorized redirect URIs".
5. Copier `CLIENT_ID` o `CLIENT_SECRET` f `.env`.
6. Run `node src/setup-youtube.js` f terminal bach t-authentiqua.

### 2. Facebook & Instagram
1. Sir l [Meta for Developers](https://developers.facebook.com/).
2. Sir l Dashboard dyal l-App dyalk.
3. f **Permissions**, zid: `pages_manage_posts`, `instagram_content_publish`, `pages_read_engagement`.
4. Generate a **Long-Lived Access Token** o zidha f `.env`.

### 3. TikTok
1. Sir l [TikTok for Developers](https://developers.tiktok.com/).
2. Register l-App dyalk o hya ghadi t-3tik `Client Key` o `Client Secret`.
3. Khdem b flow dyal **Content Posting API**.

## Project Structure
- `index.js`: Main logic.
- `src/ai.js`: Gemini integration.
- `src/images.js`: Image generation.
- `src/video.js`: Video processing.
- `src/socials/`: Social media uploaders (YouTube implemented as example).
- `output/`: Where finished videos and images are saved.
