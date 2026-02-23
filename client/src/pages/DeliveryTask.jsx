import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api from "../services/api";
import { Truck, MapPin, Navigation, User, Banknote, ShieldCheck, Power, PowerOff } from "lucide-react";

const DeliveryTask = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data: userData } = useQuery({
    queryKey: ["users", "me"],
    queryFn: () => api.get("/users/me").then((res) => res.data),
  });

  const isOnline = userData?.isOnline ?? false;

  const { data: task } = useQuery({
    queryKey: ["delivery", "currentTask"],
    queryFn: async () => {
      const res = await api.get("/orders/my-task");
      if (res.data.msg) return null;
      return res.data;
    },
    enabled: isOnline,
    refetchInterval: 15000,
  });

  const handleToggleDuty = async () => {
    try {
      await api.put("/users/toggle-duty");
      queryClient.invalidateQueries(["users", "me"]);
      queryClient.invalidateQueries(["delivery", "currentTask"]);
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  const handleComplete = async () => {
    setError("");
    setMessage("");
    try {
      await api.post("/orders/verify-delivery", { orderId: task._id, otp });
      setMessage("Delivery Verified! Available for new orders.");
      queryClient.invalidateQueries(["delivery", "currentTask"]);
      setOtp("");
    } catch (err) {
      setError("Invalid OTP! Try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fade-in min-h-[calc(100vh-5rem)] flex flex-col">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4 shadow-inner">
          <Truck size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Delivery Partner</h1>
        <p className="text-gray-500 mt-1">Manage your active deliveries</p>
      </div>

      <div className="glass rounded-3xl p-6 shadow-xl border border-white/50 mb-6 relative overflow-hidden flex-1">
        <div className={`absolute inset-x-0 top-0 h-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>

        <div className="flex items-center justify-between mb-6 pt-2">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</p>
            <p className={`text-xl font-bold flex items-center ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              <span className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
              {isOnline ? "Online & Ready" : "Offline"}
            </p>
          </div>

          <button
            onClick={handleToggleDuty}
            className={`flex items-center justify-center w-14 h-14 rounded-2xl text-white transition-all transform active:scale-95 shadow-md ${isOnline
                ? "bg-gradient-to-br from-red-500 to-rose-600 hover:shadow-red-500/25"
                : "bg-gradient-to-br from-green-500 to-emerald-600 hover:shadow-green-500/25"
              }`}
            title={isOnline ? "Go Offline" : "Go Online"}
          >
            {isOnline ? <PowerOff size={24} /> : <Power size={24} />}
          </button>
        </div>

        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 text-sm font-medium text-center animate-fade-in flex items-center justify-center">
            <ShieldCheck className="mr-2 h-5 w-5" />
            {message}
          </div>
        )}

        <hr className="border-gray-100 my-6" />

        {!isOnline ? (
          <div className="text-center py-8">
            <PowerOff size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">You are currently offline.</p>
            <p className="text-sm text-gray-400 mt-1">Go online to start receiving orders.</p>
          </div>
        ) : !task ? (
          <div className="text-center py-10 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-primary-100 rounded-full animate-ping opacity-20"></div>
            </div>
            <Truck size={48} className="mx-auto text-primary-300 mb-4 relative z-10 animate-bounce" />
            <p className="text-primary-600 font-bold text-lg relative z-10">Waiting for orders...</p>
            <p className="text-sm text-gray-500 mt-1 relative z-10">Keep the app open to receive tasks</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-orange-200 overflow-hidden shadow-sm animate-slide-up">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 py-3 px-5 text-white flex justify-between items-center">
              <h3 className="font-bold flex items-center">
                <Navigation size={18} className="mr-2" />
                New Task Assigned!
              </h3>
              <span className="bg-white/20 px-2 py-1 rounded text-xs font-bold font-mono">#{task._id.slice(-5)}</span>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start">
                <User size={18} className="text-gray-400 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Customer</p>
                  <p className="font-semibold text-gray-900">{task.customer?.name}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin size={18} className="text-red-400 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Delivery Address</p>
                  <p className="font-medium text-gray-900 leading-tight">{task?.address}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Banknote size={18} className="text-green-500 mr-3 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium tracking-wider uppercase">Amount to Collect (COD)</p>
                  <p className="text-xl font-bold text-gray-900">₹{task.totalAmount}</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Customer OTP Verification</p>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter 4-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all font-mono text-lg text-center tracking-widest placeholder:tracking-normal placeholder:text-sm"
                    maxLength={4}
                  />
                  <button
                    onClick={handleComplete}
                    disabled={otp.length !== 4}
                    className="px-6 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryTask;
