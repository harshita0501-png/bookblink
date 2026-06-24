const statusConfig = {
  "Requested":       { color: "bg-blue-500/10 text-blue-400 border-blue-500/20",   dot: "bg-blue-400" },
  "Out for Delivery":{ color: "bg-amber-500/10 text-amber-400 border-amber-500/20", dot: "bg-amber-400" },
  "Delivered":       { color: "bg-green-500/10 text-green-400 border-green-500/20", dot: "bg-green-400" },
  "Returned":        { color: "bg-slate-500/10 text-slate-400 border-slate-500/20", dot: "bg-slate-400" },
};

export default function OrderCard({ order }) {
  const cfg = statusConfig[order.status] || statusConfig["Requested"];

  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-5 hover:border-slate-600 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-slate-400 text-xs font-mono">{order.id}</span>
            <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
              {order.status}
            </span>
          </div>
          <h3 className="text-white font-semibold text-sm">{order.bookTitle}</h3>
          <p className="text-slate-400 text-xs">{order.bookAuthor}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-3">
          <div className="text-amber-400 font-bold">₹{order.price}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-700/50 text-xs">
        <div>
          <span className="text-slate-500">Requested</span>
          <div className="text-slate-300">{order.requestDate}</div>
        </div>
        {order.deliveryDate && (
          <div>
            <span className="text-slate-500">Delivered</span>
            <div className="text-slate-300">{order.deliveryDate}</div>
          </div>
        )}
        <div>
          <span className="text-slate-500">Address</span>
          <div className="text-slate-300">{order.address}</div>
        </div>
        <div>
          <span className="text-slate-500">Slot</span>
          <div className="text-slate-300">{order.deliverySlot}</div>
        </div>
      </div>
    </div>
  );
}
