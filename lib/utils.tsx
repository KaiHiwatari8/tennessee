import {twMerge} from "tailwind-merge";
import {ClassValue, clsx} from "clsx";

export function mergeClass(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
