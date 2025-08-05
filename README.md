# insta_reel_scraper

Instagram Reel Scraper & Analytics Dashboard
===========================================

This project provides a full-stack solution for scraping Instagram Reel data and analyzing it with a modern dashboard. It consists of:

- **Backend**: FastAPI server that scrapes Instagram Reel data and exposes it via a REST API.
- **Frontend**: Next.js (React) dashboard for uploading JSON, pasting Reel links, and visualizing analytics.

---

## Features

- Paste an Instagram Reel link to auto-fetch and analyze its data
- Upload or paste Instagram post JSON for custom analytics
- Sentiment analysis, hashtag analysis, timing, virality, and more
- Download analytics as a PDF report

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.8+
- [pip](https://pip.pypa.io/en/stable/)

### Backend Setup (FastAPI)

1. Clone the repo and navigate to the backend directory (if separate):
   ```bash
   git clone https://github.com/Pruthvi-Parmar/insta_reel_scraper.git
   cd insta_reel_scraper
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. (Optional) Set up environment variables if needed.
4. Start the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 5000
   ```

#### CORS Note
Make sure CORS is enabled in your FastAPI app:
```python
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Frontend Setup (Next.js)

1. Navigate to the frontend directory (if separate):
   ```bash
   cd instagram-analytics
   ```
2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   pnpm dev
   # or
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Usage

1. **Paste a Reel Link**: Enter an Instagram Reel URL in the dashboard and click "Fetch Reel Data". The backend will scrape the data and auto-fill the JSON input.
2. **Analyze Data**: Click "Analyze Data" to view analytics, sentiment, hashtags, and more.
3. **Download PDF**: After analysis, download a PDF report of the analytics.

---

## API Reference

### Scrape Endpoint

- **GET** `/scrape?url=<INSTAGRAM_REEL_URL>`
  - Returns: JSON data for the given Instagram Reel.

### Example

```bash
curl "http://localhost:5000/scrape?url=https://www.instagram.com/reel/DLcjbWxzuiD/"
```

---

## Project Structure

- `app/` - Next.js frontend app
- `main.py` (or similar) - FastAPI backend entrypoint
- `requirements.txt` - Python dependencies
- `package.json` - Node.js dependencies

---

## License

MIT
