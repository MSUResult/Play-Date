"use client";

export default function SuccessStories() {
  const stories = [
    {
      name: "Sarah & Ahmed",
      testimonial:
        "Met through a game, now dating for 6 months! The AI suggestions helped me break the ice perfectly.",
      image:
        "https://images.unsplash.com/photo-1516589174184-c685265142ec?w=400&h=400&fit=crop",
      tag: "Dating 6 Months",
    },
    {
      name: "Rudra",
      testimonial:
        "This made dating fun again! No pressure, just genuine conversations while playing a simple game.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      tag: "Genuine Connections",
    },
    {
      name: "Pratiksha",
      testimonial:
        "The voice message feature is amazing! It's so much more personal than just text. Found my match here! ❤️",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      tag: "Found a Match",
    },
  ];

  return (
    <section className="py-12 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Success Stories
          </h2>
          <p className="text-gray-500 text-lg font-medium">
            Real people, real connections
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-white rounded-[32px] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center hover:translate-y-[-5px] transition-all duration-300"
            >
              {/* Profile Image - Rounded and not too big */}
              <div className="w-20 h-20 mb-6 relative">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-full object-cover rounded-full border-4 border-pink-50 shadow-sm"
                />
              </div>

              {/* Tag */}
              <span className="bg-pink-50 text-pink-600 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
                {story.tag}
              </span>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {story.name}
              </h3>
              <p className="text-gray-600 leading-relaxed italic">
                "{story.testimonial}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
