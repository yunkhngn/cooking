# Dinner AI — What should we have for dinner tonight?

Dinner AI is an intelligent culinary web application designed to quickly answer the daily question: "What should we have for dinner tonight?". Powered by Google Gemini AI, the app automatically generates complete dinner menus based on party size, budget, cooking time, and personal dietary preferences, complete with step-by-step recipes, nutrition estimation, and a consolidated shopping list.

## Key Features

- **AI-Optimized Menu Generation**: Automatically balances main courses, stir-fries, soups, and side dishes tailored to Vietnamese home cooking or international cuisines (Japanese, Korean, Chinese, Thai, Italian, American).
- **Flexible Customization**:
  - Main dish count selection: Specify 2, 3, or 4 main dishes, or let the AI automatically determine the ideal count.
  - Desired dishes: Request specific dishes you crave to be included in tonight's menu.
  - Available ingredients: Utilize pantry items already at home to reduce food waste.
  - Avoid list: Exclude unwanted ingredients or allergens.
  - Dietary preferences & occasions: Support for Healthy, High-Protein, Vegetarian, Low-Carb diets, and occasions such as Family Dinner, Date Night, or Weekend Feast.
- **Side Dishes & Pantry Staples**: Recommends complementary side dishes (steamed rice, pickles, dipping sauces) using items already available at home to avoid extra shopping costs.
- **Comprehensive Recipes & Nutrition**:
  - Step-by-step cooking instructions.
  - Detailed ingredient lists with precise measurements.
  - Nutrition estimates for calories, protein, carbohydrates, and fat.
  - Integrated quick links to search recipe tutorials on YouTube and Google.
- **Consolidated Shopping List**: Automatically combines and categorizes ingredients into "Need to Buy" and "Already Available at Home".
- **Export Menu to Image**: Export and save the full menu as a high-resolution PNG image directly to your mobile photo gallery or computer.
- **Smart History Management**: Manages history by calendar date, automatically updating and replacing same-day entries when a new menu is generated on the same day.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI & Styling**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **AI Engine**: Google GenAI SDK (`@google/genai` using Gemini 2.5 Flash model)
- **Validation**: Zod & Zod JSON Schema (Ensures strict structure contract with Gemini AI)
- **Image Generation & Export**: `html-to-image`
- **Testing**: Vitest, React Testing Library, Testing Library User Event

## Project Structure

```text
cooking/
├── app/                  # App Router pages and API routes
│   ├── api/generate/     # Streaming API route interfacing with Gemini AI
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout and metadata configuration
│   └── page.tsx          # Main application page
├── components/           # UI components
│   ├── ui/               # Custom controls (Select, Alert, Modal)
│   ├── dish-card.tsx     # Dish card with recipe steps and nutrition
│   ├── history-bar.tsx   # History bar displaying recent dishes
│   ├── menu-export-card.tsx # Printable infographic export layout
│   ├── menu-result.tsx   # Menu result display container
│   ├── preference-form.tsx # Preference input form
│   └── shopping-list.tsx # Consolidated shopping list
├── lib/                  # Utilities and core logic
│   ├── export-image.ts   # Client-side PNG export helper
│   ├── format.ts         # Currency and text formatting utilities
│   ├── history.ts        # LocalStorage state management
│   ├── links.ts          # External search link generators
│   ├── prompt.ts         # System instructions and prompt builders
│   ├── rate-limit.ts     # In-memory API rate limiter
│   └── schema.ts         # Zod schemas and Gemini JSON schema definition
├── public/               # Static assets (Favicons, App Icons, Manifest, OG Images)
└── docs/                 # Design specs and implementation plans
```

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- Yarn package manager

### Installation

Clone the repository and install dependencies:

```bash
yarn install
```

### Environment Variables

Create a `.env` file in the root directory and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_SITE_URL=https://dinner-ai.vercel.app
```

### Development Server

Run the development server locally:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests

Execute the unit test suite:

```bash
yarn test
```

### Production Build

Build the application for production:

```bash
yarn build
```

Start the production server:

```bash
yarn start
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Developed by `@yun.khngn`.
