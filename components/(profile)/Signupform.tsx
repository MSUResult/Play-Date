"use client";

import { useState } from "react";
import {
  Camera,
  User,
  MapPin,
  Globe,
  Mail,
  Phone,
  Loader2,
  ShieldCheck,
  FileText,
} from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export default function SignupPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateSuggestions, setStateSuggestions] = useState<string[]>([]);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    country: "India",
    state: "",
    district: "",
    photo: null as string | null,
    aadhaarCard: null as string | null,
  });

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "photo" | "aadhaarCard"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setProfile((prev) => ({
        ...prev,
        [field]: event.target?.result as string,
      }));
    };
  };

  const handleStateChange = (val: string) => {
    setProfile({ ...profile, state: val });
    if (val.length > 0) {
      const filtered = INDIAN_STATES.filter((s) =>
        s.toLowerCase().startsWith(val.toLowerCase())
      );
      setStateSuggestions(filtered);
    } else {
      setStateSuggestions([]);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (response.ok) window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable input class for dark text and visible placeholders
  const inputClasses =
    "w-full h-12 px-4 rounded-xl bg-gray-50 border-none outline-pink-400 text-gray-900 placeholder-gray-400";

  return (
    <div className="min-h-screen bg-slate-50 py-6 px-4 flex flex-col items-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900">
            Join the <span className="text-pink-500">Club</span>
          </h1>
          <p className="text-gray-500 text-sm">Be real, get matched.</p>
        </div>

        <form
          onSubmit={handleSignup}
          className="space-y-4 bg-white p-6 rounded-[32px] shadow-xl border border-gray-100"
        >
          {/* Avatar Upload */}
          <div className="flex justify-center mb-4">
            <label className="relative cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-pink-100 bg-gray-50 flex items-center justify-center">
                {profile.photo ? (
                  <img
                    src={profile.photo}
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-pink-500 p-2 rounded-full text-white shadow-lg">
                <Camera size={16} />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "photo")}
                className="hidden"
                required
              />
            </label>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <input
              required
              placeholder="Full Name"
              className={inputClasses}
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <input
              required
              type="email"
              placeholder="Email"
              className={inputClasses}
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
            />
            <div className="flex gap-2">
              <input
                placeholder="Phone"
                className={`${inputClasses} w-2/3`}
                value={profile.phone}
                onChange={(e) =>
                  setProfile({ ...profile, phone: e.target.value })
                }
              />
              <input
                required
                type="number"
                placeholder="Age"
                className={`${inputClasses} w-1/3`}
                value={profile.age}
                onChange={(e) =>
                  setProfile({ ...profile, age: e.target.value })
                }
              />
            </div>

            {/* Country & State */}
            <div className="grid grid-cols-2 gap-2">
              <select
                className="h-12 px-3 rounded-xl bg-gray-50 text-gray-900 text-sm"
                value={profile.country}
                onChange={(e) =>
                  setProfile({ ...profile, country: e.target.value })
                }
              >
                <option value="India">India</option>
              </select>
              <div className="relative">
                <input
                  required
                  placeholder="State"
                  className={inputClasses}
                  value={profile.state}
                  onChange={(e) => handleStateChange(e.target.value)}
                />
                {stateSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-40 overflow-auto">
                    {stateSuggestions.map((s) => (
                      <div
                        key={s}
                        className="p-2 hover:bg-pink-50 cursor-pointer text-sm text-gray-900"
                        onClick={() => {
                          setProfile({ ...profile, state: s });
                          setStateSuggestions([]);
                        }}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <input
              placeholder="District (Optional)"
              className={inputClasses}
              value={profile.district}
              onChange={(e) =>
                setProfile({ ...profile, district: e.target.value })
              }
            />

            {/* Aadhaar Section */}
            <div className="mt-2 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-[11px] text-blue-800 mb-3">
                <b className="text-blue-900">
                  Aadhaar card is optional to upload
                </b>{" "}
                but after this you can see the authenticated match and you are
                also authenticated. This can enhance your dating experience.
              </p>
              <label className="flex items-center justify-center gap-2 w-full h-12 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors">
                <FileText size={18} className="text-blue-600" />
                <span className="text-sm font-bold text-blue-700">
                  {profile.aadhaarCard
                    ? "Aadhaar Added ✅"
                    : "Upload Aadhaar (Optional)"}
                </span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e, "aadhaarCard")}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className={`w-full h-14 mt-4 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:shadow-pink-200"
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Creating Profile...</span>
              </>
            ) : (
              "Start Matching"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
