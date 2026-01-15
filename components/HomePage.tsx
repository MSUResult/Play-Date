"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"; // Import your hook

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth(); // Get the logged-in user data

  return (
    <main className="min-h-screen bg-[rgb(253,242,248)] px-4 py-10 md:py-20 font-sans">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex justify-center gap-2 mb-4">
          <span className="text-pink-500 text-2xl">❤️</span>
          <span className="text-purple-400 text-2xl">✨</span>
        </div>

        {/* Gradient Heading */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent leading-tight">
          Tic Tac Toe – A Fun Dating Experience
        </h1>

        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
          Why <span className="font-bold text-pink-500">swipe</span> when you
          can play ? Connect through the world's favourite quick game
        </p>
      </div>

      {/* Main Feature Section: Responsive Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Left Photo - UPDATED TO SHOW LOGGED IN USER */}
        <div className="order-2 md:order-1 flex justify-center">
          <div className="relative w-full max-w-[300px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl bg-white">
            <Image
              // If user is logged in and has a photo, show it. Otherwise show default.
              src={user?.photo ? user.photo : "/downloade.png"}
              alt={user?.name || "User"}
              fill
              className="object-cover"
              priority // Added priority to load the user's face fast
            />
            {/* Optional: Small "You" badge if logged in */}
            {user && (
              <div className="absolute bottom-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30 text-white text-xs font-bold">
                Logged in as {user.name}
              </div>
            )}
          </div>
        </div>

        {/* Center Game Board */}
        <div className="order-1 md:order-2 flex flex-col items-center">
          <div className="bg-white p-6 rounded-[40px] shadow-2xl border-8 border-white w-full max-w-[280px]">
            {/* Tic Tac Toe Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { val: "X", color: "text-blue-500" },
                { val: "", color: "" },
                { val: "O", color: "text-pink-500" },
                { val: "", color: "" },
                { val: "X", color: "text-blue-500" },
                { val: "", color: "" },
                { val: "O", color: "text-pink-500" },
                { val: "", color: "" },
                { val: "X", color: "text-blue-500" },
              ].map((cell, i) => (
                <div
                  key={i}
                  className="aspect-square border-2 border-gray-100 rounded-xl flex items-center justify-center text-3xl font-bold bg-gray-50/50"
                >
                  <span className={cell.color}>{cell.val}</span>
                </div>
              ))}
            </div>

            {/* Start Button */}
            <button
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-blue-500 text-white font-bold text-lg hover:opacity-90 transition-opacity"
              onClick={() => router.push("/play")}
            >
              Start Playing
            </button>
          </div>
        </div>

        {/* Right Photo */}
        <div className="order-3 flex justify-center">
          <div className="relative w-full max-w-[300px] aspect-[4/5] rounded-3xl overflow-hidden shadow-xl">
            <Image
              src="/downloadm.png"
              alt="User"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
