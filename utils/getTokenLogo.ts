const path = require("path");
const context = (require as any).context("@/assets/tokens", false, /\.svg$/);
const tokenLogos = {};
context.keys().forEach((key) => {
	const basename = path.basename(key, ".svg");
	return (tokenLogos[basename] = context(key)?.default);
});

export default function getTokenLogos(symbol: string): {
	src: string;
	width: number;
	height: number;
} {
	return tokenLogos[symbol.toLowerCase()] || null;
}
