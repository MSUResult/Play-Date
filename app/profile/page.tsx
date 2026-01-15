"use client";
import { useState, useEffect } from "react";
import {
  Camera,
  User,
  MapPin,
  Globe,
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    country: "India",
    district: "",
    photo: null as string | null,
  });

  const indianCities = [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Ahmedabad",
    "Chennai",
    "Kolkata",
    "Surat",
    "Pune",
    "Saharanpur",
    "Jaipur",
  ];

  // --- 1. PERFORMANCE LOGGED IMAGE COMPRESSION ---
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.time("⏱️ ImageProcessing");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setProfile({ ...profile, photo: compressedBase64 });

        console.timeEnd("⏱️ ImageProcessing");
        console.log("📸 Image successfully compressed to Base64");
      };
    };
  };

  // --- 2. FAST AUTO-SUGGEST ---
  const handleDistrictChange = (val: string) => {
    setProfile({ ...profile, district: val });
    if (profile.country === "India" && val.length > 1) {
      const matches = indianCities.filter((c) =>
        c.toLowerCase().includes(val.toLowerCase())
      );
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  // --- 3. SUBMIT TO BACKEND ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("📤 Submitting profile data...", profile);
    setIsSubmitting(true);
    console.time("🚀 API_Response_Time");

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        console.log("🎉 Signup Success!");
        window.location.reload(); // Refresh to let Context pick up the new user
      } else {
        const errorData = await response.json();
        console.error("❌ API Error:", errorData.error);
        alert("Signup failed: " + errorData.error);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
    } finally {
      console.timeEnd("🚀 API_Response_Time");
      setIsSubmitting(false);
    }
  };

  // --- 4. VIEW LOGIC ---
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center font-bold text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Initializing Tictak...
      </div>
    );
  }

  // If user exists, show the "View Profile" state instead of the form
  if (user) {
    return (
      <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4">
        <div className="bg-white rounded-[40px] shadow-2xl p-10 text-center max-w-md w-full border border-white">
          <div className="w-24 h-24 rounded-[30px] mx-auto mb-4 border-4 border-pink-100 overflow-hidden shadow-lg">
            <img
              src={(user as any).photo || "https://via.placeholder.com/150"}
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            Welcome, {(user as any).name}!
          </h2>
          <p className="text-gray-500 mb-6">You are now part of the club.</p>
          <div className="bg-green-50 text-green-600 p-4 rounded-2xl font-bold flex items-center justify-center gap-2">
            <CheckCircle2 size={20} /> Profile Completed
          </div>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="mt-6 text-pink-500 font-bold hover:underline"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] py-8 px-4 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-black text-gray-900">
            Join the <span className="text-pink-500">Club</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Create your profile in 30 seconds
          </p>
        </div>

        <div className="bg-white rounded-[40px] shadow-2xl p-6 md:p-10 border border-white">
          <form onSubmit={handleSignup} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* Image Uploader */}
              <div className="shrink-0">
                <label className="relative cursor-pointer group block">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-[35px] overflow-hidden border-4 border-pink-50 group-hover:border-pink-200 transition-all shadow-xl flex items-center justify-center bg-gray-50">
                    {profile.photo ? (
                      <img
                        src={profile.photo}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <User className="w-12 h-12 text-gray-300 mx-auto" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase">
                          Add Photo
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-pink-500 to-violet-600 p-3 rounded-2xl shadow-lg text-white">
                    <Camera className="w-5 h-5" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Grid for basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                  <input
                    required
                    type="text"
                    placeholder="Full Name"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none transition-all font-medium"
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                  <input
                    required
                    type="email"
                    placeholder="Email Address"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none transition-all font-medium"
                    value={profile.email}
                    onChange={(e) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                  <input
                    type="tel"
                    placeholder="Phone (Optional)"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none transition-all font-medium"
                    value={profile.phone}
                    onChange={(e) =>
                      setProfile({ ...profile, phone: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-pink-400">
                    #
                  </span>
                  <input
                    required
                    type="number"
                    placeholder="Age"
                    min="18"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none transition-all font-medium"
                    value={profile.age}
                    onChange={(e) =>
                      setProfile({ ...profile, age: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                <select
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none transition-all font-medium appearance-none"
                  value={profile.country}
                  onChange={(e) =>
                    setProfile({ ...profile, country: e.target.value })
                  }
                >
                  <option value="India">India</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="USA">USA</option>
                </select>
              </div>

              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
                <input
                  required
                  type="text"
                  placeholder="District / City"
                  className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-400 outline-none transition-all font-medium"
                  value={profile.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                />
                {suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-40 overflow-y-auto">
                    {suggestions.map((city) => (
                      <button
                        key={city}
                        type="button"
                        className="w-full text-left px-5 py-3 hover:bg-pink-50 text-sm font-bold text-gray-700"
                        onClick={() => {
                          setProfile({ ...profile, district: city });
                          setSuggestions([]);
                        }}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              disabled={isSubmitting}
              type="submit"
              className="w-full h-16 rounded-[24px] bg-gradient-to-r from-pink-500 to-violet-600 text-white font-black text-lg shadow-xl shadow-pink-200 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                "Complete Signup"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
    