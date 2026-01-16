"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function VoiceHandler({ status, onPermissionError }: any) {
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startMic = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stream is now active for the duration of the component lifecycle
      } catch (err) {
        toast.error("Mic Error", { description: "Voice chat disconnected." });
        onPermissionError();
      }
    };

    startMic();

    // Clean up: This stops the mic ONLY when the user leaves the page
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="fixed top-6 right-6 z-50 pointer-events-none">
      <div className="flex items-center gap-2 bg-[#10B981]/20 border border-[#10B981]/30 px-3 py-1.5 rounded-full backdrop-blur-md">
        <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
        <span className="text-[10px] font-black text-[#10B981] tracking-widest uppercase">
          Live Voice
        </span>
      </div>
    </div>
  );
}
