import React, { useEffect, useRef, useState } from "react";
import { Hands, HAND_CONNECTIONS, Results, NormalizedLandmark } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
 import CircularParticles from "@/Component/Animation/CircularParticles";

interface IsActive {
  isVRActive: boolean;
}

const index: React.FC<IsActive> = ({ isVRActive }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [radiusFactor, setRadiusFactor] = useState(0.5); 

  const getEuclidianDist = (canvasElement: HTMLCanvasElement, landmarks: NormalizedLandmark[]) => {
    const canvasWidth = canvasElement.width;
    const canvasHeight = canvasElement.height;
    const wrist = landmarks[0];
    const fingerIndices = [4, 8, 12, 16, 20]; // Thumb, Index, Middle, Ring, Pinky
    const distances: number[] = [];

    fingerIndices.forEach((i) => {
      const finger = landmarks[i];
      const dx = finger.x * canvasWidth - wrist.x * canvasWidth;
      const dy = finger.y * canvasHeight - wrist.y * canvasHeight;
      distances.push(Math.sqrt(dx * dx + dy * dy));
    });

    const averageDistance = distances.reduce((sum, d) => sum + d, 0) / fingerIndices.length;

    const maxDistance = canvasWidth / 3; 
    const normalized = Math.min(1, averageDistance / maxDistance);

    return normalized;
  };

  useEffect(() => {
    if (!isVRActive) return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!videoElement || !canvasElement) return;

    const ctx = canvasElement.getContext("2d");
    if (!ctx) return;

    const onResults = (results: Results) => {
      ctx.save();
      ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      if (results.image) {
        ctx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
      }

      const handLandmarks: NormalizedLandmark[] | undefined = results.multiHandLandmarks?.[0];

      if (handLandmarks) {
        drawConnectors(ctx, handLandmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 5 });
        drawLandmarks(ctx, handLandmarks, { color: "#FF0000", lineWidth: 2 });

        // calculate radius factor and update state
        const factor = getEuclidianDist(canvasElement, handLandmarks);
        setRadiusFactor(factor);
      }

      ctx.restore();
    };

    const hands = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults(onResults);

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({ image: videoElement });
      },
      width: 1280,
      height: 720,
    });

    camera.start();

    return () => {
      if (camera.stop) camera.stop();
    };
  }, [isVRActive]);

  if (!isVRActive) return null;

  return (
    <div className={`w-full h-full flex items-center justify-center`} >
      <video ref={videoRef} className="w-full h-full input_video" style={{ display: "none" }}></video>
      <canvas ref={canvasRef} className="w-full h-full output_canvas" width={1280} height={720} style={{ display: "none" }}></canvas>

       <CircularParticles radiusFactor={radiusFactor} /> 
    </div>
  );
};

export default index;
