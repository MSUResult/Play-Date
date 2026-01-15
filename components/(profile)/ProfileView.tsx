"use client";

import { useState, useRef } from "react";
import { Edit3, Mic, ShieldCheck, MapPin } from "lucide-react";
import { toast } from "sonner";

export default function ProfileView({ user }: { user: any }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.current.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () =>
          handleUpdate({ voiceIntro: reader.result as string });
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      toast.info("Recording intro... (10s max)");
      setTimeout(() => stopRecording(), 10000);
    } catch (err) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleUpdate = async (data: any) => {
    setIsUpdating(true);
    try {
      const res = await fetch("/api/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Profile updated!");
        window.location.reload();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 pt-10">
      <div className="w-full max-w-md bg-white rounded-[40px] shadow-2xl border border-white overflow-hidden">
        <div className="h-32 bg-gradient-to-tr from-indigo-600 via-pink-500 to-orange-400 relative">
          <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
            <Edit3 size={18} />
          </button>
        </div>

        <div className="px-8 pb-10">
          <div className="relative -mt-16 flex justify-center">
            <div className="relative">
              <img
                src={user.photo || "/placeholder-user.png"}
                className="w-32 h-32 rounded-[35px] object-cover border-4 border-white shadow-xl"
                alt="Profile"
              />
              {user.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-full border-4 border-white">
                  <ShieldCheck size={20} fill="currentColor" />
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <h2 className="text-3xl font-black text-slate-800">
              {user.name}, {user.age}
            </h2>
            <div className="flex items-center justify-center gap-1 text-slate-400 font-bold text-sm uppercase">
              <MapPin size={14} /> {user.district}, {user.country}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              className={`w-full h-16 rounded-2xl flex items-center justify-center gap-3 font-black transition-all shadow-lg ${
                isRecording
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-slate-900 text-white"
              }`}
            >
              <Mic size={22} />
              {isRecording ? "Listening..." : "Hold to Record Intro"}
            </button>

            <div className="grid grid-cols-2 gap-4">
              <label className="h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center gap-2 font-black cursor-pointer">
                <ShieldCheck size={20} /> Verify
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) =>
                        handleUpdate({ aadhaarCard: ev.target?.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <button className="h-16 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center gap-2 font-black">
                <Edit3 size={20} /> Details
              </button>
            </div>
          </div>

          {!user.isVerified && (
            <p className="mt-6 text-[10px] text-slate-400 font-medium text-center">
              Upload Aadhaar to get your{" "}
              <span className="text-blue-500 font-bold">Verified Badge</span>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
