# Image Generation App

A Next.js application that generates images using the Fireworks AI API. Built with TypeScript, Tailwind CSS, and modern React patterns.

## 🚀 Features

- Image generation using Stable Diffusion 3.5
- Customizable generation parameters
- Responsive design
- Real-time generation status
- Error handling and validation
- Client-side image caching
- Automatic image format handling (JPEG/PNG)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Custom components
- **API Integration:** Fireworks AI
- **Icons:** Lucide React

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/BRama10/diffusion-demo.git
cd diffusion-demo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```bash
FIREWORKS_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Configuration

Adjust the following in your environment:

- `FIREWORKS_API_KEY`: Your Fireworks AI API key
- Image generation parameters in the UI:
  - Aspect ratio
  - Guidance scale
  - Number of inference steps
  - Image format (JPEG/PNG)

## 📚 Documentation

Detailed documentation is available in the following sections:
- [Project Setup](./tutorial/setup.md)
- [Backend Setup](./tutorial/backend.md)
- [Components](./tutorial/component.md)
- [Frontend Implementation](./tutorial/frontend.md)
- [Deployment](./tutorial/deploy.md)



## 🌟 Usage

1. Enter your desired image prompt
2. Adjust generation parameters:
   - Choose aspect ratio
   - Set guidance scale
   - Adjust inference steps
   - Select output format
3. Click "Generate" to create your image
4. The generated image will appear below the prompt
5. Images can be downloaded or regenerated
