/** @type {import('next').NextConfig} */
const {withContentlayer} = require("next-contentlayer");
const nextConfig = {
	output: "export",
	images: {
		unoptimized: true
	}
};

module.exports = withContentlayer(nextConfig);
