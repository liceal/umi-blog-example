import React, { PropsWithChildren } from "react";

function Button(
	props: PropsWithChildren<{ onClick(): void; className?: String }>
) {
	return (
		<button
			onClick={props.onClick}
			className={
				"bg-blue-600 rounded-xl hover:bg-blue-300 text-white w-32 py-2 my-6 transition-all " +
				props.className
			}
		>
			{props.children}
		</button>
	);
}

export default Button;
