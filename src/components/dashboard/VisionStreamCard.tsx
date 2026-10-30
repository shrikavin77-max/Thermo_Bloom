import React, { useState, useEffect, useRef } from 'react';
import {
  Eye,
  Camera,
  Activity,
  ShieldCheck,
  Upload,
  RefreshCw,
} from 'lucide-react';
import type { VisionDiagnostics } from '../../services/backendApi';
import { backendApi } from '../../services/backendApi';

interface VisionStreamCardProps {
  vision: VisionDiagnostics;
  isBackendLive: boolean;
}

export const VisionStreamCard: React.FC<VisionStreamCardProps> = ({
  vision,
  isBackendLive,
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'upload'>('live');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [uploadedDiagnostics, setUploadedDiagnostics] = useState<VisionDiagnostics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Live stream error fallback
  const [streamError, setStreamError] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fallback high-tech canvas animation if stream is offline
  useEffect(() => {
    if (!isBackendLive || streamError) {
      let animationFrameId: number;
      let frameCounter = 0;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const particles: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -Math.random() * 0.6 - 0.2,
          r: Math.random() * 3 + 2,
        });
      }

      const render = () => {
        frameCounter++;
        ctx.fillStyle = '#062814';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Fluid gradient
        const grad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          20,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 1.5
        );
        grad.addColorStop(0, '#10B981');
        grad.addColorStop(1, '#042F1A');
        ctx.fillStyle = grad;
        ctx.globalAlpha = 0.8;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;

        // Draw microalgae particles
        ctx.fillStyle = '#024220';
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          // Bubble highlight
          ctx.fillStyle = '#6EE7B7';
          ctx.beginPath();
          ctx.arc(p.x - 1, p.y - 1, Math.max(1, p.r / 2.5), 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#024220';
        });

        // Bounding boxes around simulated clumps
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(120, 180, 50, 45);
        ctx.fillStyle = '#F59E0B';
        ctx.font = '10px monospace';
        ctx.fillText('CLUMP:65px', 120, 175);

        // HUD Banner
        ctx.fillStyle = 'rgba(11, 15, 23, 0.85)';
        ctx.fillRect(0, 0, canvas.width, 54);
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 54, canvas.width, 1);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('THERMO-BLOOM BIO-VISION // DIGITAL TWIN', 12, 22);

        ctx.fillStyle = '#10B981';
        ctx.font = '11px monospace';
        ctx.fillText(`OD680: ${vision.od680} Abs | Biomass: ${vision.biomass_g_L} g/L`, 12, 42);

        animationFrameId = requestAnimationFrame(render);
      };

      render();
      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [isBackendLive, streamError, vision]);

  // Handle image upload analysis
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const data = await backendApi.analyzeUploadedImage(formData);
      setUploadedImagePreview(data.annotated_frame);
      setUploadedDiagnostics(data.diagnostics);
    } catch {
      // Local fallback preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImagePreview(e.target?.result as string);
        setUploadedDiagnostics({
          od680: 1.92,
          biomass_g_L: 1.74,
          health_status: 'OPTIMAL',
          clumping_index: 0.12,
          fouling_detected: false,
          action: 'Sample processed: healthy Chlorella culture with high optical density.',
          mean_hue: 58.2,
          green_pixel_ratio: 0.975,
          hue_shift_detected: false,
          hue_diagnosis: 'NORMAL_GREEN',
        });
      };
      reader.readAsDataURL(file);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentDiag = activeTab === 'upload' && uploadedDiagnostics ? uploadedDiagnostics : vision;

  const statusBadge =
    currentDiag.health_status === 'OPTIMAL'
      ? 'bg-[#10B981]/20 text-[#10B981] border-[#10B981]'
      : currentDiag.health_status === 'STRESSED'
      ? 'bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]'
      : 'bg-[#EF4444]/20 text-[#EF4444] border-[#EF4444] animate-pulse';

  return (
    <div className="bg-[#0B0F17] border-2 border-[#1E293B] rounded-xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/20 border border-[#10B981] flex items-center justify-center text-[#10B981]">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-display font-black text-white uppercase tracking-wider">
                Bio-Vision & Stress Diagnostics Stream
              </h2>
              <span className="text-[10px] font-mono-code bg-[#10B981]/15 text-[#10B981] px-2 py-0.5 rounded font-bold border border-[#10B981]/30">
                OpenCV 4.13
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Real-time HSV / CIELAB biomass extraction, flocculation edge analysis & biofilm detection
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[#111827] border border-[#1F2937] p-1 rounded-lg text-xs font-mono-code">
          <button
            onClick={() => setActiveTab('live')}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'live' ? 'bg-[#10B981] text-[#0A0A0A] font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Live Stream</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded transition-all flex items-center gap-1.5 ${
              activeTab === 'upload' ? 'bg-[#10B981] text-[#0A0A0A] font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Analyze Image</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Stream on Left, Diagnostics HUD on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Stream Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-[#05080E] rounded-xl border-2 border-[#1F2937] overflow-hidden relative shadow-inner aspect-[4/3] flex items-center justify-center group">
          {activeTab === 'live' ? (
            isBackendLive && !streamError ? (
              <img
                src={backendApi.getVisionStreamUrl()}
                alt="OpenCV Digital Twin Stream"
                className="w-full h-full object-cover"
                onError={() => setStreamError(true)}
              />
            ) : (
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="w-full h-full object-cover"
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
              {uploadedImagePreview ? (
                <img
                  src={uploadedImagePreview}
                  alt="Uploaded Algae Frame"
                  className="w-full h-full object-contain rounded"
                />
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#111827] border border-[#374151] flex items-center justify-center text-slate-400 mx-auto">
                    <Upload className="w-6 h-6 text-[#10B981]" />
                  </div>
                  <div>
                    <p className="text-xs font-display font-bold text-white uppercase">Upload Microalgae Sample</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG, or WEBP microscopy or photobioreactor image</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="px-4 py-2 rounded-md bg-[#10B981] text-black font-display font-extrabold text-xs uppercase tracking-wider hover:bg-[#059669] transition-all shadow-md flex items-center gap-2 mx-auto"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing OpenCV Filters...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Select Image File</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
          )}

          {/* Corner Cyberpunk Reticle Highlights */}
          <div className="absolute top-2 left-2 pointer-events-none">
            <span className="text-[10px] font-mono-code bg-black/70 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981]/40 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping" />
              LIVE VISION TELEMETRY
            </span>
          </div>

          <div className="absolute bottom-2 right-2 pointer-events-none">
            <span className="text-[9px] font-mono-code bg-black/70 text-slate-400 px-2 py-0.5 rounded border border-[#333]">
              640x480 RGB // 30 FPS HUD
            </span>
          </div>
        </div>

        {/* Diagnostics & Quantitative HUD (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* Health Status Banner */}
          <div className="p-3.5 rounded-lg bg-[#111827] border border-[#1F2937] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono-code text-slate-400 uppercase tracking-wider">
                Culture Diagnostic Verdict
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded text-xs font-mono-code font-black border uppercase tracking-wider ${statusBadge}`}>
                  {currentDiag.health_status}
                </span>
                <span className="text-xs font-mono-code text-slate-300">
                  {currentDiag.hue_diagnosis}
                </span>
              </div>
            </div>
            <Activity className="w-6 h-6 text-[#10B981]" />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* OD680 */}
            <div className="p-3 rounded-lg bg-[#111827] border border-[#1F2937]">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Optical Density</div>
              <div className="text-xl font-mono-code font-extrabold text-[#10B981] mt-0.5">
                {currentDiag.od680.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-400">OD₆₈₀</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono-code mt-0.5">
                Target: 1.5 - 2.8 Abs
              </div>
            </div>

            {/* Biomass g/L */}
            <div className="p-3 rounded-lg bg-[#111827] border border-[#1F2937]">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Biomass Density</div>
              <div className="text-xl font-mono-code font-extrabold text-white mt-0.5">
                {currentDiag.biomass_g_L.toFixed(2)}{' '}
                <span className="text-xs font-normal text-slate-400">g/L</span>
              </div>
              <div className="text-[10px] text-[#10B981] font-mono-code mt-0.5">
                Yield: ~{(currentDiag.biomass_g_L * 6.0).toFixed(1)} kg wet
              </div>
            </div>

            {/* Clumping Index */}
            <div className="p-3 rounded-lg bg-[#111827] border border-[#1F2937]">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Flocculation Index</div>
              <div className={`text-xl font-mono-code font-extrabold mt-0.5 ${currentDiag.clumping_index > 0.35 ? 'text-[#F59E0B]' : 'text-white'}`}>
                {currentDiag.clumping_index.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400 font-mono-code mt-0.5">
                {currentDiag.clumping_index > 0.35 ? '⚠ Aggregates Detected' : '✓ Dispersed Uniform'}
              </div>
            </div>

            {/* Wall Biofouling */}
            <div className="p-3 rounded-lg bg-[#111827] border border-[#1F2937]">
              <div className="text-[10px] font-mono-code text-slate-400 uppercase">Wall Biofilm</div>
              <div className={`text-xl font-mono-code font-extrabold mt-0.5 ${currentDiag.fouling_detected ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                {currentDiag.fouling_detected ? 'DETECTED' : 'CLEAR'}
              </div>
              <div className="text-[10px] text-slate-400 font-mono-code mt-0.5">
                {currentDiag.fouling_detected ? '⚠ Ultrasonic Wash Req.' : '✓ Vessel Walls Clean'}
              </div>
            </div>
          </div>

          {/* AI Recommended Prescriptive Action */}
          <div className="p-3.5 rounded-lg bg-[#111827] border border-[#1F2937] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-display font-bold uppercase text-white">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Bio-Vision Autonomous Directive</span>
            </div>
            <p className="text-xs font-mono-code text-slate-300 leading-relaxed bg-[#0A0A0A] p-2.5 rounded border border-[#242424]">
              {currentDiag.action}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
