import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Mic, BarChart3, FileText, CheckCircle2 } from "lucide-react";

function Home() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await API.post("/resume/upload", formData);
      let profile = res.data.profile;

      if (typeof profile === "string") {
        try {
          profile = JSON.parse(profile);
        } catch (e) {
          console.error("Profile parsing failed", e);
          alert("Error parsing profile");
          return;
        }
      }

      localStorage.setItem("profile", JSON.stringify(profile));
      navigate("/interview");
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please check backend logs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">
            PrepWise <span className="text-indigo-600">AI</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Features</a>
        </div>
        <button
          onClick={() => document.getElementById("resumeInput").click()}
          className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            Next-Gen Interview Prep
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-slate-900 leading-[1.1]">
            Master the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              High‑Signal
            </span>{" "}
            Interview
          </h1>
<p className="text-slate-500 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
  Advanced interview intelligence featuring <strong>resume-aware context</strong>, 
  <strong> real-time technical probing</strong>, and <strong>diagnostic-grade 
  performance mapping</strong>.
</p>

          {/* Styled Upload Area */}
          <div className="max-w-md mx-auto w-full">
            <div 
              className={`p-8 mb-4 border-2 border-dashed rounded-3xl transition-all ${
                file ? "border-emerald-400 bg-emerald-50/30" : "border-slate-200 bg-slate-50/50 hover:border-indigo-300"
              }`}
            >
              <input
                id="resumeInput"
                type="file"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              
              {!file ? (
                <div 
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() => document.getElementById("resumeInput").click()}
                >
                  <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-indigo-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-700">Click to upload resume</p>
                  <p className="text-xs text-slate-400 mt-1">PDF or Word (Max 5MB)</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{file.name}</p>
                  <button 
                    onClick={() => setFile(null)}
                    className="text-xs text-red-500 font-semibold mt-2 hover:underline"
                  >
                    Remove file
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                !file || loading 
                ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
              }`}
            >
              {loading ? "Processing..." : "Start AI Interview"} 
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
        >
          {[
            { 
              icon: FileText, 
              title: "Context Extraction", 
              desc: "Deep-parsing of your skills and projects.",
              color: "text-blue-600",
              bg: "bg-blue-50"
            },
            { 
              icon: Mic, 
              title: "Voice Simulation", 
              desc: "Natural conversation with zero latency.",
              color: "text-purple-600",
              bg: "bg-purple-50"
            },
            { 
              icon: BarChart3, 
              title: "Score Diagnostics", 
              desc: "Granular breakdown of your performance.",
              color: "text-emerald-600",
              bg: "bg-emerald-50"
            },
          ].map((f, i) => (
            <motion.div
              key={f.title}
              whileHover={{ y: -5 }}
              className="bg-white border border-slate-100 p-8 rounded-3xl text-left shadow-sm hover:shadow-md transition-all"
            >
              <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-6`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer Decoration */}
      <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-500 w-full"></div>
    </div>
  );
}

export default Home;