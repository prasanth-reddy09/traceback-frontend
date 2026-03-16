import { MapPin, Tag, Calendar } from "lucide-react";

export function ItemInfo({ item }: { item: any }) {
  return (
    <div className="lg:col-span-5 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Image Display */}
        <div className="w-full h-72 bg-gray-100 relative">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">No image available</div>
          )}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${
              item.status === "UNCLAIMED" ? "bg-blue-600 text-white" : "bg-emerald-500 text-white"
            }`}>
              {item.status}
            </span>
          </div>
        </div>

        {/* Text Content */}
        <div className="p-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-100">
              <Tag className="w-3.5 h-3.5 text-gray-400" />
              {item.category}
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-100">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">{item.title}</h1>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">{item.description}</p>
            </div>

            <div className="flex items-start gap-3 bg-blue-50/30 p-4 rounded-xl border border-blue-100/50">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-0.5">Location</h3>
                <p className="text-gray-900 font-bold text-sm">{item.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}