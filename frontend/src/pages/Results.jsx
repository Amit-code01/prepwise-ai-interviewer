import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, BookOpen, ArrowRight, Award } from "lucide-react";

function Results() {
  const stored = localStorage.getItem("result");
  const navigate = useNavigate();

  if (!stored) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <AlertCircle className="w-12 h-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No results found. Please complete an interview first.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-indigo-600 font-bold hover:underline">Return Home</button>
      </div>
    );
  }

  let result;
  try {
    result = JSON.parse(stored);
  } catch {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Invalid result data</div>;
  }

  if (!result.feedback) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">No feedback available</div>;
  }

  const [visibleCount, setVisibleCount] = useState(1);

  const handleNext = () => {
    if (visibleCount < result.feedback.length) {
      setVisibleCount(visibleCount + 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-10 mb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-6"
          >
            <Award className="w-8 h-8 text-indigo-600" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            Initial <span className="text-indigo-600">Feedback</span>
          </motion.h2>
          <p className="mt-4 text-slate-500 font-medium">Review your responses before the final diagnostic report.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { label: "Technical", val: result.scores?.technical, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Communication", val: result.scores?.communication, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Confidence", val: result.scores?.confidence, color: "text-violet-600", bg: "bg-violet-50" }
          ].map((score, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm text-center"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">{score.label}</h3>
              <p className={`text-4xl font-black ${score.color}`}>
                {score.val ?? 0}<span className="text-slate-300 text-xl">/10</span>
              </p>
            </motion.div>
          ))}
        </div>

        {/* Feedback Section */}
        <div className="space-y-10">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xl font-bold text-slate-800">Reviewing {visibleCount} of {result.feedback.length} Answers</h3>
            <div className="flex-grow h-px bg-slate-200"></div>
          </div>

          <AnimatePresence>
            {result.feedback.slice(0, visibleCount).map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Question Header */}
                <div className="p-6 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black bg-indigo-600 text-white px-2 py-0.5 rounded">Q{i + 1}</span>
                    <span className="text-sm font-bold text-indigo-600 uppercase tracking-tighter">Analysis</span>
                  </div>
                  <p className="text-lg font-bold text-slate-800 leading-snug">{f.question || "N/A"}</p>
                </div>

                <div className="p-8 space-y-8">
                  {/* User Answer */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400">Your Response</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-slate-100 italic">
                      "{f.userAnswer || "N/A"}"
                    </p>
                  </div>

                  {/* Comparison Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <BookOpen className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Ideal Answer</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {f.idealAnswer || "N/A"}
                      </p>
                    </div>

                    <div className="bg-orange-50/50 p-5 rounded-2xl border border-orange-100">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-orange-600/70">Key Gaps Identified</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {f.gaps?.length ? f.gaps.map((gap, gIdx) => (
                          <span key={gIdx} className="bg-white text-orange-700 text-[11px] font-bold px-2 py-1 rounded border border-orange-200">
                            {gap}
                          </span>
                        )) : <span className="text-sm text-emerald-600 font-medium italic">No major gaps found!</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <motion.div layout className="mt-16 flex justify-center pb-10">
          {visibleCount < result.feedback.length ? (
            <button
              onClick={handleNext}
              className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-10 py-4 rounded-2xl shadow-xl transition-all"
            >
              Next Response
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => navigate("/report")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-12 py-5 rounded-2xl shadow-xl shadow-indigo-200 transition-all scale-110"
            >
              Generate Full Report
              <CheckCircle2 className="w-6 h-6" />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default Results;