const RangeSlider = ({ label, minVal, maxVal, value, setValue }) => {
  return (
    <div className="flex w-full flex-col items-center rounded-md bg-gray-100 p-4 shadow-sm">
      <label className="mb-3 text-base font-semibold text-gray-700">
        {label}: <span className="text-theme-dark">{value}</span>
      </label>
      <div className="relative w-full">
        {/* Background Track */}
        <div
          className="absolute top-1/2 left-0 h-2 w-full rounded-lg bg-gray-300"
          style={{ transform: 'translateY(-50%)' }}
        ></div>

        {/* Filled Track */}
        <div
          className="bg-theme-dark absolute top-1/2 h-2 rounded-lg"
          style={{
            left: '0%',
            width: `${((value - minVal) / (maxVal - minVal)) * 100}%`,
            transform: 'translateY(-50%)',
          }}
        ></div>

        {/* Input Range */}
        <input
          type="range"
          min={minVal}
          max={maxVal}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="relative h-2 w-full cursor-pointer appearance-none bg-transparent"
          style={{
            WebkitAppearance: 'none',
            appearance: 'none',
          }}
        />

        {/* Thumb Styling */}
        <style>
          {`
            input[type="range"]::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 20px;
              height: 20px;
              background: #bf3131;
              border-radius: 50%;
              cursor: pointer;
              position: relative;
              margin-top: -6px;
            }

            input[type="range"]::-moz-range-thumb {
              width: 20px;
              height: 20px;
              background: #bf3131;
              border-radius: 50%;
              cursor: pointer;
            }
          `}
        </style>
      </div>
    </div>
  );
};
export default RangeSlider;
