# NetZero Frontend

This is the frontend application for the NetZero ESG platform.

## Setup and Configuration

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

### Environment Variables

Create a `.env` file in the root of the project with the following variables:

```
# API Configuration
REACT_APP_API_URL=http://localhost:8000/api

# Media URL Configuration
REACT_APP_MEDIA_URL=http://localhost:8000
```

#### Environment Variable Descriptions:

- `REACT_APP_API_URL`: Base URL for API requests
- `REACT_APP_MEDIA_URL`: Base URL for media files (uploaded documents, images, etc.)

### For Production Deployment

When deploying to production, update the environment variables to point to your production URLs.

Example:

```
REACT_APP_API_URL=https://your-domain.com/api
REACT_APP_MEDIA_URL=https://your-domain.com
```

## Media File Handling

The application uses a centralized configuration system to handle media URLs. This ensures that documents and images are correctly displayed across different environments.

If you need to display media files in a component:

1. Import the utility function:

```javascript
import { getMediaUrl } from "../config";
```

2. Use the function to get the full URL:

```javascript
const documentPath = "uploads/certificates/document.pdf";
const fullUrl = getMediaUrl(documentPath);
```

3. Use the full URL in your component:

```jsx
<img src={fullUrl} alt="Document" />
```

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production version
- `npm run test` - Run tests
- `npm run lint` - Run linting

## Project Structure

- `src/components` - React components
- `src/services` - API service functions
- `src/contexts` - React context providers
- `src/store` - Redux store configuration
- `src/config` - Application configuration files
