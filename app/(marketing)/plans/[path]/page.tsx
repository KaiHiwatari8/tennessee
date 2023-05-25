import {useMDXComponent} from "next-contentlayer/hooks";
import {notFound} from "next/navigation";
import {allPlans, Plan as PlanType} from "contentlayer/generated";

interface PlanPageProps {
	params: {
		path: string
	}
}

async function getPlanFromUrl(params: PlanPageProps["params"]) {
	const plan = allPlans.find((p) => p.pathSlug === params.path);
	if (!plan) {
		return null;
	}
	return plan;
}

export async function generateStaticParams(): Promise<PlanPageProps["params"][]> {
	return allPlans.map((val, idx) => ({
		path: val.pathSlug,
		index: idx
	}));
};

export default async function Plan({params}: PlanPageProps) {
	const plan = await getPlanFromUrl(params);
	if (!plan) {
		notFound();
	}

	const MdxContent = useMDXComponent(plan.body.code);
	return (
		<p>
			<div dangerouslySetInnerHTML={{__html:plan.body.raw}}>
			</div>
		</p>
	);
}
