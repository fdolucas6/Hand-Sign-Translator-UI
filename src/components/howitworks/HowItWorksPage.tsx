import React, { useState } from 'react';
import { 
  Camera, Scan, Share2, Scale, Cpu, BarChart2, AlignLeft, Volume2,
  Shield, Check, ArrowRight, ArrowLeftRight, Layers
} from 'lucide-react';
import { PIPELINE_STAGES } from '../../data/pipelineStages';
import { StageNode, ActivePage } from '../../types/asl';

interface HowItWorksPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  const [selectedStage, setSelectedStage] = useState<StageNode>(PIPELINE_STAGES[2]); // Default Stage 03

  const getStageIcon = (iconName: string) => {
    switch (iconName) {
      case 'Camera': return <Camera className="w-5 h-5 text-blue-600" />;
      case 'Scan': return <Scan className="w-5 h-5 text-blue-600" />;
      case 'Share2': return <Share2 className="w-5 h-5 text-blue-600" />;
      case 'Scale': return <Scale className="w-5 h-5 text-blue-600" />;
      case 'Cpu': return <Cpu className="w-5 h-5 text-blue-600" />;
      case 'BarChart2': return <BarChart2 className="w-5 h-5 text-blue-600" />;
      case 'AlignLeft': return <AlignLeft className="w-5 h-5 text-blue-600" />;
      case 'Volume2': return <Volume2 className="w-5 h-5 text-blue-600" />;
      default: return <Share2 className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 animate-fade-in">
      {/* Top Header & Telemetry Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 uppercase font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            ARCHITECTURE &amp; MACHINE LEARNING ARCHITECTURE / V2.4 PRODUCTION SPEC
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
            How Hand Sign Translator Operates
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            From live optical frames to synthesized speech: an end-to-end overview of our real-time computer vision and 63-dimensional neural classification pipeline.
          </p>
        </div>

        {/* Top Right Metrics */}
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="bg-white border border-blue-100 rounded-xl px-4 py-3 shadow-xs min-w-[130px]">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              PIPELINE LATENCY
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-blue-600 font-heading">
              18.4 ms
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xs min-w-[130px]">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              TARGET RATE
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-800 font-heading">
              30 FPS
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-xs min-w-[130px]">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              SPATIAL JOINTS
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-slate-800 font-heading">
              21 (3D)
            </div>
          </div>
        </div>
      </div>

      {/* Sequence Flow Header */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">
              SEQUENCE FLOW
            </span>
            <h2 className="text-2xl font-bold text-slate-900 font-heading tracking-tight">
              Eight-Stage Processing Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Explore each sequential node in our zero-latency pipeline. Click any block to view tensor transformation nuances.
          </p>
        </div>

        {/* 8-Stage Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {PIPELINE_STAGES.map((stage) => {
            const isSelected = selectedStage.id === stage.id;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStage(stage)}
                className={`text-left p-5 rounded-2xl border transition-all relative flex flex-col justify-between h-full group ${
                  isSelected
                    ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/20'
                    : 'bg-white/80 hover:bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold font-mono text-blue-600 tracking-wider">
                      {stage.stepNumber} // {stage.category}
                    </span>
                    <div className="p-2 rounded-xl bg-blue-50 group-hover:scale-105 transition-transform">
                      {getStageIcon(stage.iconName)}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 font-heading mb-2">
                    {stage.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {stage.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] font-mono">
                  <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                    {stage.tags[0]}
                  </span>
                  <span className="text-blue-600 font-semibold">
                    {stage.tags[1]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail Panel */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              ACTIVE SELECTION: STAGE {selectedStage.stepNumber} — {selectedStage.title.toUpperCase()}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 font-heading">
              {selectedStage.detailData.heading}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {selectedStage.detailData.description}
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl px-5 py-3 min-w-[150px]">
              <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider font-mono">
                {selectedStage.detailData.metricLabel1}
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-blue-700 font-heading mt-0.5">
                {selectedStage.detailData.metricValue1}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 min-w-[150px]">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                {selectedStage.detailData.metricLabel2}
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-800 font-heading mt-0.5">
                {selectedStage.detailData.metricValue2}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Architecture Section */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider font-mono">
            SYSTEM ARCHITECTURE
          </span>
          <h2 className="text-2xl font-bold text-slate-900 font-heading tracking-tight">
            Dataflow Infrastructure &amp; Technical Specs
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Client-Server Highway Diagram */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    Client-Server Highway
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  18ms Bidirectional Latency
                </span>
              </div>

              {/* Data Flow Diagram */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative py-4">
                {/* Node 1: Browser */}
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 text-center flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-700 uppercase font-mono tracking-wider">
                      CLIENT (BROWSER)
                    </span>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 mt-2.5 text-left">
                      <li>• Webcam Camera Stream</li>
                      <li>• Canvas Frame Scaler</li>
                      <li>• Web Speech Audio API</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-2 border-t border-blue-100 text-[10px] font-mono text-blue-600 font-semibold">
                    Local Rendering
                  </div>
                </div>

                {/* Node 2: FastAPI */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 text-center flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-700 uppercase font-mono tracking-wider">
                      FASTAPI BACKEND
                    </span>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 mt-2.5 text-left">
                      <li>• Uvicorn Asynchronous I/O</li>
                      <li>• Coordinate Normalizer</li>
                      <li>• Debounce Stream Filter</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-200 text-[10px] font-mono text-emerald-600 font-semibold">
                    Python 3.11 Runtime
                  </div>
                </div>

                {/* Node 3: Neural Model */}
                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 text-center flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-amber-800 uppercase font-mono tracking-wider">
                      NEURAL WEIGHTS
                    </span>
                    <ul className="text-[11px] text-slate-600 space-y-1.5 mt-2.5 text-left">
                      <li>• MediaPipe Hand Landmarker</li>
                      <li>• Dense Classifier (.onnx)</li>
                      <li>• Softmax 27 Classes</li>
                    </ul>
                  </div>
                  <div className="mt-4 pt-2 border-t border-amber-100 text-[10px] font-mono text-amber-700 font-semibold">
                    Quantized INT 8
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono flex-wrap gap-2">
              <span>Transport: <strong>JSON / Binary WebSockets</strong></span>
              <span>Serialization: <strong>FlatBuffers / REST</strong></span>
              <span>Fallback: <strong>HTTP/2 SSE Stream</strong></span>
            </div>
          </div>

          {/* Pipeline Specifications Table */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-4">
                <Layers className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Pipeline Specifications
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Hard operational constraints designed to guarantee real-time execution across modern laptops and mobile browsers.
              </p>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500">Input Camera Resolution</span>
                  <span className="font-mono font-bold text-slate-800">640×480 / 1280×720</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500">Extracted Hand Features</span>
                  <span className="font-mono font-bold text-blue-600">63 Normalized Floats (21 × 3)</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500">Supported Target Classes</span>
                  <span className="font-mono font-bold text-slate-800">26 Letters (A–Z) + NO_SIGN</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500">Inference Execution Time</span>
                  <span className="font-mono font-bold text-emerald-600">~15ms – 22ms per tick</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500">Debounce Gate Requirement</span>
                  <span className="font-mono font-bold text-slate-800">3 Stable Consecutive Frames</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-slate-500">Audio Synthesizer Engine</span>
                  <span className="font-mono font-bold text-slate-800">W3C Web Speech Synthesis</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <span>Validated on Safari, Chrome &amp; Firefox</span>
              <span className="text-emerald-600 font-semibold">100% Client Privacy Safe</span>
            </div>
          </div>
        </div>
      </div>

      {/* Linguistic Scope & Ethical Statement */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-3">
            <div className="text-xs font-bold text-amber-700 uppercase tracking-wider font-mono">
              LINGUISTIC SCOPE &amp; ETHICAL STATEMENT • Clarification Notice
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Fingerspelling vs Full American Sign Language (ASL)
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              This assistive system specializes exclusively in real-time classification of the <strong>26 manual alphabet hand shapes (fingerspelling)</strong>. True American Sign Language is a rich, multifaceted, natural human language comprising dynamic spatial verbs, two-handed movement trajectories, facial grammars (non-manual signals), and shoulder positioning.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our tool serves as a bridging assistive device for spelled names, terminology, and educational vocabulary reinforcement. It does not replace full conversational ASL interpreters or encompass idiomatic visual signing grammar.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                Zero Video Storage (In-Memory Processing Only)
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                Open Source Weights Trained on Diverse Skin Profiles
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sandbox Banner */}
      <div className="bg-blue-600 rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="text-xs font-bold tracking-wider uppercase text-blue-200 font-mono">
            INTERACTIVE SANDBOX
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Ready to observe the pipeline live?
          </h2>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Launch our real-time translator studio to visualize skeletal hand landmarks overlaid onto your camera in sub-20ms latency.
          </p>
          <div className="flex flex-wrap gap-3 pt-3">
            <button
              onClick={() => onNavigate('translator')}
              className="px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-xl text-sm shadow-sm transition active:scale-95 flex items-center gap-2"
            >
              <span>Open Live Translator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('guide')}
              className="px-5 py-2.5 bg-blue-700/80 hover:bg-blue-700 text-white font-bold rounded-xl text-sm border border-blue-500/50 transition active:scale-95"
            >
              Browse Alphabet Guide
            </button>
          </div>
        </div>
        {/* Subtle decorative background shape */}
        <div className="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-blue-500/30 blur-2xl pointer-events-none" />
      </div>
    </div>
  );
};
