import React, { useEffect, useRef, useState } from "react";
import { HAND_CONNECTIONS, Results, NormalizedLandmark } from "@mediapipe/hands";
import CircularParticles from "@/Component/Animation/CircularParticles";

declare global {
  interface Window {
    Hands: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
  }
}

interface IsActive {
  isVRActive: boolean;
}


function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

const VisualResponse: React.FC<IsActive> = ({ isVRActive }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [radiusFactor, setRadiusFactor] = useState(0.5);

  const getEuclidianDist = (
    canvasElement: HTMLCanvasElement,
    landmarks: NormalizedLandmark[]
  ) => {
    const w = canvasElement.width;
    const h = canvasElement.height;
    const wrist = landmarks[0];
    const fingerIndices = [4, 8, 12, 16, 20];

    const distances = fingerIndices.map((i) => {
      const f = landmarks[i];
      const dx = f.x * w - wrist.x * w;
      const dy = f.y * h - wrist.y * h;
      return Math.sqrt(dx * dx + dy * dy);
    });

    const avg = distances.reduce((a, b) => a + b, 0) / distances.length;
    return Math.min(1, avg / (w / 3));
  };

  useEffect(() => {
    if (!isVRActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let camera: any = null;
    let cancelled = false;

    const init = async () => {
      // 🚫 SSR / GH Pages safe camera check
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        console.warn("Camera not available");
        return;
      }

      try {
        // ✅ Load MediaPipe scripts ONLY when needed
        await Promise.all([
          loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js"),
          loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
          ),
          loadScript(
            "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js"
          ),
        ]);

        if (cancelled) return;

        const hands = new window.Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: Results) => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          if (results.image) {
            ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
          }

          const landmarks = results.multiHandLandmarks?.[0];
          if (landmarks) {
            window.drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
              color: "#00FF00",
              lineWidth: 5,
            });

            window.drawLandmarks(ctx, landmarks, {
              color: "#FF0000",
              lineWidth: 2,
            });

            setRadiusFactor(getEuclidianDist(canvas, landmarks));
          }
        });

        camera = new window.Camera(video, {
          width: 1280,
          height: 720,
          onFrame: async () => {
            try {
              await hands.send({ image: video });
            } catch (e) {
              console.error("Hands frame error", e);
            }
          },
        });

        camera.start();
      } catch (err) {
        console.error("MediaPipe init failed:", err);
      }
    };

    init();

    return () => {
      cancelled = true;
      camera?.stop?.();
    };
  }, [isVRActive]);

  if (!isVRActive) return null;

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <video ref={videoRef} style={{ display: "none" }} />
      <canvas ref={canvasRef} width={1280} height={720} style={{ display: "none" }} />
      <CircularParticles radiusFactor={radiusFactor} />
    </div>
  );
};

export default VisualResponse;
