import MainNavigation from "@tn/components/menubar/menubar";

export const metadata = {
	title: "Tennessee",
	description: "Jay goes to Tennessee",
};

export default function ChildLayout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<MainNavigation />
			<section>
				{children}
			</section>
		</div>
	);
}
