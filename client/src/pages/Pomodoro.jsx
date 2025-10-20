import Navigator from "@/components/common/Navigator";
import Timer from "@/components/pomodoro/Timer";
import { useAuth } from "@/context/AuthContext";
import React, { useState } from "react";

const Pomodoro = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, isLoggedIn, token } = useAuth();
  const fetchTask = async () => {
    if (!token || !isLoggedIn) {
      console.log("No authentication token available");
      return;
    }
    try {
      setIsLoading(true); 
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full relative">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white bg-opacity-70">
          <Spinner className="h-16 w-16 text-red-200 animate-spin" />
        </div>
      )}
      <div
        className="absolute inset-0 z-0" // inset-0 = top:0, right:0, bottom:0, left:0
        style={{
          // Inline style cho gradient background (không thể dùng Tailwind cho gradient phức tạp)
          background:
            "radial-gradient(125% 125% at 50% 90%, #ffffff 20%, #fdfdfd 60%, #eeeeee 100%)",
        }}
      />
        <div className="container pt-8 mx-auto relative z-10">
          <div className="max-w-2xl mx-auto">
          <Navigator />
            <Timer />
          </div>
        </div>
        
    </div>
  );
};

export default Pomodoro;
