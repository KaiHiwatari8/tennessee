import styles from "./styles.module.css";

export default function Photos() {
	return (
		<section className="flex flex-row justify-center py-24">
			<div className="shadow-lg shadow-gray-300 animate-pulse">
				<div className="animate-spin absolute drop-shadow"></div>
				Hang on tight till the photos are uploaded after the trip!
			</div>
		</section>
	);
}
