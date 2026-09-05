# CaptionCraft — AI Image Caption Generator

CaptionCraft is a no-database React + TypeScript + Express app that accepts an image, sends it to an OpenAI vision-capable model from the server, and returns social captions tailored to the selected platform/style.

## Requirements
- Node.js 20+
- An OpenAI API key with API access

## Setup

```bash
npm install
npm --prefix client install
npm --prefix server install
copy .env.example server\.env
```

On macOS/Linux, use:

```bash
cp .env.example server/.env
```

Put your API key in `server/.env`.

## Run

```bash
npm run dev
```

Frontend: http://localhost:5173  
Backend: http://localhost:4000

## Production build

```bash
npm run build
npm start
```

The frontend is intentionally separate from the backend in development. The API key is never sent to the browser.

## API

`POST /api/generate-caption`

Multipart form fields:
- `image`
- `style`
- `platform`
- `tone`
- `length`
- `emoji`
- `hashtags`
- `count`
- `customInstructions`

No database, login, or persistent image storage is used.
