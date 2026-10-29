import React, { useEffect, useRef, useState } from 'react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'BRAND' | 'ENGINE' | 'THREAT' | 'COUNTERMEASURE';
  status: 'HEALTHY' | 'ATTACKED' | 'PROTECTED';
  health: number;
}

interface Edge {
  source: string;
  target: string;
  active: boolean;
  threatLevel: number;
}

export const NodeGraphCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  const nodesRef = useRef<Node[]>([
    { id: 'brand', label: 'BRAND GROUND TRUTH', x: 0.5, y: 0.5, vx: 0, vy: 0, radius: 24, type: 'BRAND', status: 'PROTECTED', health: 100 },
    { id: 'gpt4', label: 'ChatGPT (GPT-4o)', x: 0.28, y: 0.32, vx: 0.0003, vy: -0.0002, radius: 16, type: 'ENGINE', status: 'HEALTHY', health: 96 },
    { id: 'claude', label: 'Claude 3.5 Sonnet', x: 0.72, y: 0.35, vx: -0.0002, vy: 0.0003, radius: 16, type: 'ENGINE', status: 'HEALTHY', health: 98 },
    { id: 'pplx', label: 'Perplexity AI (RAG)', x: 0.25, y: 0.68, vx: 0.0004, vy: 0.0001, radius: 16, type: 'ENGINE', status: 'ATTACKED', health: 74 },
    { id: 'goog', label: 'Google AI Overviews', x: 0.75, y: 0.65, vx: -0.0003, vy: -0.0003, radius: 16, type: 'ENGINE', status: 'PROTECTED', health: 92 },
    { id: 'copilot', label: 'MS Copilot RAG', x: 0.48, y: 0.22, vx: 0.0001, vy: 0.0004, radius: 14, type: 'ENGINE', status: 'HEALTHY', health: 90 },
    { id: 'threat1', label: 'Injected RAG Snippet', x: 0.15, y: 0.78, vx: -0.0002, vy: -0.0003, radius: 10, type: 'THREAT', status: 'ATTACKED', health: 20 },
    { id: 'counter1', label: 'Last Crusade Defense Counter-Vector', x: 0.35, y: 0.62, vx: 0.0002, vy: -0.0002, radius: 12, type: 'COUNTERMEASURE', status: 'PROTECTED', health: 100 }
  ]);

  const edgesRef = useRef<Edge[]>([
    { source: 'brand', target: 'gpt4', active: true, threatLevel: 0 },
    { source: 'brand', target: 'claude', active: true, threatLevel: 0 },
    { source: 'brand', target: 'pplx', active: true, threatLevel: 0.6 },
    { source: 'brand', target: 'goog', active: true, threatLevel: 0.1 },
    { source: 'brand', target: 'copilot', active: true, threatLevel: 0 },
    { source: 'threat1', target: 'pplx', active: true, threatLevel: 0.9 },
    { source: 'counter1', target: 'pplx', active: true, threatLevel: 0 },
    { source: 'counter1', target: 'threat1', active: true, threatLevel: 0 }
  ]);

  const mousePosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const handleResize = () => {
      if (!canvas) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      mousePosRef.current = { x: mouseX, y: mouseY };

      const w = rect.width;
      const h = rect.height;
      let found: Node | null = null;

      for (const node of nodesRef.current) {
        const nx = node.x * w;
        const ny = node.y * h;
        const dist = Math.hypot(nx - mouseX, ny - mouseY);
        if (dist < node.radius + 10) {
          found = node;
          break;
        }
      }
      setHoveredNode(found);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      if (!canvas || !ctx) return;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Draw Background Radar Grid
      const cx = w * 0.5;
      const cy = h * 0.5;
      const maxRadius = Math.min(w, h) * 0.42;

      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(65, 2, 23, 0.08)';

      for (let r = 0.2; r <= 1.0; r += 0.25) {
        ctx.beginPath();
        ctx.arc(cx, cy, maxRadius * r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Radar Crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();

      // Rotating Sweep
      angle += 0.008;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      const sweepGrad = ctx.createConicGradient(0, 0, 0);
      sweepGrad.addColorStop(0, 'rgba(213, 153, 28, 0.22)');
      sweepGrad.addColorStop(0.12, 'rgba(213, 153, 28, 0.03)');
      sweepGrad.addColorStop(0.25, 'transparent');
      sweepGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sweepGrad;
      ctx.beginPath();
      ctx.arc(0, 0, maxRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Update Node Positions subtly
      nodesRef.current.forEach((node) => {
        if (node.type !== 'BRAND') {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0.15 || node.x > 0.85) node.vx *= -1;
          if (node.y < 0.15 || node.y > 0.85) node.vy *= -1;
        }
      });

      // 2. Draw Edges
      edgesRef.current.forEach((edge) => {
        const sNode = nodesRef.current.find((n) => n.id === edge.source);
        const tNode = nodesRef.current.find((n) => n.id === edge.target);
        if (!sNode || !tNode) return;

        const sx = sNode.x * w;
        const sy = sNode.y * h;
        const tx = tNode.x * w;
        const ty = tNode.y * h;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(tx, ty);

        if (edge.threatLevel > 0.5) {
          ctx.strokeStyle = 'rgba(139, 30, 30, 0.7)';
          ctx.setLineDash([4, 4]);
        } else if (sNode.type === 'COUNTERMEASURE' || tNode.type === 'COUNTERMEASURE') {
          ctx.strokeStyle = 'rgba(213, 153, 28, 0.8)';
          ctx.setLineDash([6, 3]);
        } else {
          ctx.strokeStyle = 'rgba(65, 2, 23, 0.25)';
          ctx.setLineDash([]);
        }
        ctx.lineWidth = edge.threatLevel > 0.5 ? 2 : 1.5;
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated Signal Pulses along edge
        const pulseTime = (Date.now() / 1500 + (sNode.radius % 5)) % 1;
        const px = sx + (tx - sx) * pulseTime;
        const py = sy + (ty - sy) * pulseTime;

        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = edge.threatLevel > 0.5 ? '#8B1E1E' : sNode.type === 'COUNTERMEASURE' ? '#D5991C' : '#410217';
        ctx.fill();
      });

      // 3. Draw Nodes
      nodesRef.current.forEach((node) => {
        const nx = node.x * w;
        const ny = node.y * h;
        const isHovered = hoveredNode?.id === node.id;

        // Outer Glow
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius + (isHovered ? 12 : 6), 0, Math.PI * 2);

        if (node.type === 'BRAND') {
          ctx.fillStyle = 'rgba(65, 2, 23, 0.15)';
        } else if (node.type === 'THREAT') {
          ctx.fillStyle = 'rgba(139, 30, 30, 0.2)';
        } else if (node.type === 'COUNTERMEASURE') {
          ctx.fillStyle = 'rgba(213, 153, 28, 0.25)';
        } else {
          ctx.fillStyle = node.status === 'ATTACKED' ? 'rgba(213, 153, 28, 0.2)' : 'rgba(65, 2, 23, 0.08)';
        }
        ctx.fill();

        // Node Body
        ctx.beginPath();
        ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);

        if (node.type === 'BRAND') {
          ctx.fillStyle = '#410217';
          ctx.strokeStyle = '#D5991C';
        } else if (node.type === 'THREAT') {
          ctx.fillStyle = '#8B1E1E';
          ctx.strokeStyle = '#F2D69D';
        } else if (node.type === 'COUNTERMEASURE') {
          ctx.fillStyle = '#D5991C';
          ctx.strokeStyle = '#410217';
        } else {
          ctx.fillStyle = node.status === 'ATTACKED' ? '#D5991C' : '#FAF2E1';
          ctx.strokeStyle = '#410217';
        }
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Label
        ctx.font = node.type === 'BRAND' ? 'bold 12px "Newsreader", Georgia, serif' : '600 11px "JetBrains Mono"';
        ctx.fillStyle = '#410217';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, nx, ny + node.radius + 18);

        // Status badge
        if (node.type === 'ENGINE') {
          ctx.font = '600 9px "JetBrains Mono"';
          ctx.fillStyle = node.status === 'ATTACKED' ? '#8B1E1E' : '#2E7D32';
          ctx.fillText(`${node.health}% Health`, nx, ny - node.radius - 8);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [hoveredNode]);

  return (
    <div className="relative w-full h-[420px] md:h-[500px] bg-[#FFFDF8] overflow-hidden border border-[#F2D69D] shadow-xs">
      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

      {/* Overlay HUD Badges */}
      <div className="absolute top-4 left-4 flex items-center space-x-3 bg-[#FAF2E1] px-3 py-1.5 border border-[#F2D69D] font-mono text-xs text-[#410217]">
        <span className="w-2 h-2 rounded-full bg-[#D5991C] animate-ping" />
        <span className="text-[#410217]/60">VECTOR SPACE SCANNER:</span>
        <span className="text-[#410217] font-bold">15/15 ENGINES LIVE</span>
      </div>

      <div className="absolute top-4 right-4 flex items-center space-x-2 bg-[#FAF2E1] px-3 py-1.5 border border-[#F2D69D] font-mono text-xs">
        <span className="text-[#410217]/60">RADAR FREQ:</span>
        <span className="text-[#410217] font-bold">8.4 GHz</span>
      </div>

      {/* Node Hover Inspector */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-md bg-[#FAF2E1] p-4 border border-[#410217] shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F2D69D]">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-[#410217]">
              <span className={`w-2.5 h-2.5 rounded-full ${hoveredNode.type === 'THREAT' ? 'bg-[#8B1E1E]' : hoveredNode.type === 'COUNTERMEASURE' ? 'bg-[#D5991C]' : 'bg-[#410217]'}`} />
              <span>{hoveredNode.label}</span>
            </div>
            <span className="font-mono text-[10px] text-[#410217]/70 uppercase">{hoveredNode.type}</span>
          </div>
          <p className="text-xs text-[#410217]/80 leading-relaxed font-sans">
            {hoveredNode.type === 'BRAND' && 'Central verified knowledge graph entity anchor. Cryptographically validated.'}
            {hoveredNode.type === 'ENGINE' && `Generative engine citation pipeline. Current vector integrity score: ${hoveredNode.health}/100.`}
            {hoveredNode.type === 'THREAT' && 'Adversarial indirect prompt injection attempt detected targeting RAG context.'}
            {hoveredNode.type === 'COUNTERMEASURE' && 'Last Crusade Defense Counter-AEO vector override active. Suppressing hallucinated outputs.'}
          </p>
        </div>
      )}

      {/* Legend Footer */}
      <div className="absolute bottom-4 right-4 hidden md:flex items-center space-x-4 bg-[#FAF2E1] px-3 py-1.5 border border-[#F2D69D] font-mono text-[11px] text-[#410217]/80">
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#410217]" />
          <span>Verified Brand</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D5991C]" />
          <span>Attacked Engine</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B1E1E]" />
          <span>Adversarial Threat</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D5991C]" />
          <span>Countermeasure</span>
        </div>
      </div>
    </div>
  );
};
