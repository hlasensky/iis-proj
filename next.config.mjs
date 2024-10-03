/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		domains: ["https://avatars.githubusercontent.com/u/"],
	},
	experimental: {
		optimizePackageImports: ["@mantine/core", "@mantine/hooks"],
	},
};

export default nextConfig;
