import styles from "@components/menubar/styles.module.css";
import {Permanent_Marker} from "next/font/google";
import Link from "next/link";

const permanent_marker = Permanent_Marker({
	subsets: ["latin"],
	weight: "400"
});

export default function MainNavigation() {
	return (
		<div className={"flex p-6 w-screen"}>
			<div className={`logo text-4xl m-0.5 ${styles.logo_space} ${permanent_marker.className}`}>
				<Link href="?ref=nav_logo">Tennessee</Link>
			</div>
			<div className={`text-md ${styles.options_space}`}>
				<span className={`py-3 ${styles.options}`}>
					<Link href={"/plans"}>Plan</Link>
				</span>
				<span className={`py-3 ${styles.options}`}>
					<Link href={"/sights"}>Sights</Link>
				</span>
				<span className={`py-3 ${styles.options}`}>
					<Link href={"/checklist"}>Checklist</Link>
				</span>
				<span className={`py-3 ${styles.options}`}>
					<Link href={"/photos"}>Photos</Link>
				</span>
				<span className={`py-3 ${styles.options}`}>
					<Link href={"/about-me"}>About Me</Link>
				</span>
			</div>
		</div>
	);
}
