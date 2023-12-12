import Link from "next/link";

export default function NotFound() {
	return (
		<div className="w-fit mx-auto py-32 text-center">
			<p className="text-4xl">
				Plan not found
			</p>
			<p className="text-gray-500">
				<Link href="/plans?ref=notFound">Click here to go back to home</Link>
			</p>
		</div>
	);
}
