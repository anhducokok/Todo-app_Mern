import Timer from "@/components/pomodoro/Timer";
import React from "react";

const Pomodoro = () => {
  return (
    <div>
      <div
        className="absolute inset-0 z-0" // inset-0 = top:0, right:0, bottom:0, left:0
        style={{
          // Inline style cho gradient background (không thể dùng Tailwind cho gradient phức tạp)
          background:
            "radial-gradient(125% 125% at 50% 90%, #ffffff 20%, #fdfdfd 60%, #eeeeee 100%)",
        }}
      />
        <div className="container pt-8 mx-auto relative z-10">
            <div className="w-full max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Pomodoro Timer</h1>
                <p className="text-lg">This is a placeholder for the Pomodoro Timer feature.</p>
            </div>
            <Timer />
            
        </div>
        
    </div>
  );
};

export default Pomodoro;
