'use client';

export default function BuddyPage() {
  return (
    <div className="h-screen w-screen flex flex-col -m-4 md:-m-6 lg:-m-8">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0 p-4 bg-white border-b border-gray-200">
        <h1 className="text-xl md:text-2xl font-bold text-slate-800">AI Tutor - Buddy</h1>
      </div>
      
      {/* Iframe Container - Takes remaining space and full width */}
      <div className="flex-1 w-full overflow-hidden">
        <iframe
          src="http://localhost:5000"
          title="AI Tutor"
          allow="camera; microphone; autoplay; clipboard-read; clipboard-write; fullscreen"
          style={{
            width: "100vw",
            height: "100%",
            border: "none",
            backgroundColor: "#000",
            margin: 0,
            padding: 0,
          }}
          className="w-screen h-full block"
        />
      </div>
    </div>
  );
}

