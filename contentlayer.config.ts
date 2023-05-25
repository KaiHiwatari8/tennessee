import { defineDocumentType, makeSource } from "@contentlayer/source-files";

export const Plan = defineDocumentType(() => ({
	name: "Plan",
	filePathPattern: "plans/**/*.mdx",
	contentType: "mdx",
	fields: {
		title: {
			type: "string",
			required: true
		},
		description: {
			type: "string"
		},
		pathSlug: {
			type: "string",
			required: true
		}
	},
	computedFields: {
		url: {
			type: "string",
			resolve: (plan) => `/plans/${plan._raw.flattenedPath}`
		}
	}
}));

export default makeSource({
	contentDirPath: "./content",
	documentTypes: [Plan]
});
