import {notFound} from "next/navigation";
import {allPlans} from "contentlayer/generated";
import {Mdx} from "@tn/components/mdx-component";
import Image from "next/image";

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
}

export default async function Plan({params}: PlanPageProps) {
	const plan = await getPlanFromUrl(params);
	if (!plan) {
		notFound();
	}

	return (
		<article className="plan_wrapper container lg:px-40 px-3 mx-auto py-5">
			<header className="plan_title text-gray-100">
				<p className="text-3xl lg:text-5xl font-semibold">Day {plan.day} - {plan.title}</p>
				<p className="text-xs text-gray-400 pt-2">Date planned: {plan.datePlanned}</p>
				<p className="text-xs text-gray-400">Date last updated: {plan.dateUpdated}</p>
			</header>
			{plan.image && (
				<Image
					src={plan.image}
					width="1000"
					height="900"
					alt="Smokey Mountains"
					className="mx-auto rounded-3xl py-4"
				/>
			)}
			<Mdx code={plan.body.code}/>
		</article>
	);
}
