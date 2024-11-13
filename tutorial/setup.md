# Initializing the Next.js Image Generation Project

## Prerequisites: Installing Node.js and npm

### ⚠️ Skip if already installed ⚠️

Before we can create our Next.js project, we need Node.js and npm installed. Here's how to install them:

### Windows:

1. Visit the [Node.js website](https://nodejs.org)
2. Download the LTS (Long Term Support) version
3. Run the installer (.msi file)
4. Follow the installation wizard
5. Verify installation by opening Command Prompt and typing:

```bash
node --version
npm --version
```

### macOS:

Using Homebrew (recommended):

```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js (includes npm)
brew install node

# Verify installation
node --version
npm --version
```

Or download the installer from [Node.js website](https://nodejs.org)

### Linux (Ubuntu/Debian):

```bash
# Update package list
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

### Linux (Fedora):

```bash
# Install Node.js and npm
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version
```

If you see version numbers after running the verify commands, you're ready to proceed!

Let's set up our project from scratch using `create-next-app`. I'll guide you through each step and explain the choices we make.

## Step 1: Create New Project

Open your terminal and run:

```bash
npx create-next-app@latest
```

When prompted "Need to install the following packages: create-next-app@15.0.3", type:

```bash
y
```

## Step 2: Project Configuration

You'll be presented with several prompts. Here are the choices we need and why:

1. **Project name:**

```bash
✔ What is your project named? … diffusion-demo
```

This will be your project directory name.

2. **TypeScript:**

```bash
✔ Would you like to use TypeScript? … No / Yes
> Yes
```

We need TypeScript for type safety and better development experience.

3. **ESLint:**

```bash
✔ Would you like to use ESLint? … No / Yes
> Yes
```

ESLint helps catch problems in our code early.

4. **Tailwind CSS:**

```bash
✔ Would you like to use Tailwind CSS? … No / Yes
> Yes
```

We'll use Tailwind for styling our components.

5. **`src/` directory:**

```bash
✔ Would you like your code inside a `src/` directory? … No / Yes
> No
```

6. **App Router:**

```bash
✔ Would you like to use App Router? (recommended) … No / Yes
> Yes
```

We'll use the new App Router for better routing features.

7. **Turbopack:**

```bash
✔ Would you like to use Turbopack for next dev? … No / Yes
> Yes
```

Faster development server.

8. **Import Alias:**

```bash
✔ Would you like to customize the import alias (@/*)? … No / Yes
> No
```

The default `@/` alias is fine for our needs.

## Step 3: Project Creation

After answering all prompts, Next.js will:

1. Create your project directory
2. Set up all necessary files
3. Install required dependencies

You'll see output like:

```bash
Creating a new Next.js app in /Users/rama2r/diffusion-demo.

Using npm.

Initializing project with template: app-tw
```

## Step 4: Directory Structure

After initialization, you'll have a project structure like this:

```
diffusion-demo/
├── src/
│   ├── app/
│   │   ├── page.tsx        # Main page (we'll modify this)
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
├── public/                 # Static files
├── tailwind.config.js      # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Project dependencies
└── README.md             # Project documentation
```

## Step 5: Verify Installation

Navigate into your project directory and start the development server:

```bash
cd diffusion-demo
npm run dev
```

You should see output indicating the server is running, typically at `http://localhost:3000`.

## Next Steps

1. Create necessary directories:

```bash
mkdir src/components
mkdir src/app/api
```

2. Install additional dependencies we'll need:

```bash
npm install lucide-react zod
```

Now your project is set up and ready for building the image generation application!

---
[Deploy →](./deploy.md)