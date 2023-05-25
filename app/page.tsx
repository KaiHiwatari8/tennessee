import Image from "next/image";
import Mountain from "@tn/public/mountain3.png";

export default function Home() {
	return (
		<main className="items-center justify-between">
			<section className="flex flex-row justify-around lg:py-24 md:py-16">
				<div className="container mx-auto w-auto">
					<p className="text-9xl font-bold drop-shadow-lg">
						Tennessee
					</p>
					<p className="text-base/loose text-gray-400 text-center">
						Jay and his friends are planning a road trip to Tennessee. Are you ready to join him?
					</p>
					<Image className="mx-auto md:py-8" src={Mountain} height={300} alt="Mountains" />
					<div className="text-center">
						Dive right in
					</div>
				</div>
			</section>
		</main>
	);
}
