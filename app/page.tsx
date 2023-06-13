import Image from "next/image";
import Mountain from "@tn/public/mountain3.png";
import Link from "next/link";
import styles from "./styles.module.css";

export default function Home() {
	return (
		<main className="items-center justify-between">
			<section className="flex flex-col justify-center pt-24 mx-auto w-fit">
				<div className="text-9xl font-bold drop-shadow-lg">
						Tennessee
				</div>
				<div className="text-base/loose text-gray-400 text-center">
						Jay and his friends are planning a road trip to Tennessee. Are you ready to join him?
				</div>
				<Image className="mx-auto md:py-8" src={Mountain} height={300} alt="Mountains" />
				<Link href="/plans" className={`${styles.glow} mx-auto rounded-3xl w-fit p-3 hover:animate-pulse`}>
						Dive right in
				</Link>
			</section>
		</main>
	);
}
