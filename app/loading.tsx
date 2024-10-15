import { Loader2 } from "lucide-react";
import React from "react";

function loading() {
	return (
		<div className="flex justify-center items-center h-screen w-full">
			<Loader2 className="text-slate-300 animate-spin" size={50} />
		</div>
	);
}

export default loading;
