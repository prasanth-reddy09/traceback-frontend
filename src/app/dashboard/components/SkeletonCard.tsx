export default function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm animate-pulse">
      {/* Ghost Image Area */}
      <div className="w-full h-56 bg-slate-200" />
      
      <div className="p-6 space-y-5">
        <div className="space-y-3">
          {/* Ghost Title */}
          <div className="h-5 bg-slate-200 rounded-full w-3/4" />
          {/* Ghost Subtitle */}
          <div className="h-3 bg-slate-100 rounded-full w-1/2" />
        </div>

        {/* Ghost Badges */}
        <div className="flex gap-2 mt-4">
          <div className="h-8 bg-slate-50 rounded-xl w-24" />
          <div className="h-8 bg-slate-50 rounded-xl w-20" />
        </div>

        {/* Ghost Button */}
        <div className="h-12 bg-slate-100 rounded-2xl w-full mt-2" />
      </div>
    </div>
  );
}