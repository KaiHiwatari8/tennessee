// contentlayer.config.ts
import { defineDocumentType, makeSource } from "@contentlayer/source-files";
var Plan = defineDocumentType(() => ({
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
var contentlayer_config_default = makeSource({
  contentDirPath: "./content",
  documentTypes: [Plan]
});
export {
  Plan,
  contentlayer_config_default as default
};
//# sourceMappingURL=compiled-contentlayer-config-HIDRH5AR.mjs.map
