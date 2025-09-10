import  { useEffect, useState } from "react";
import { dummyPlans } from "../assets/assets";
import Loading from "./Loading";
import axios from "axios";

const Credits = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setPlans(dummyPlans);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);


  const initPay = async (order) => {
    try {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Credits Payment',
        description: 'Credits Payment',
        order_id: order.id,
        receipt: order.receipt,
        handler: async (response) => {
          // console.log(response)
          try {
            const { data } = await axios.post(backendUrl + '/api/credit/verfiy-purchase', { response }, { headers: { Authorization: `Bearer ${token}` } })
            if (data.success) {
              console.log("payment successful")
            }
          } catch (error) {
            console.error(error);
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error(error)
    }
  }
  const paymentRazorpay = async (planId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/credit/buy`,
        { planId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        console.log(data.order)
        initPay(data.order)
      }


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
            key={plan._id}
            className={`min-w-[280px] max-w-sm flex flex-col p-6 rounded-2xl border transition-all duration-300 
              ${plan._id === "pro"
                ? "bg-gradient-to-br from-purple-600 to-purple-800 border-purple-500 shadow-xl scale-105"
                : "bg-gray-900 border-gray-800 hover:border-gray-600 hover:shadow-lg"
              }`}
          >
            <div className="flex-1">
              <h3
                className={`text-xl font-semibold mb-3 ${plan._id === "pro" ? "text-white" : "text-gray-200"
                  }`}
              >
                {plan.name}
              </h3>
              <p
                className={`text-2xl font-bold ${plan._id === "pro" ? "text-white" : "text-gray-100"
                  }`}
              >
                ${plan.price}{" "}
                <span
                  className={`text-sm font-medium ${plan._id === "pro" ? "text-gray-200" : "text-gray-400"
                    }`}
                >
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
              onClick={() => paymentRazorpay(plan._id)}
              className={`mt-6 rounded-lg py-2 font-medium transition-all duration-300 cursor-pointer 
                ${plan._id === "pro"
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
