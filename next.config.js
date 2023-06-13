/** @type {import('next').NextConfig} */
const {withContentlayer} = require("next-contentlayer");
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
	assetPrefix: isProd ? "/tennessee/" : "",
};

module.exports = withContentlayer(nextConfig);
