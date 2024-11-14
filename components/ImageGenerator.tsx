import React, { useState, useEffect } from 'react';
import { Info, Download } from 'lucide-react';

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

const GENERATION_TIPS = [
    "Try using descriptive adjectives to specify the style, like 'ethereal', 'vibrant', or 'minimalist'",
    "Include specific lighting details like 'golden hour', 'soft diffused light', or 'dramatic shadows'",
    "Mention artistic mediums for different styles: 'oil painting', 'watercolor', 'digital art', '3D render'",
    "Add camera angles or perspectives like 'close-up', 'aerial view', or 'wide-angle shot'",
    "Specify the mood or atmosphere: 'serene', 'mysterious', 'joyful', 'dramatic'",
    "Include time period references: 'futuristic', 'vintage', 'medieval', 'cyberpunk'",
    "Reference specific art styles: 'impressionist', 'art deco', 'surrealist', 'pop art'",
    "Combine multiple concepts but keep them coherent and related to your main subject",
    "Use color palettes in your prompt: 'pastel colors', 'monochromatic', 'bold contrasting colors'",
    "Specify materials and textures: 'glossy', 'matte', 'metallic', 'rough stone', 'smooth glass'"
];

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

    const getRandomTip = () => {
        const randomIndex = Math.floor(Math.random() * GENERATION_TIPS.length);
        return GENERATION_TIPS[randomIndex];
    };

    const [currentTip, setCurrentTip] = useState(getRandomTip());

    

    useEffect(() => {
        return () => {
            // Cleanup URLs when component unmounts
            generatedImages.forEach(img => {
                URL.revokeObjectURL(img.url);
            });
        };
    }, []);

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

            setCurrentTip(getRandomTip());
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

    const InfoTooltip = ({ text }: { text: string }) => (
        <div className="group relative inline-block">
            <Info className="w-4 h-4 text-gray-400 inline-block ml-2" />
            <div className="invisible group-hover:visible absolute z-10 w-48 px-2 py-1 text-sm text-white bg-gray-700 rounded-md -right-1 top-full mt-1">
                {text}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col space-y-6 max-w-4xl mx-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image Prompt*
                        </label>
                        <textarea
                            value={settings.prompt}
                            onChange={(e) => setSettings({ ...settings, prompt: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md min-h-[100px] focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors disabled:bg-gray-50 disabled:text-gray-500 !text-black"
                            placeholder="Enter your prompt here..."
                            disabled={isLoading}
                        />
                    </div>

                    {imageUrl && (
                        <div className="border border-gray-200 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
                            <img
                                src={imageUrl}
                                alt="Generated"
                                className="w-full rounded-md"
                            />
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !settings.prompt}
                            className="flex-1 bg-orange-400 text-white py-2 px-4 rounded-md hover:bg-orange-500 active:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        >
                            {isLoading ? 'Generating...' : 'Generate'}
                        </button>

                        <button
                            onClick={handleSave}
                            disabled={!imageUrl}
                            className="bg-gray-100 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-200 active:bg-gray-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Right Column - Options (unchanged) */}
                {/* ... existing options code ... */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Options</h3>
                        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    Aspect Ratio
                                    <InfoTooltip text="The width-to-height ratio of the generated image" />
                                </label>
                                <select
                                    value={settings.aspectRatio}
                                    onChange={(e) => setSettings({ ...settings, aspectRatio: e.target.value })}
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors !text-black"
                                >
                                    <option className='!text-black' value="16:9">16:9</option>
                                    <option className='!text-black' value="1:1">1:1</option>
                                    <option className='!text-black' value="21:9">21:9</option>
                                    <option className='!text-black' value="2:3">2:3</option>
                                    <option className='!text-black' value="3:2">3:2</option>
                                    <option className='!text-black' value="4:5">4:5</option>
                                    <option className='!text-black' value="5:4">5:4</option>
                                    <option className='!text-black' value="9:16">9:16</option>
                                    <option className='!text-black' value="9:21">9:21</option>
                                </select>
                            </div>

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
                                        onChange={(e) => setSettings({ ...settings, guidanceScale: Number(e.target.value) })}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-400"
                                    />
                                    <span className="w-12 text-sm text-gray-600 tabular-nums">
                                        {settings.guidanceScale}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    Inference Steps
                                    <InfoTooltip text="Number of denoising steps" />
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={settings.numInferenceSteps}
                                        onChange={(e) => setSettings({ ...settings, numInferenceSteps: Number(e.target.value) })}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-400"
                                    />
                                    <span className="w-12 text-sm text-gray-600 tabular-nums">
                                        {settings.numInferenceSteps}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    Seed
                                    <InfoTooltip text="Random seed for image generation" />
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="range"
                                        min="0"
                                        max="1000"
                                        value={settings.seed}
                                        onChange={(e) => setSettings({ ...settings, seed: Number(e.target.value) })}
                                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-400"
                                    />
                                    <span className="w-12 text-sm text-gray-600 tabular-nums">
                                        {settings.seed}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    Format
                                    <InfoTooltip text="Output image format" />
                                </label>
                                <select
                                    value={settings.accept}
                                    onChange={(e) => setSettings({ ...settings, accept: e.target.value as ("image/jpeg" | "image/png") })}
                                    className="className='!text-black' mt-1 w-full p-2 border border-gray-300 rounded-md bg-white shadow-sm focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors !text-black"
                                >
                                    <option className='!text-black' value="image/jpeg">JPEG</option>
                                    <option className='!text-black' value="image/png">PNG</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-md p-4">
                        <div className="flex items-start">
                            <Info className="w-5 h-5 text-orange-400 mt-0.5" />
                            <div className="ml-3">
                                <h4 className="text-sm font-medium text-orange-800">
                                    Generation Tips
                                </h4>
                                <p className="mt-1 text-sm text-orange-700">
                                    {currentTip}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Generated Images History */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Generated Images</h3>
                <div className="relative group">
                    {/* Left Arrow */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            const container = document.getElementById('carousel-container');
                            if (container) {
                                container.scrollBy({ left: -300, behavior: 'smooth' });
                            }
                        }}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        aria-label="Scroll left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    {/* Right Arrow */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            const container = document.getElementById('carousel-container');
                            if (container) {
                                container.scrollBy({ left: 300, behavior: 'smooth' });
                            }
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        aria-label="Scroll right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div id="carousel-container" className="overflow-x-auto pb-4 hide-scrollbar scroll-smooth">
                        <div className="flex gap-4 min-w-full">
                            {generatedImages.map((img, index) => (
                                <div
                                    key={img.timestamp}
                                    onClick={() => {
                                        setImageUrl(img.url);
                                        setSettings(img.settings);
                                    }}
                                    className="flex-none w-64 cursor-pointer border rounded-md overflow-hidden hover:shadow-md transition-all hover:scale-105"
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

            {/* Add this style block at the end of your component */}
            <style jsx global>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default ImageGenerator;