import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Upload, Ruler, Palette, Check, ArrowRight, Loader2 } from 'lucide-react';

const themes = [
    { id: 'boho', name: 'Boho', image: 'https://images.unsplash.com/photo-1522444195799-478538b28823?auto=format&fit=crop&w=400' },
    { id: 'scandinavian', name: 'Scandinavian', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=400' },
    { id: 'industrial', name: 'Industrial', image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=400' },
    { id: 'modern', name: 'Modern', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400' },
];

const DesignFlow = () => {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState(null);
    const [dimensions, setDimensions] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            navigate('/auth');
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) setFile(e.target.files[0]);
    };

    const handleGenerate = async () => {
        setLoading(true);
        setStep(3); // Loading state

        const formData = new FormData();
        formData.append('image', file);
        formData.append('dimensions', dimensions);
        formData.append('theme', selectedTheme);
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) formData.append('userId', user.id);

        try {
            const res = await axios.post('/api/design/generate', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
            setStep(4); // Result state
        } catch (err) {
            console.error(err);
            alert('Generation failed. Please try again.');
            setStep(2);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            {/* Progress Bar */}
            <div className="flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-stone-200 -z-10"></div>
                {[1, 2, 3, 4].map((s) => (
                    <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= s ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-500'}`}>
                        {s}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100"
                    >
                        <h2 className="text-2xl font-bold mb-6">Upload Room & Dimensions</h2>
                        <div className="space-y-6">
                            <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 text-center hover:border-amber-500 transition-colors cursor-pointer relative">
                                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                <Upload className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                                <p className="text-stone-600 font-medium">{file ? file.name : 'Click or Drag to Upload Image'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">Room Dimensions (e.g., 10x12 ft)</label>
                                <div className="relative">
                                    <Ruler className="absolute left-3 top-3 text-stone-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={dimensions}
                                        onChange={(e) => setDimensions(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-stone-200 focus:ring-2 focus:ring-amber-500 outline-none"
                                        placeholder="12x14 ft"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                disabled={!file || !dimensions}
                                className="w-full py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                Next Step <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100"
                    >
                        <h2 className="text-2xl font-bold mb-6">Choose Your Style</h2>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {themes.map((theme) => (
                                <div
                                    key={theme.id}
                                    onClick={() => setSelectedTheme(theme.id)}
                                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedTheme === theme.id ? 'border-amber-600 ring-2 ring-amber-100' : 'border-transparent'}`}
                                >
                                    <div className="h-32 overflow-hidden">
                                        <img src={theme.image} alt={theme.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="p-3 text-center font-medium bg-stone-50">{theme.name}</div>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={!selectedTheme}
                            className="w-full py-3 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700 disabled:opacity-50 transition-colors"
                        >
                            Generate Design
                        </button>
                    </motion.div>
                )}

                {step === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <Loader2 className="w-16 h-16 text-amber-600 animate-spin mx-auto mb-6" />
                        <h3 className="text-2xl font-bold mb-2">Designing Your Room...</h3>
                        <p className="text-stone-500">Our AI is analyzing dimensions and applying the {themes.find(t => t.id === selectedTheme)?.name} theme.</p>
                    </motion.div>
                )}

                {step === 4 && result && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white p-4 rounded-2xl shadow-sm">
                                <h3 className="font-bold mb-4">Original</h3>
                                <img src={URL.createObjectURL(file)} alt="Original" className="w-full rounded-lg" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm ring-2 ring-amber-100">
                                <h3 className="font-bold mb-4 text-amber-600">AI Redesign</h3>
                                <img
                                    src={result.generatedImage.startsWith('http') ? result.generatedImage : `/uploads/${result.generatedImage}`}
                                    alt="Generated"
                                    className="w-full rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
                            <h3 className="text-xl font-bold mb-6">Estimated Cost Breakdown</h3>
                            <div className="space-y-4">
                                {result.costEstimation.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center py-3 border-b border-stone-100 last:border-0">
                                        <span className="font-medium text-stone-700">{item.item}</span>
                                        <span className="font-bold text-stone-900">${item.cost}</span>
                                    </div>
                                ))}
                                <div className="flex justify-between items-center pt-4 text-lg font-bold">
                                    <span>Total Estimated Cost</span>
                                    <span className="text-amber-600">${result.costEstimation.reduce((acc, i) => acc + i.cost, 0)}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => setStep(1)} className="flex-1 py-3 border border-stone-300 rounded-lg font-semibold hover:bg-stone-50 transition-colors">
                                Start New Design
                            </button>
                            <button onClick={() => window.print()} className="flex-1 py-3 bg-stone-900 text-white rounded-lg font-semibold hover:bg-stone-800 transition-colors">
                                Download Report
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DesignFlow;
