# Building an Advanced React Image Generator Component - Comprehensive Guide

## Table of Contents
1. [Basic Setup](#basic-setup)
2. [TypeScript Interfaces](#typescript-interfaces)
3. [Component State Management](#component-state-management)
4. [Image History Management](#image-history-management)
5. [Core UI Components](#core-ui-components)
6. [Advanced UI Features](#advanced-ui-features)
7. [Image Gallery Implementation](#image-gallery-implementation)
8. [Styling Deep Dive](#styling-deep-dive)

## Basic Setup

First, create a new file `components/ImageGenerator.tsx`:

```typescript
'use client'

import React, { useState, useEffect } from 'react';
import { Info, Download } from 'lucide-react';

const ImageGenerator = () => {
    return (
        <div>Image Generator Component</div>
    );
};

export default ImageGenerator;
```

**Key Points:**
- `'use client'` directive enables client-side rendering
- Importing Lucide icons for enhanced UI
- Basic component structure following React best practices

## TypeScript Interfaces

Define the type structure:

```typescript
export interface GenerationSettings {
    prompt: string;
    aspectRatio: string;
    guidanceScale: number;
    numInferenceSteps: number;
    seed: number;
    accept: 'image/jpeg' | 'image/png';
}

interface GeneratedImage {
    url: string;
    prompt: string;
    timestamp: number;
    settings: GenerationSettings;
}

interface ImageGeneratorProps {
    onGenerate: (settings: GenerationSettings) => Promise<string>;
    isLoading?: boolean;
    error?: string | null;
}
```

**Interface Breakdown:**
- `GenerationSettings`: Core configuration for image generation
- `GeneratedImage`: Structure for storing generated image data
- `ImageGeneratorProps`: Component props with optional loading and error states

## Component State Management

Initialize component state:

```typescript
const ImageGenerator: React.FC<ImageGeneratorProps> = ({
    onGenerate,
    isLoading = false,
    error = null
}) => {
    const [settings, setSettings] = useState<GenerationSettings>({
        prompt: '',
        aspectRatio: '16:9',
        guidanceScale: 0,
        numInferenceSteps: 4,
        seed: 0,
        accept: 'image/jpeg'
    });
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

    useEffect(() => {
        return () => {
            // Cleanup URLs on unmount
            generatedImages.forEach(img => {
                URL.revokeObjectURL(img.url);
            });
        };
    }, []);
}
```

**State Management Details:**
- Settings initialized with sensible defaults
- Image URL tracking for current generation
- History tracking with cleanup mechanism
- URL cleanup on component unmount

## Image Generation Handlers

```typescript
const handleGenerate = async () => {
    try {
        const newImageUrl = await onGenerate(settings);

        const newImage: GeneratedImage = {
            url: newImageUrl,
            prompt: settings.prompt,
            timestamp: Date.now(),
            settings: { ...settings }
        };

        setImageUrl(newImageUrl);
        setGeneratedImages(prev => [newImage, ...prev]);
    } catch (err) {
        console.error('Error generating image:', err);
    }
};

const handleSave = async () => {
    if (!imageUrl) return;

    const extension = settings.accept === 'image/jpeg' ? 'jpg' : 'png';
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-image-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
```

**Handler Functionality:**
- `handleGenerate`: Manages image generation and history
- `handleSave`: Implements image download functionality
- Error handling and type safety

## Core UI Components

### InfoTooltip Component

```typescript
const InfoTooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-block">
        <Info className="w-4 h-4 text-gray-400 inline-block ml-2" />
        <div className="invisible group-hover:visible absolute z-10 w-48 px-2 py-1 
                      text-sm text-white bg-gray-700 rounded-md -right-1 top-full mt-1">
            {text}
        </div>
    </div>
);
```

**Styling Breakdown:**
- `group/group-hover`: Tailwind's group functionality for hover effects
- `relative/absolute`: Positioning system for tooltip
- `invisible/visible`: Handle tooltip display states
- `z-10`: Ensure proper layering
- `text-sm`: Consistent typography scale

### Main Container Structure

```typescript
<div className="flex flex-col space-y-6 max-w-4xl mx-auto p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
            {/* Prompt Input */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Prompt*
                </label>
                <textarea
                    value={settings.prompt}
                    onChange={(e) => setSettings({ ...settings, prompt: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md min-h-[100px] 
                             focus:ring-2 focus:ring-orange-200 focus:border-orange-400 
                             transition-colors disabled:bg-gray-50 disabled:text-gray-500 
                             !text-black"
                    placeholder="Enter your prompt here..."
                    disabled={isLoading}
                />
            </div>
            
            {/* Generated Image Display */}
            {imageUrl && (
                <div className="border border-gray-200 rounded-md p-4 shadow-sm 
                              hover:shadow-md transition-shadow">
                    <img
                        src={imageUrl}
                        alt="Generated"
                        className="w-full rounded-md"
                    />
                </div>
            )}
            
            {/* Error Display */}
            {error && (
                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                    {error}
                </div>
            )}
        </div>
        
        {/* Right Column - Options */}
        <div className="space-y-6">
            {/* Options content */}
        </div>
    </div>
</div>
```

**Layout & Styling Analysis:**
- `max-w-4xl`: Constrains width for readability
- `grid-cols-1 md:grid-cols-2`: Responsive layout
- `space-y-6`: Consistent vertical spacing
- `rounded-md`: Uniform border radius
- `transition-*`: Smooth state changes
- Focus states for accessibility

## Advanced UI Features

### Control Options Panel

```typescript
<div className="space-y-6">
    <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Options</h3>
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* Aspect Ratio Selector */}
            <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                    Aspect Ratio
                    <InfoTooltip text="The width-to-height ratio of the generated image" />
                </label>
                <select
                    value={settings.aspectRatio}
                    onChange={(e) => setSettings({ ...settings, aspectRatio: e.target.value })}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white 
                             shadow-sm focus:ring-2 focus:ring-orange-200 
                             focus:border-orange-400 transition-colors"
                >
                    <option value="16:9">16:9</option>
                    <option value="1:1">1:1</option>
                    {/* Additional options */}
                </select>
            </div>

            {/* Slider Controls */}
            <div>
                <label className="flex items-center text-sm font-medium text-gray-700">
                    Guidance Scale
                    <InfoTooltip text="Controls how closely the image follows the prompt" />
                </label>
                <div className="flex items-center space-x-4">
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={settings.guidanceScale}
                        onChange={(e) => setSettings({ 
                            ...settings, 
                            guidanceScale: Number(e.target.value) 
                        })}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none 
                                 cursor-pointer accent-orange-400"
                    />
                    <span className="w-12 text-sm text-gray-600 tabular-nums">
                        {settings.guidanceScale}
                    </span>
                </div>
            </div>
        </div>
    </div>
</div>
```

**UI Component Analysis:**
- Control panel with grouped options
- Consistent spacing and alignment
- Custom-styled range inputs
- Accessible form controls
- Informative tooltips
- Visual feedback for interactions

## Image Gallery Implementation

```typescript
<div className="border-t pt-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Images</h3>
    <div className="relative group">
        {/* Navigation Arrows */}
        <button
            onClick={(e) => {
                e.preventDefault();
                const container = document.getElementById('carousel-container');
                if (container) {
                    container.scrollBy({ left: -300, behavior: 'smooth' });
                }
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 
                     bg-white rounded-full p-2 shadow-md opacity-0 
                     group-hover:opacity-100 transition-opacity disabled:opacity-0 
                     hover:bg-gray-50 focus:outline-none focus:ring-2 
                     focus:ring-orange-200"
            aria-label="Scroll left"
        >
            {/* Arrow SVG */}
        </button>

        {/* Image Gallery Container */}
        <div id="carousel-container" 
             className="overflow-x-auto pb-4 hide-scrollbar scroll-smooth">
            <div className="flex gap-4 min-w-full">
                {generatedImages.map((img, index) => (
                    <div
                        key={img.timestamp}
                        onClick={() => {
                            setImageUrl(img.url);
                            setSettings(img.settings);
                        }}
                        className="flex-none w-64 cursor-pointer border rounded-md 
                                 overflow-hidden hover:shadow-md transition-all 
                                 hover:scale-105"
                    >
                        <div className="relative pb-[75%]">
                            <img
                                src={img.url}
                                alt={`Generated ${index + 1}`}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                        <div className="p-3 bg-white">
                            <div className="text-sm text-gray-500 line-clamp-2">
                                {img.prompt}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                                {new Date(img.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
</div>
```

**Gallery Features:**
- Horizontal scrolling with smooth behavior
- Hidden scrollbar with custom navigation
- Responsive image cards
- Hover effects and transitions
- Image metadata display
- Reusable image settings

## Styling Deep Dive

### Custom Scrollbar Hiding
```css
<style jsx global>{`
    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }
`}</style>
```

### Tailwind Classes Explained

#### Layout Classes
- `flex-col`: Vertical flex container
- `space-y-6`: 1.5rem gap between children
- `max-w-4xl`: Maximum width of 56rem
- `mx-auto`: Center horizontally
- `p-6`: 1.5rem padding all around

#### Typography Classes
- `text-sm`: 14px font size
- `text-lg`: 18px font size
- `font-medium`: 500 font weight
- `text-gray-700`: Medium gray text color

#### Interactive States
- `hover:shadow-md`: Shadow on hover
- `focus:ring-2`: Focus ring width
- `disabled:opacity-0`: Hide when disabled
- `transition-all`: Smooth all transitions

#### Spacing & Positioning
- `inset-0`: Fill container
- `-translate-y-1/2`: Move up 50%
- `space-x-4`: 1rem horizontal gap
- `gap-4`: 1rem grid gap

#### Visual Effects
- `rounded-md`: Medium border radius
- `shadow-sm`: Small shadow
- `opacity-0`: Fully transparent
- `bg-gray-50`: Light gray background

## Component Usage

```typescript
import ImageGenerator from './components/ImageGenerator';

const App = () => {
    const handleGenerate = async (settings: GenerationSettings) => {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });
        
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    };

    return (
        <ImageGenerator
            onGenerate={handleGenerate}
            isLoading={false}
            error={null}
        />
    );
};
```

This implementation provides a fully-featured image generation interface with:
- Responsive design
- Accessible controls
- Rich user feedback
- History management
- Download capabilities
- Advanced styling
- Type safety

---

Remember to handle proper cleanup of object URLs and implement appropriate error handling in your actual implementation.

---
← [Backend](./backend.md) | [Frontend →](./frontend.md)