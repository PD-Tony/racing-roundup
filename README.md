# Racing Roundup

A comprehensive news aggregation website for Formula 1 and MotoGP racing enthusiasts.

## Overview

Racing Roundup automatically collects and categorises news articles from various motorsport sources, providing a centralised hub for all F1 and MotoGP news.

## Features

- Automated news aggregation from multiple sources
- Categorisation of articles (F1/MotoGP)
- Responsive design for all devices
- Regular updates throughout the day
- Easy filtering and search functionality

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/racing-roundup.git
   cd racing-roundup
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cp .env.example .env.local
   ```
   Edit `.env.local` with your MongoDB connection string and other configuration details. See the [MongoDB Setup Guide](./racing-roundup/MONGODB_SETUP.md) for detailed instructions on setting up a free MongoDB Atlas database.

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

6. Populate the database with initial articles:
   ```
   npm run fetch-news
   ```
   This will run the RSS feed fetcher script to collect articles from various sources.

## Project Structure

```
racing-roundup/
├── components/       # Reusable UI components
├── lib/              # Utility functions and helpers
├── pages/            # Next.js pages and API routes
├── public/           # Static assets
├── scripts/          # Automation scripts
├── styles/           # Global styles
└── tests/            # Test files
```

## Testing the Website

To properly test the Racing Roundup website, follow these steps:

1. **Set up MongoDB**: Follow the [MongoDB Setup Guide](./racing-roundup/MONGODB_SETUP.md) to create a free MongoDB Atlas database and update your `.env.local` file with the connection string.

2. **Install Dependencies**: Run `npm install` to install all required packages.

3. **Start the Development Server**: Run `npm run dev` to start the Next.js development server.

4. **Populate the Database**: Run `npm run fetch-news` to fetch articles from various sources and populate your database.

5. **Access the Website**: Open [http://localhost:3000](http://localhost:3000) in your browser to view the website.

6. **Test Features**:
   - Browse the homepage to see all articles
   - Navigate to category pages (F1, MotoGP)
   - Test the responsive design by resizing your browser window
   - Check that article links open correctly
   - Verify that images are displayed properly
   - Test the contact form functionality

7. **Run Automated Tests**: Execute `npm run test` to run the Jest test suite.

## Development Workflow

Please refer to the [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) document for detailed information about the development phases, testing strategies, and deployment procedures.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
