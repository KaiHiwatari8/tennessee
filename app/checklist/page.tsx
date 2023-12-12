import {Mdx} from "@components/mdx-component";
import {allChecklists} from "contentlayer/generated";

export default function Checklist() {
	return (
		<article className="checklist_wrapper">
			<header className="title text-gray-100">
				<p className="text-3xl lg:text-5xl font-semibold">Checklist</p>
				<p className="text-xs text-gray-400 pt-2">Date created: Jun 15, 2023</p>
			</header>
			<section className="py-3">
				Here is a compilation of almost all things you should definitely pack when you go hiking
				in Smokey Mountains, TN. Of course I cannot cover all things but if you think I forgot
				something, I do not mind you pointing it out.
			</section>
			{allChecklists.map((checkList) => (
				<div key={checkList._id} className="checklist_wrapper mx-auto border border-red-500">
					<p className="text-lg lg:text-3xl font-semibold">{checkList.title}</p>
					<Mdx code={checkList.body.code} className="py-4 border border-red-500" />
				</div>
			))}
		</article>
	);
}
