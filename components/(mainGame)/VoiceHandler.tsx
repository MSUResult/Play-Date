"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceHandlerProps {
  status: "idle" | "listening" | "speaking" | "live";
  onPermissionError: () => void;
}

export default function VoiceHandler({
  status,
  onPermissionError,
}: VoiceHandlerProps) {
  useEffect(() => {
    const requestMic = async () => {
      try {
        // Keep the stream active in the background
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        toast.error("Mic Connection Failed", {
          description: "Enable mic for the live experience.",
        });
        onPermissionError();
      }
    };
    requestMic();
  }, [onPermissionError]);

  if (status === "idle") return null;

  return (
    <div className="flex flex-col items-center justify-center pointer-events-none">
      {status === "listening" && (
        <div className="bg-pink-500 p-1.5 rounded-full animate-pulse shadow-lg">
          <Mic className="text-white w-3 h-3" />
        </div>
      )}

      {status === "speaking" && (
        <div className="flex gap-0.5 items-center h-4 bg-blue-500/20 px-2 rounded-full border border-blue-500/30">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={{ height: ["20%", "80%", "20%"] }}
              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
              className="w-1 bg-blue-500 rounded-full"
            />
          ))}
        </div>
      )}
    </div>
  );
}
