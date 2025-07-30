import { ArrowDown } from "lucide-react";

const ProductivityLoss = () => {
  const items = [
    { hours: 4, text: "lost switching between tasks" },
    { hours: 5, text: "scrolling through distractions" },
    { hours: 1, text: "wondering where time went" },
    { hours: 2, text: "trying to get back on track" },
    { hours: 3, text: "fighting procrastination" },
    { hours: 2, text: "juggling multiple todo apps" },
    { hours: "∞", text: "getting burnt out..." },
  ];

  const totalHours = 17;

  return (
    <div className="text-center py-24">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Think you're being productive? Let's do the math.
      </h2>
      <div className="max-w-xl mx-auto space-y-4 py-6 bg-red-50/50 rounded-xl p-4">
        <span className="text-lg  font-semibold">Every week you lose:</span>
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center space-x-2"
          >
            {index === 0 ? (
              <span className="text-lg text-red-500 font-semibold">
                {item.hours} hrs
              </span>
            ) : (
              <>
                <span className="text-lg text-red-500 font-semibold">
                  + {item.hours} hrs
                </span>
              </>
            )}
            <span className="text-lg text-gray-700">{item.text}</span>
            {index === items.length - 1 && (
              <span className="text-lg ml-2">😫</span>
            )}
          </div>
        ))}
        <div className="flex items-center justify-center space-x-2 pt-6">
          <span className="text-xl text-red-500 font-bold">
            = {totalHours}+ hours
          </span>
          <span className="text-xl text-gray-700">of lost productivity</span>
          <span className="text-xl">⚠️</span>
        </div>
      </div>
      <div className="mt-8 text-base md:text-lg text-gray-600 flex-col flex gap-2 items-center justify-center space-x-2">
        Focusmo is being updated weekly to help you
        <br />
        fight back, and save {totalHours}+ hours every week
        <ArrowDown className="animate-bounce h-4 w-4" />
      </div>
    </div>
  );
};

export default ProductivityLoss;
