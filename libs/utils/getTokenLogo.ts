const path = require("path");
const context = (require as any).context(
	"@/libs/assets/tokens",
	false,
	/\.svg$/
);
const tokenLogos = {};
context.keys().forEach((key) => {
	const basename = path.basename(key, ".svg");
	return (tokenLogos[basename] = context(key)?.default);
});

export default function getTokenLogo(symbol: string): {
	src: string;
	width: number;
	height: number;
} {
	return tokenLogos[symbol?.toLowerCase()] || tokenLogos["missing"];
}
