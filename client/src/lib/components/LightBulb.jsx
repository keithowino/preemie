import React from "react";

const LightBulb = () => {
	return (
		<div className="absolute top-0">
			<div className="wire fixed left-1/2 bottom-[50%] w-1 h-[60vh] bg-black -z-[1] "></div>
			<div className="wire fixed left-[60vw] bottom-[60%] w-1 h-[50vh] bg-black -z-[1] "></div>
			<div className="bulb fixed w-20 h-20 rounded-[50%] -z-[2] top-[50vh] left-[47.2vw] animate-pulse transition-all duration-3000 shadow-white shadow-lg "></div>
			<div className="bulb fixed w-20 h-20 rounded-[50%] -z-[2] top-[40vh] left-[57.2vw] animate-pulse transition-all duration-3000 shadow-white shadow-lg "></div>
		</div>
	);
};

export default LightBulb;
