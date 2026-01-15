"use client";
import {
  Gamepad2,
  MessageCircle,
  Sparkles,
  Heart,
  Trophy,
  Users,
} from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Gamepad2,
      title: "Play Tic Tac Toe",
      description: "Start a game and get matched with someone special",
      color: "bg-blue-600",
    },
    {
      icon: MessageCircle,
      title: "Chat & Connect",
      description: "Use voice messages and chat while playing",
      color: "bg-purple-500",
    },
    {
      icon: Sparkles,
      title: "AI Assistance",
      description: "Get smart suggestions for perfect conversations",
      color: "bg-pink-500",
    },
    {
      icon: Heart,
      title: "Find Your Match",
      description: "Win the game and boost your compatibility score",
      color: "bg-red-500",
    },
  ];

  const stats = [
    {
      icon: Trophy,
      value: "10,000+",
      label: "Games Played",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      icon: Heart,
      value: "2,000+",
      label: "Happy Matches",
      color: "text-pink-500",
      bgColor: "bg-pink-50",
    },
    {
      icon: Users,
      value: "5,000+",
      label: "Active Players",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50/50">
      {/* --- HOW IT WORKS SECTION --- */}
      <div className="max-w-7xl mx-auto text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          How It Works
        </h2>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Connect with someone special in just a few simple steps. Our platform
          makes meeting new people fun and effortless.
        </p>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group bg-white rounded-[32px] p-8 flex flex-col items-start text-left shadow-xl shadow-gray-200/50 border border-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-out"
            >
              <div
                className={`${
                  step.color
                } p-4 rounded-2xl mb-6 shadow-lg shadow-${
                  step.color.split("-")[1]
                }-200 group-hover:scale-110 transition-transform`}
              >
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* --- STATS SECTION --- */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-[35px] p-8 flex flex-col items-center shadow-lg shadow-gray-200/40 border border-white hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`${stat.bgColor} p-4 rounded-full mb-4`}>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div
                className={`text-4xl md:text-5xl font-black ${stat.color} mb-2 tracking-tight`}
              >
                {stat.value}
              </div>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
