import React from "react";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Register radar chart components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

function Report() {
  const stored = localStorage.getItem("result");
  let result = stored ? JSON.parse(stored) : null;

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500 bg-slate-50">
        No report data available.
      </div>
    );
  }

  const scores = result.scores || {
    technical: 0,
    communication: 0,
    confidence: 0,
    problemSolving: 0,
    architecture: 0,
    tradeoff: 0,
  };

  const radarData = {
    labels: [
      "Trade-off Analysis",
      "Communication",
      "Confidence",
      "Problem Solving",
      "Architecture",
      "Technical Depth",
    ],
    datasets: [
      {
        label: "Performance Overview",
        data: [
          scores.tradeoff,
          scores.communication,
          scores.confidence,
          scores.problemSolving,
          scores.architecture,
          scores.technical,
        ],
        backgroundColor: "rgba(79, 70, 229, 0.2)", // Indigo-600 with opacity
        borderColor: "#4f46e5", // Indigo-600
        borderWidth: 3,
        pointBackgroundColor: "#4f46e5",
      },
    ],
  };

  // Radar Options for Light Theme
  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: "#e2e8f0" },
        grid: { color: "#e2e8f0" },
        pointLabels: { color: "#475569", font: { size: 12, weight: '600' } },
        ticks: { display: false, stepSize: 20 }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold mb-12 text-center text-slate-800"
      >
        Performance <span className="text-indigo-600">Report</span>
      </motion.h2>

      {/* Radar chart + overall score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center">
          <h3 className="text-lg font-bold mb-6 text-slate-700 self-start">Performance Matrix</h3>
          <div className="w-full max-w-sm">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-bold mb-2 text-slate-700">Overall Score</h3>
          <div className="relative flex items-center justify-center">
             <p className={`text-7xl font-black ${result.overallScore < 50 ? "text-orange-500" : "text-emerald-600"}`}>
                {result.overallScore ?? 0}
             </p>
             <span className="text-slate-400 font-bold ml-1 text-xl">/100</span>
          </div>
          <p className={`mt-4 px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider ${
              result.overallScore < 50 ? "bg-orange-100 text-orange-700" : "bg-emerald-100 text-emerald-700"
            }`}>
            {result.overallScore < 50 ? "Needs Improvement" : "Candidate Passed"}
          </p>
        </div>
      </div>

      {/* Metric boxes */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {Object.entries(scores).map(([key, val]) => (
          <div
            key={key}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-indigo-300 transition-colors"
          >
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tight mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
            <p className="text-2xl font-bold text-indigo-600">{val}</p>
          </div>
        ))}
      </div>

      {/* Missed Keywords */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 mb-12">
        <h3 className="text-lg font-bold mb-4 text-slate-800 uppercase tracking-wide">Missed Keywords</h3>
        <div className="flex flex-wrap gap-2">
          {(result.missedKeywords || []).map((kw, i) => (
            <span
              key={i}
              className="bg-slate-100 text-slate-700 border border-slate-200 px-4 py-1.5 rounded-lg text-sm font-medium"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Gap Analysis */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
            <h3 className="text-2xl font-bold text-slate-800">Gap Analysis</h3>
            <div className="h-px bg-slate-200 flex-grow"></div>
        </div>
        
        {result.feedback.map((f, i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <p className="font-bold text-lg text-slate-800">
                <span className="text-indigo-600 mr-2">Q{i + 1}</span> {f.question}
                </p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs font-bold text-emerald-600 uppercase mb-2 block">Your Answer</label>
                    <p className="text-slate-700 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 italic leading-relaxed">
                        "{f.userAnswer || "N/A"}"
                    </p>
                </div>
                <div>
                    <label className="text-xs font-bold text-indigo-600 uppercase mb-2 block">Ideal Response</label>
                    <p className="text-slate-700 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 leading-relaxed">
                        {f.idealAnswer || "N/A"}
                    </p>
                </div>
            </div>

            <div className="p-6 pt-0">
                <div className="bg-slate-900 rounded-xl p-6 text-slate-100">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                        <h4 className="font-bold text-sm uppercase tracking-widest text-slate-400">AI Evaluation</h4>
                    </div>
                   <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-sm">
  <li className="flex flex-col">
    <span className="text-slate-500 font-semibold uppercase text-xs">Concepts:</span> 
    <span className="text-slate-200">{f.evaluation?.concepts || "N/A"}</span>
  </li>
  <li className="flex flex-col">
    <span className="text-emerald-400 font-semibold uppercase text-xs">Strengths:</span> 
    <span className="text-slate-200">{f.evaluation?.strengths || "N/A"}</span>
  </li>
  <li className="flex flex-col">
    <span className="text-red-400 font-semibold uppercase text-xs">Weaknesses:</span> 
    <span className="text-slate-200">{f.evaluation?.weaknesses || "N/A"}</span>
  </li>
  <li className="flex flex-col">
    <span className="text-indigo-400 font-semibold uppercase text-xs">Focus Area:</span> 
    <span className="text-slate-200">{f.evaluation?.focusArea || "N/A"}</span>
  </li>
</ul>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Report;