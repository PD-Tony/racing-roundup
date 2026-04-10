# Racing Roundup Changelog

All notable changes to the Racing Roundup project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0] - 2025-04-03

### Added
- Article detail pages with full content preview
- Dynamic routing for individual articles
- Enhanced article content with category-specific information
- Publication date extraction from multiple sources
- Improved article metadata display

### Changed
- Updated ArticleCard component with a cleaner layout
- Made article title and image clickable to view article details
- Combined source information into a single button
- Enhanced button styling for better user experience
- Improved article detail page with structured content sections

### Fixed
- Publication date accuracy by extracting dates from article sources
- Article detail page API integration
- Image loading and fallback handling on article detail pages

## [0.2.0] - 2025-04-03

### Added
- Dark mode functionality with toggle in navigation
- User preference persistence using localStorage
- System preference detection for initial theme
- Dark mode styling for all components
- Hover effects for interactive elements in dark mode

### Fixed
- Image loading issues with external sources
- Added fallback images for articles with missing or invalid images
- Improved error handling for image components
- Fixed category filter buttons in dark mode
- Updated MongoDB connection to use 127.0.0.1 instead of localhost
- Ensured proper display of real articles from MongoDB

## [0.1.1] - 2025-04-03

### Added
- Initial project setup with Next.js and TypeScript
- Development plan document outlining the phased approach
- Project README with setup instructions
- Basic MongoDB database connection utility
- Article model for storing news articles
- RSS feed fetcher script for aggregating news
- TailwindCSS configuration for styling
- Basic API endpoint for retrieving articles
- Homepage with article listing and category filtering
- Reusable ArticleCard and ArticleList components
- Layout, Navigation, and Footer components
- Dynamic category pages for F1 and MotoGP content
- Global CSS styles with TailwindCSS integration
- Responsive design for mobile and desktop
- Innovative feature ideas documented for future phases

## [0.1.0] - 2025-04-03
### Added
- Project initialization
- Core project structure and configuration files
- Development plan with phased approach strategy
- Initial documentation

### Technical Details
- Set up Next.js with TypeScript for frontend
- Configured MongoDB with Mongoose for database
- Implemented RSS parser for news aggregation
- Created responsive UI with TailwindCSS
- Set up basic API endpoints for article retrieval
