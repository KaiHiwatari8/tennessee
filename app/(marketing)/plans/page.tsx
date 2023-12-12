import {allPlans} from "contentlayer/generated";
import Link from "next/link";
import styles from "./styles.module.css";

export default function Plans() {
	return (
		<section className="plans container">
			<header className="text-4xl lg:text-6xl font-semibold">
					Plans
			</header>
			<p className="plans_text py-3 text-gray-300">
				Here you can find a details of the plan broken by days. The plan mostly covers some famous
				trails and hiking to popular viewpoints.

				Feel free to browse through the details of each day.

				If you know of some <strong>good</strong> destinations I should hike to and is not covered
				in any of the plans, email me with the details. My email-id can be found in the About me section.
			</p>
			<div className="plans lg:mt-4">
				{
					allPlans.map((plan, idx) => (
						<div key={idx} className={`flex flex-row justify-between border border-gray-500 rounded-2xl p-4 my-4 mx-auto lg:w-80 ${styles.plan_tile}`}>
							<span>
								<p className="text-2xl">Day {plan.day}</p>
								<p className="text-gray-400">{plan.title}</p>
							</span>
							<span>
								<Link href={`/plans/${plan.pathSlug}`}>
									<svg height="50" width="50" viewBox="0 0 50 50">
										<line className="stroke-white" x1={15} y1={15} x2={35} y2={30} />
										<line className="stroke-white" x1={15} y1={45} x2={35} y2={30} />
									</svg>
								</Link>
							</span>
						</div>
					))
				}
			</div>
		</section>
	);
}
