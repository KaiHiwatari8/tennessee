"use client";
import {mergeClass} from "@tn/lib/utils";

export interface LBProps {
	displayText: string,
	link: string,
	className?: string
}
export function LinkButton({link, displayText, className}: LBProps) {
	return (
		<div onClick={() => window.open(link, "_blank")} className={
			mergeClass("", className)
		}>
			{displayText}
		</div>
	);
}
