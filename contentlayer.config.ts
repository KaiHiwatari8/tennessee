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
		day: {
			type: "number",
			required: true
		},
		description: {
			type: "string"
		},
		image: {
			type: "string",
			required: true,
		},
		dateUpdated: {
			type: "string",
			required: true
		},
		datePlanned: {
			type: "string",
			required: true
		},
		pathSlug: {
			type: "string",
			required: true
		}
	},
	computedFields: {
		url: {
			type: "string",
			resolve: (plan) => `/${plan._raw.flattenedPath}`
		}
	}
}));

export const Checklist = defineDocumentType(() => ({
	name: "Checklist",
	filePathPattern: "checklist/*list.mdx",
	contentType: "mdx",
	fields: {
		title: {
			type: "string",
			required: true
		},
		description: {
			type: "string"
		},
		image: {
			type: "string",
			required: true,
		},
		dateUpdated: {
			type: "string",
			required: true
		},
	}
}));

export default makeSource({
	contentDirPath: "./content",
	documentTypes: [Plan, Checklist]
});
