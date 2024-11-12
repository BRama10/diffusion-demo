// components/ImageGenerator.tsx
'use client'

import React, { useState, useEffect } from 'react';
import { Info, Code } from 'lucide-react';

export interface GenerationSettings {
    prompt: string;
    aspectRatio: string;
    guidanceScale: number;
    numInferenceSteps: number;
    seed: number;
    accept: 'image/jpeg' | 'image/png';
}

interface ImageGeneratorProps {
    onGenerate: (settings: GenerationSettings) => Promise<string>;
    isLoading?: boolean;
    error?: string | null;
}

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

    useEffect(() => {
        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [imageUrl]);

    const handleGenerate = async () => {
        try {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
            const newImageUrl = await onGenerate(settings);
            setImageUrl(newImageUrl);
        } catch (err) {
            console.error('Error generating image:', err);
        }
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
            {/* Rest of your UI code remains the same, just update the button to show loading state */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image Prompt*
                        </label>
                        <textarea
                            value={settings.prompt}
                            onChange={(e) => setSettings({ ...settings, prompt: e.target.value })}
                            className="w-full p-3 border border-gray-300 rounded-md min-h-[100px]"
                            placeholder="Enter your prompt here..."
                            disabled={isLoading}
                        />
                    </div>

                    {imageUrl && (
                        <div className="border border-gray-200 rounded-md p-4">
                            <img
                                src={imageUrl}
                                alt="Generated"
                                className="w-full rounded-md"
                            />
                        </div>
                    )}

                    {error && (
                        <div className="text-red-500 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !settings.prompt}
                        className="w-full bg-orange-400 text-white py-2 px-4 rounded-md hover:bg-orange-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium mb-4">Options</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    Aspect Ratio
                                    <InfoTooltip text="The width-to-height ratio of the generated image" />
                                </label>
                                <select
                                    value={settings.aspectRatio}
                                    onChange={(e) => setSettings({ ...settings, aspectRatio: e.target.value })}
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="16:9">16:9</option>
                                    <option value="5:4">5:4</option>
                                    <option value="1:1">1:1</option>
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
                                        className="flex-1"
                                    />
                                    <span className="w-8 text-sm text-gray-600">{settings.guidanceScale}</span>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    Num Inference Steps
                                    <InfoTooltip text="Number of denoising steps" />
                                </label>
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={settings.numInferenceSteps}
                                        onChange={(e) => setSettings({ ...settings, numInferenceSteps: Number(e.target.value) })}
                                        className="flex-1"
                                    />
                                    <span className="w-8 text-sm text-gray-600">{settings.numInferenceSteps}</span>
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
                                        className="flex-1"
                                    />
                                    <span className="w-8 text-sm text-gray-600">{settings.seed}</span>
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    Accept
                                    <InfoTooltip text="Output image format" />
                                </label>
                                <select
                                    value={settings.accept}
                                    onChange={(e) => setSettings({ ...settings, accept: e.target.value as ("image/jpeg" | "image/png") })}
                                    className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                                >
                                    <option value="image/jpeg">image/jpeg</option>
                                    <option value="image/png">image/png</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;