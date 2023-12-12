import * as React from "react";
import Image from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";
import {mergeClass} from "@tn/lib/utils";
import {MDXComponents} from "mdx/types";
import {MDXContentProps} from "mdx-bundler/client";

interface MdxProps {
	code: string,
	className?: string
}

const components: MDXComponents = {
	header: ({className, ...props}) => (
		<header className={mergeClass(
			"text-5xl font-extrabold"
			, className)}
			 {...props}
		/>
	),
	h1: ({className, ...props}) => (
		<h1
			className={mergeClass(
				"text-6xl"
				, className)}
			{...props}
		/>
	),
	h2: ({className, ...props}) => (
		<h2
			className={mergeClass(
				"text-2xl lg:text-4xl py-3"
				, className)}
			{...props}
		/>
	),
	a: ({className, ...props}) => (
		<a className={mergeClass("", className)} {...props} />
	),
	Image
};
export function Mdx({ code, className }: MdxProps) {
	const Component: React.ComponentType<MDXContentProps> = useMDXComponent(code);
	return (
		<div className={mergeClass(className, "mdx text-justify")}>
			<Component components={components} />
		</div>
	);
}
