import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Clock, Trash2, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const [history, setHistory] = useState([]);
    const [selectedDesign, setSelectedDesign] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }

        const fetchHistory = async () => {
            try {
                const res = await axios.get(`/api/design/history/${user.id}`);
                setHistory(res.data);
            } catch (err) {
                console.error('Failed to fetch history', err);
            }
        };

        fetchHistory();
    }, [user, navigate]);

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this design?')) {
            try {
                await axios.delete(`/api/design/${id}`);
                setHistory(history.filter(item => item.id !== id));
            } catch (err) {
                console.error('Failed to delete design', err);
                alert('Failed to delete design');
            }
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-bold text-stone-900">Your Designs</h1>
                <Link
                    to="/design"
                    className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-full font-semibold hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" /> New Design
                </Link>
            </div>

            {history.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-stone-100 shadow-sm">
                    <div className="inline-block p-4 bg-stone-100 rounded-full mb-4">
                        <Clock className="w-8 h-8 text-stone-400" />
                    </div>
                    <h3 className="text-xl font-medium text-stone-900 mb-2">No designs yet</h3>
                    <p className="text-stone-500 mb-6">Start your first interior design project today.</p>
                    <Link to="/design" className="text-amber-600 font-medium hover:underline">Create Design &rarr;</Link>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {history.map((design) => (
                        <div key={design.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-stone-100 group relative">
                            <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => setSelectedDesign(design)}>
                                <img
                                    src={design.generated_image.startsWith('http') ? design.generated_image : `/uploads/${design.generated_image}`}
                                    alt={design.theme}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button className="bg-white/90 text-stone-900 px-4 py-2 rounded-full font-medium flex items-center gap-2 shadow-lg">
                                        <Eye className="w-4 h-4" /> View
                                    </button>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                                    {design.theme}
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-sm text-stone-500 mb-1">Dimensions: {design.dimensions}</p>
                                        <p className="font-semibold text-stone-900">
                                            Est. Cost: ${JSON.parse(design.cost_estimation).reduce((acc, item) => acc + item.cost, 0)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDelete(e, design.id)}
                                        className="text-stone-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                        title="Delete Design"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedDesign && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={() => setSelectedDesign(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-stone-100 flex justify-between items-center sticky top-0 bg-white z-10">
                                <div>
                                    <h2 className="text-2xl font-bold text-stone-900">{selectedDesign.theme} Redesign</h2>
                                    <p className="text-stone-500 text-sm">Created on {new Date(selectedDesign.created_at).toLocaleDateString()}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedDesign(null)}
                                    className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-stone-500" />
                                </button>
                            </div>

                            <div className="p-6 grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Original Room
                                        </h3>
                                        <div className="rounded-xl overflow-hidden bg-stone-100 aspect-video">
                                            <img
                                                src={`/uploads/${selectedDesign.original_image}`}
                                                alt="Original"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span> AI Redesign
                                        </h3>
                                        <div className="rounded-xl overflow-hidden bg-stone-100 aspect-video shadow-lg ring-1 ring-black/5">
                                            <img
                                                src={selectedDesign.generated_image.startsWith('http') ? selectedDesign.generated_image : `/uploads/${selectedDesign.generated_image}`}
                                                alt="Generated"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="bg-stone-50 rounded-xl p-6 border border-stone-100 h-full">
                                        <h3 className="text-xl font-bold text-stone-900 mb-6">Renovation Plan</h3>

                                        <div className="space-y-4 mb-8">
                                            <div className="flex justify-between py-3 border-b border-stone-200">
                                                <span className="text-stone-600">Theme</span>
                                                <span className="font-medium text-stone-900">{selectedDesign.theme}</span>
                                            </div>
                                            <div className="flex justify-between py-3 border-b border-stone-200">
                                                <span className="text-stone-600">Dimensions</span>
                                                <span className="font-medium text-stone-900">{selectedDesign.dimensions}</span>
                                            </div>
                                        </div>

                                        <h4 className="font-semibold text-stone-900 mb-4">Cost Estimates</h4>
                                        <div className="space-y-3">
                                            {JSON.parse(selectedDesign.cost_estimation).map((item, index) => (
                                                <div key={index} className="flex justify-between items-center bg-white p-3 rounded-lg border border-stone-100 shadow-sm">
                                                    <span className="text-stone-700">{item.item}</span>
                                                    <span className="font-mono font-medium text-amber-600">${item.cost}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-8 pt-6 border-t border-stone-200 flex justify-between items-center">
                                            <span className="text-lg font-bold text-stone-900">Total Estimated Cost</span>
                                            <span className="text-2xl font-bold text-amber-600">
                                                ${JSON.parse(selectedDesign.cost_estimation).reduce((acc, item) => acc + item.cost, 0)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Dashboard;
