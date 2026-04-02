import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Send, HelpCircle, Loader2 } from "lucide-react";

function Interview() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [visibleCount, setVisibleCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const stored = localStorage.getItem("profile");
      if (!stored) {
        alert("No profile found. Please upload resume again.");
        navigate("/");
        return;
      }

      let profile;
      try {
        profile = JSON.parse(stored);
      } catch (e) {
        console.error("Invalid profile JSON", e);
        alert("Corrupted profile data");
        return;
      }

      const res = await API.post("/interview/generate", { profile });
      setQuestions(res.data.questions);
      setAnswers(new Array(res.data.questions.length).fill(""));
    };

    fetchQuestions();
  }, [navigate]);

  const handleChange = (value, index) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (visibleCount < questions.length) {
      setVisibleCount(visibleCount + 1);
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formattedQuestions = questions.map((q) =>
        typeof q === "string" ? q : q.question
      );

      const res = await API.post("/evaluation/analyze", {
        questions: formattedQuestions,
        answers,
      });

      localStorage.setItem("result", JSON.stringify(res.data));
      navigate("/results");
    } catch (err) {
      console.error("Submit Error:", err);
      alert("Something went wrong during evaluation.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const autoResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="font-medium">Generating your personalized interview questions...</p>
      </div>
    );
  }

  const progress = (visibleCount / questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Sticky Header with Progress */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Interview Session</span>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-black px-2 py-0.5 rounded">LIVE</span>
          </div>
          <div className="text-sm font-bold text-slate-600">
            Question {visibleCount} <span className="text-slate-300">/</span> {questions.length}
          </div>
        </div>
        <div className="max-w-3xl mx-auto mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-indigo-600"
          />
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 pt-12">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-black text-slate-800 mb-10"
        >
          Technical <span className="text-indigo-600">Assessment</span>
        </motion.h2>

        <div className="space-y-12">
          <AnimatePresence>
            {questions.slice(0, visibleCount).map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group bg-white rounded-3xl border ${
                  i === visibleCount - 1 ? "border-indigo-200 shadow-xl shadow-indigo-100/50" : "border-slate-200 opacity-60"
                } p-8 transition-all`}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    i === visibleCount - 1 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-xl text-slate-800 leading-snug">
                      {typeof q === "string" ? q : q.question}
                    </p>
                    {q.topic && (
                      <span className="inline-block mt-2 text-xs font-bold text-indigo-500 uppercase tracking-tighter bg-indigo-50 px-2 py-0.5 rounded">
                        {q.topic}
                      </span>
                    )}
                  </div>
                </div>

                <textarea
                  value={answers[i]}
                  disabled={i < visibleCount - 1}
                  onChange={(e) => {
                    handleChange(e.target.value, i);
                    autoResize(e);
                  }}
                  className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none resize-none text-slate-700 leading-relaxed ${
                    i === visibleCount - 1 
                    ? "bg-white border-slate-100 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50" 
                    : "bg-slate-50 border-transparent cursor-not-allowed"
                  }`}
                  placeholder="Draft your detailed technical response here..."
                  rows={4}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Action Bar */}
        <motion.div 
          className="mt-12 flex justify-end items-center gap-4"
          layout
        >
          {visibleCount < questions.length ? (
            <button
              onClick={handleNext}
              disabled={!answers[visibleCount - 1]?.trim()}
              className={`group flex items-center gap-2 font-bold px-8 py-4 rounded-2xl transition-all ${
                !answers[visibleCount - 1]?.trim()
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
              }`}
            >
              Next Question
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !answers[visibleCount - 1]?.trim()}
              className={`flex items-center gap-2 font-bold px-10 py-4 rounded-2xl transition-all ${
                isSubmitting 
                ? "bg-slate-400 text-white cursor-wait" 
                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200"
              }`}
            >
              {isSubmitting ? "Generating Feedback..." : "Submit All Answers"}
              {!isSubmitting && <Send className="w-5 h-5" />}
            </button>
          )}
        </motion.div>
      </main>

      {/* Background Decor */}
      <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-emerald-500 opacity-20 pointer-events-none"></div>
    </div>
  );
}

export default Interview;