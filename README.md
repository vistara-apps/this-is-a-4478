# ClaimSnap AI

ClaimSnap AI is an AI-powered web application that automatically tags and organizes photos for insurance claims, significantly reducing processing time and effort for insurance adjusters.

## Features

- **AI Damage Recognition & Tagging**: Automatically identify and categorize specific types of damage (e.g., dents, scratches, water damage, fire damage) with high accuracy.
- **Object & Scene Classification**: Classify photos by the primary object of interest (e.g., vehicle, property, individual item) and the environmental context.
- **Accelerated Claim Review Workflow**: Present AI-tagged and categorized photos in a user-friendly interface for faster claim processing.
- **Data Export and Integration**: Export AI-generated tags and categorized image data in formats compatible with common claims management systems.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **AI**: OpenAI API for image analysis
- **Backend**: Supabase for authentication, database, and storage
- **Payments**: Stripe for subscription management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account (for subscription features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/claimsnap-ai.git
   cd claimsnap-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

### Supabase Setup

1. Create a new Supabase project
2. Set up the following tables:
   - `profiles`: User profiles
   - `claims`: Insurance claims
   - `photos`: Uploaded photos
3. Set up storage buckets for photo uploads
4. Enable authentication with email/password

### OpenAI Setup

1. Create an OpenAI account
2. Generate an API key
3. Add the API key to your `.env` file

### Stripe Setup

1. Create a Stripe account
2. Set up subscription products and prices
3. Add the publishable key to your `.env` file

## Project Structure

```
claimsnap-ai/
├── docs/                  # Documentation
│   ├── api.md             # API documentation
│   └── data-models.md     # Data models documentation
├── public/                # Public assets
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── Auth/          # Authentication components
│   │   ├── Billing/       # Billing components
│   │   ├── Claims/        # Claims components
│   │   ├── Export/        # Export components
│   │   ├── Settings/      # Settings components
│   │   └── common/        # Common components
│   ├── context/           # React context providers
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main App component
│   ├── index.css          # Global styles
│   └── main.jsx           # Entry point
├── .env.example           # Example environment variables
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── vite.config.js         # Vite configuration
```

## Development

### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the production version
- `npm run preview`: Preview the production build locally

### Code Style

This project uses ESLint and Prettier for code formatting. You can run the linter with:

```bash
npm run lint
# or
yarn lint
```

## Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

### Deploy to Vercel

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [OpenAI](https://openai.com/) for the AI image analysis capabilities
- [Supabase](https://supabase.io/) for the backend infrastructure
- [Stripe](https://stripe.com/) for payment processing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide Icons](https://lucide.dev/) for the beautiful icons

