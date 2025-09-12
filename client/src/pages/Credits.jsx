import { useEffect, useState } from "react";
import Loading from "./Loading";
import axios from "axios";
import { useAppContext } from "../context/AppContext";

const Credits = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const { token } = useAppContext();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/credit/plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) setPlans(data.data.plans);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          await axios.post(
            `${backendUrl}/api/credit/verfiy-purchase`,
            { razorpay_order_id: response.razorpay_order_id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          // console.log("Payment verified successfully");
        } catch (err) {
          console.error(err);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const paymentRazorpay = async (planId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/credit/buy`,
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) initPay(data.order);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl h-screen overflow-y-auto mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-semibold text-center mb-12 text-gray-200">
        Credit Plans
      </h2>

      <div className="flex flex-wrap justify-center gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`min-w-[280px] max-w-sm flex flex-col p-6 rounded-2xl border transition-all duration-300 
              ${plan.id === "pro"
                ? "bg-gradient-to-br from-purple-600 to-purple-800 border-purple-500 shadow-xl scale-105"
                : "bg-gray-900 border-gray-800 hover:border-gray-600 hover:shadow-lg"
              }`}
          >
            <div className="flex-1">
              <h3 className={`text-xl font-semibold mb-3 ${plan.id === "pro" ? "text-white" : "text-gray-200"}`}>
                {plan.name}
              </h3>
              <p className={`text-2xl font-bold ${plan.id === "pro" ? "text-white" : "text-gray-100"}`}>
                ₹ {plan.price}{" "}
                <span className={`text-sm font-medium ${plan.id === "pro" ? "text-gray-200" : "text-gray-400"}`}>
                  / {plan.credits} credits
                </span>
              </p>
              <ul className="list-disc list-inside text-sm text-gray-400 space-y-1 mt-3">
                {plan.features?.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => paymentRazorpay(plan.id)}
              className={`mt-6 rounded-lg py-2 font-medium transition-all duration-300 cursor-pointer 
                ${plan.id === "pro"
                  ? "bg-purple-500 text-white hover:bg-purple-600"
                  : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                }`}
              aria-label={`Buy ${plan.name} Plan`}
            >
              Buy {plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
