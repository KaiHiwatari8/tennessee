import {allPlans, Plan as PlanType} from "contentlayer/generated";

export default function Plans() {
	return (
		<div>
			Hello from Plan
			<div className="plans">
				{
					allPlans.map((plan, idx) => (
						<p key={idx}>
							{plan.pathSlug}
						</p>
					))
				}
			</div>
		</div>
	);
}
