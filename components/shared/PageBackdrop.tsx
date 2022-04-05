import { FC, useEffect, useRef } from "react";
import { css } from "@emotion/react";

import { useSectionUri } from "@/hooks";
import { Theme } from "@mui/material";

const PageBackdrop: FC<{}> = () => {
	const section = useSectionUri();
	const ref0 = useRef<HTMLDivElement>();
	const ref1 = useRef<HTMLDivElement>();
	const ref2 = useRef<HTMLDivElement>();

	useEffect(() => {
		if (!ref0?.current || !ref1?.current || !ref2?.current) return;
		const layer0 = ref0.current,
			layer1 = ref1.current,
			layer2 = ref2.current;

		const onMouseMove = (event: PointerEvent) => {
			const mouseX = event.clientX,
				mouseY = event.clientY;

			const deltaX = (mouseX / window.innerWidth - 0.5) * 2,
				deltaY = (mouseY / window.innerHeight - 0.5) * 2;

			layer0.style.transform = `translate3d(${deltaX * -2}px, ${
				deltaY * -2
			}px, 0px)`;

			layer1.style.transform = `translate3d(${deltaX * 1}px, ${
				deltaY * 1
			}px, 0px)`;

			layer2.style.transform = `translate3d(${deltaX * -1}px, ${
				deltaY * -1
			}px, 0px)`;
		};

		document.addEventListener("mousemove", onMouseMove);

		return () => document.removeEventListener("mousemove", onMouseMove);
	}, []);

	return (
		<div css={styles.container}>
			<div css={styles.layer0} ref={ref0}></div>

			<div css={styles.layer1} ref={ref1}>
				<Layer1 />
			</div>

			<div css={styles.layer2} ref={ref2}>
				{section === "swap" && (
					<img
						src="/images/backdrop-swap-graphics.svg"
						css={styles.layer2Graphics}
						alt="Graphics"
					/>
				)}
				{section === "pool" && (
					<img
						src="/images/backdrop-pool-graphics.svg"
						css={styles.layer2Graphics}
						alt="Graphics"
					/>
				)}
				{section === "bridge" && (
					<img
						src="/images/backdrop-bridge-graphics.svg"
						css={styles.layer2Graphics}
						alt="Graphics"
					/>
				)}
			</div>
		</div>
	);
};

export default PageBackdrop;

const Layer1: FC<{}> = () => {
	return (
		<svg
			width="1155"
			height="486"
			viewBox="0 0 1155 486"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			css={styles.layer1Graphics}
		>
			<path
				d="M60.4308 310.171C60.2977 310.125 60.1752 310.052 60.0704 309.958C59.9656 309.863 59.8807 309.749 59.8204 309.621C59.7732 309.514 59.7364 309.402 59.7104 309.288C59.6856 309.198 59.6678 309.107 59.6572 309.015C59.6005 308.578 59.5614 308.142 59.5188 307.705C59.4763 307.269 59.3982 306.836 59.313 306.403C59.2279 305.97 59.1427 305.566 59.0256 305.154C58.7843 304.309 58.5395 303.468 58.3656 302.61C58.2734 302.131 58.2343 301.637 58.1066 301.166C58.0882 301.119 58.0669 301.074 58.0427 301.031L58.025 301.031L57.8688 300.981C57.6098 300.928 57.3543 300.878 57.0988 300.811C56.8434 300.743 56.6163 300.676 56.3892 300.616C56.1621 300.555 55.8037 300.548 55.5127 300.502C55.0798 300.438 54.6576 300.321 54.2318 300.222L54.0473 300.183L54.1537 300.208C53.5043 300.069 52.8514 299.938 52.2021 299.796C51.865 299.721 51.5314 299.64 51.1979 299.562C51.0808 299.54 50.9637 299.516 50.8431 299.484C50.6409 299.418 50.4594 299.3 50.3164 299.143C50.1733 298.985 50.0736 298.793 50.0269 298.586C49.991 298.418 49.991 298.245 50.0271 298.077C50.0632 297.91 50.1345 297.752 50.2363 297.614C50.3866 297.419 50.5764 297.258 50.7934 297.142C51.0708 296.989 51.3682 296.875 51.6769 296.805C51.9537 296.723 52.234 296.659 52.5073 296.574C53.0572 296.372 53.5718 296.102 54.136 295.935C54.563 295.818 54.9966 295.727 55.4347 295.662C55.9137 295.58 56.3821 295.47 56.854 295.403C57.2116 295.368 57.5669 295.314 57.9185 295.24L57.9646 295.219C58.0427 294.963 58.1314 294.715 58.2166 294.459C58.3337 294.104 58.4543 293.749 58.5892 293.395C58.8766 292.639 59.1959 291.897 59.5117 291.149C59.6643 290.794 59.8133 290.439 59.9588 290.084C60.1043 289.729 60.2108 289.374 60.3421 289.019C60.4485 288.725 60.5479 288.427 60.665 288.139C60.7249 287.993 60.7974 287.852 60.8814 287.717C60.9284 287.643 60.9858 287.576 61.0517 287.519C61.1096 287.427 61.1787 287.344 61.2575 287.27C61.3661 287.175 61.4928 287.102 61.6301 287.056C61.7673 287.01 61.9123 286.992 62.0566 287.004C62.2008 287.015 62.3413 287.055 62.4698 287.121C62.5983 287.188 62.7121 287.28 62.8046 287.391C62.9237 287.531 63.0044 287.7 63.0388 287.88L63.0814 288.093C63.0814 288.179 63.1098 288.26 63.1204 288.345C63.1311 288.43 63.1524 288.619 63.1665 288.757C63.1937 289.14 63.2458 289.52 63.3227 289.896C63.4149 290.311 63.5214 290.719 63.6349 291.127C63.7485 291.535 63.8408 291.837 63.9117 292.217C63.9827 292.596 64.043 293.019 64.0856 293.419C64.1282 293.82 64.1601 294.214 64.1956 294.612C64.2171 294.893 64.2622 295.172 64.3304 295.446C64.3517 295.502 64.373 295.556 64.3978 295.612C64.6001 295.658 64.7917 295.719 64.994 295.779C65.2707 295.868 65.5582 295.921 65.8385 295.988L66.5127 296.145C66.8624 296.208 67.2083 296.291 67.5488 296.393C67.8956 296.513 68.2356 296.651 68.5672 296.808C69.1199 297.054 69.6875 297.265 70.2668 297.44C70.9 297.662 71.5097 297.946 72.0872 298.288C72.2344 298.36 72.3745 298.445 72.5059 298.543C72.7319 298.709 72.8906 298.951 72.953 299.225C72.9814 299.366 72.9807 299.513 72.9508 299.654C72.9209 299.796 72.8625 299.93 72.7791 300.048C72.6098 300.284 72.3552 300.444 72.0694 300.495C71.9664 300.513 71.8617 300.52 71.7572 300.516C71.6745 300.524 71.5926 300.538 71.5123 300.559C71.2604 300.665 71.0156 300.797 70.7601 300.892C70.3422 301.053 69.9096 301.171 69.4685 301.247C69.0462 301.325 68.6311 301.428 68.2159 301.535C68.0172 301.588 67.8256 301.655 67.6269 301.708C67.2766 301.781 66.9201 301.819 66.5623 301.822C66.1082 301.85 65.6611 301.907 65.2104 301.975C65.0153 302.007 64.8201 302.031 64.6285 302.067C64.5859 302.227 64.554 302.39 64.5078 302.542C64.3659 303.004 64.2027 303.461 64.0536 303.919C63.7387 304.819 63.3714 305.699 62.9537 306.556C62.6662 307.173 62.4853 307.837 62.244 308.472C62.1517 308.727 62.0666 308.983 61.9779 309.238C61.9152 309.404 61.8392 309.564 61.7508 309.717C61.689 309.819 61.6097 309.909 61.5166 309.983C61.3733 310.105 61.201 310.188 61.0162 310.225C60.9298 310.242 60.8416 310.248 60.7537 310.242C60.6462 310.228 60.5397 310.208 60.4343 310.182L60.4308 310.171ZM58.7595 299.012C59.1115 299.144 59.424 299.364 59.6679 299.65C60.0496 300.194 60.282 300.827 60.3421 301.488C60.5023 302.478 60.7287 303.456 61.0198 304.416C61.0943 304.678 61.1653 304.937 61.2327 305.204L61.2327 305.161C61.6403 304.245 61.9957 303.307 62.2972 302.351C62.4321 301.956 62.5503 301.558 62.6521 301.158C62.7033 300.941 62.8051 300.738 62.9494 300.568C63.0937 300.397 63.2763 300.262 63.4824 300.176C63.8993 300.024 64.3329 299.923 64.774 299.874C65.4434 299.776 66.1172 299.712 66.793 299.682L66.5091 299.682C66.8525 299.662 67.192 299.6 67.5204 299.498C67.783 299.42 68.0491 299.352 68.3117 299.285C68.4714 299.246 68.6311 299.214 68.7943 299.182L68.5423 299.09C67.851 298.767 67.1399 298.489 66.4133 298.256C65.9485 298.16 65.4872 298.057 65.0259 297.947C64.774 297.887 64.5185 297.834 64.2701 297.763C64.1388 297.731 64.0146 297.681 63.8869 297.646C63.6775 297.61 63.4682 297.589 63.2588 297.532C63.1399 297.5 63.0296 297.442 62.9359 297.362C62.7855 297.25 62.6638 297.104 62.5811 296.936C62.54 296.838 62.5056 296.737 62.4782 296.634C62.4782 296.588 62.4569 296.542 62.4462 296.496C62.4356 296.45 62.3682 296.315 62.3362 296.219C62.2118 295.856 62.1273 295.48 62.0843 295.098C62.0027 294.303 61.953 293.508 61.8182 292.72C61.751 292.362 61.6658 292.006 61.5627 291.656C61.474 291.865 61.3853 292.075 61.293 292.284C61.0162 292.919 60.7466 293.561 60.5088 294.214C60.2711 294.867 60.0156 295.573 59.8275 296.269C59.7824 296.399 59.7114 296.519 59.6187 296.622C59.526 296.724 59.4136 296.807 59.2882 296.865L59.2208 296.897C59.1656 296.94 59.1062 296.977 59.0433 297.007C58.7164 297.169 58.3672 297.281 58.0072 297.34C57.585 297.411 57.1627 297.461 56.744 297.539L55.5376 297.759C55.1989 297.812 54.8636 297.884 54.5334 297.976L54.3276 298.057L54.4518 298.082C54.8066 298.153 55.126 298.235 55.463 298.313C55.6653 298.348 55.8711 298.373 56.0769 298.394C56.3935 298.43 56.7076 298.486 57.0172 298.561C57.3366 298.636 57.6524 298.735 57.9718 298.817C58.234 298.85 58.4921 298.911 58.7417 298.998L58.7595 299.012ZM64.2311 302.156L64.263 302.156L64.2311 302.156ZM54.3985 300.239L54.3169 300.222L54.3985 300.239ZM51.535 297.458L51.3576 297.418L51.5386 297.458L51.535 297.458ZM52.0885 299.753L52.1737 299.753L52.3689 299.796L52.0885 299.736L52.0885 299.753Z"
				fill="inherit"
			/>
			<path
				d="M972.543 8.07281C972.676 8.11948 972.798 8.19214 972.903 8.28656C973.008 8.38097 973.093 8.49526 973.153 8.6228C973.2 8.73022 973.237 8.84191 973.263 8.95635C973.288 9.04589 973.306 9.13724 973.316 9.22957C973.373 9.66602 973.412 10.1025 973.455 10.5389C973.497 10.9754 973.575 11.4083 973.661 11.8412C973.746 12.2741 973.831 12.6786 973.948 13.0902C974.189 13.9347 974.434 14.7757 974.608 15.6344C974.7 16.1134 974.739 16.6066 974.867 17.0786C974.885 17.1248 974.907 17.1699 974.931 17.2134H974.949L975.105 17.2631C975.364 17.3163 975.619 17.366 975.875 17.4334C976.13 17.5008 976.357 17.5682 976.584 17.6286C976.812 17.6889 977.17 17.696 977.461 17.7421C977.894 17.806 978.316 17.9231 978.742 18.0224L978.926 18.0615L978.82 18.0366C979.469 18.175 980.122 18.3063 980.772 18.4482C981.109 18.5228 981.442 18.6044 981.776 18.6824C981.893 18.7037 982.01 18.7286 982.131 18.7605C982.333 18.8266 982.514 18.9441 982.657 19.1015C982.8 19.2589 982.9 19.4507 982.947 19.6582C982.983 19.8259 982.983 19.9992 982.947 20.1669C982.91 20.3345 982.839 20.4925 982.737 20.6305C982.587 20.8254 982.397 20.9862 982.18 21.1024C981.903 21.2552 981.605 21.3686 981.297 21.4395C981.02 21.5211 980.74 21.585 980.466 21.6702C979.916 21.8724 979.402 22.1421 978.838 22.3089C978.411 22.426 977.977 22.5173 977.539 22.5821C977.06 22.6637 976.592 22.7737 976.12 22.8411C975.762 22.876 975.407 22.9305 975.055 23.0043L975.009 23.0256C974.931 23.2811 974.842 23.5295 974.757 23.785C974.64 24.1398 974.519 24.4947 974.384 24.8495C974.097 25.6053 973.778 26.3469 973.462 27.0956C973.309 27.4505 973.16 27.8053 973.015 28.1601C972.869 28.515 972.763 28.8698 972.632 29.2247C972.525 29.5192 972.426 29.8172 972.309 30.1046C972.249 30.2513 972.176 30.3926 972.092 30.5269C972.045 30.6009 971.988 30.6678 971.922 30.7256C971.864 30.8168 971.795 30.9002 971.716 30.974C971.607 31.0696 971.481 31.1424 971.344 31.1881C971.206 31.2339 971.061 31.2517 970.917 31.2404C970.773 31.2292 970.632 31.1891 970.504 31.1227C970.375 31.0562 970.261 30.9646 970.169 30.8533C970.05 30.7131 969.969 30.5444 969.935 30.3637L969.892 30.1508C969.892 30.0656 969.864 29.984 969.853 29.8988C969.843 29.8137 969.821 29.6256 969.807 29.4872C969.78 29.1046 969.728 28.7241 969.651 28.3482C969.559 27.933 969.452 27.525 969.339 27.1169C969.225 26.7089 969.133 26.4072 969.062 26.0276C968.991 25.6479 968.931 25.2256 968.888 24.8247C968.845 24.4237 968.814 24.0298 968.778 23.6324C968.757 23.3512 968.711 23.0722 968.643 22.7985C968.622 22.7418 968.601 22.6885 968.576 22.6318C968.374 22.5856 968.182 22.5253 967.98 22.465C967.703 22.3763 967.415 22.3231 967.135 22.2556L966.461 22.0995C966.111 22.036 965.765 21.9531 965.425 21.8511C965.078 21.7314 964.738 21.5929 964.406 21.436C963.854 21.1898 963.286 20.9789 962.707 20.8044C962.074 20.5821 961.464 20.2981 960.886 19.9563C960.739 19.8843 960.599 19.7988 960.468 19.7008C960.242 19.5348 960.083 19.293 960.021 19.0195C959.992 18.8777 959.993 18.7316 960.023 18.59C960.053 18.4485 960.111 18.3145 960.195 18.1963C960.364 17.9605 960.618 17.8001 960.904 17.7492C961.007 17.7313 961.112 17.7242 961.216 17.7279C961.299 17.7206 961.381 17.7064 961.461 17.6853C961.713 17.5789 961.958 17.4476 962.214 17.3518C962.631 17.1916 963.064 17.0728 963.505 16.997C963.927 16.9189 964.343 16.816 964.758 16.7095C964.956 16.6563 965.148 16.5889 965.347 16.5357C965.697 16.4627 966.054 16.4247 966.411 16.4221C966.865 16.3937 967.313 16.337 967.763 16.2695C967.958 16.2376 968.154 16.2128 968.345 16.1773C968.388 16.0176 968.42 15.8544 968.466 15.7018C968.608 15.2405 968.771 14.7828 968.92 14.325C969.235 13.4255 969.602 12.5452 970.02 11.6886C970.307 11.0712 970.488 10.4076 970.73 9.77248C970.822 9.517 970.907 9.26151 970.996 9.00603C971.058 8.8405 971.134 8.6803 971.223 8.527C971.285 8.42519 971.364 8.3351 971.457 8.26087C971.6 8.13883 971.773 8.05574 971.957 8.01958C972.044 8.00257 972.132 7.9966 972.22 8.00184C972.327 8.01641 972.434 8.03655 972.539 8.06216L972.543 8.07281ZM974.214 19.2324C973.862 19.0999 973.55 18.8801 973.306 18.5937C972.924 18.0506 972.692 17.4168 972.632 16.7557C972.471 15.7658 972.245 14.7878 971.954 13.8283C971.879 13.5657 971.808 13.3067 971.741 13.0405V13.0831C971.333 13.999 970.978 14.9373 970.676 15.8934C970.542 16.2885 970.423 16.6859 970.322 17.0857C970.27 17.3033 970.168 17.5058 970.024 17.6766C969.88 17.8474 969.697 17.9817 969.491 18.0686C969.074 18.2203 968.641 18.3215 968.2 18.3702C967.53 18.4678 966.856 18.5317 966.181 18.5618H966.465C966.121 18.582 965.782 18.644 965.453 18.7463C965.191 18.8244 964.925 18.8918 964.662 18.9592C964.502 18.9982 964.343 19.0302 964.179 19.0621L964.431 19.1544C965.123 19.4771 965.834 19.7556 966.56 19.9882C967.025 20.084 967.486 20.1869 967.948 20.2969C968.2 20.3573 968.455 20.4105 968.704 20.4815C968.835 20.5134 968.959 20.5631 969.087 20.5986C969.296 20.634 969.505 20.6553 969.715 20.7121C969.834 20.7443 969.944 20.8025 970.038 20.8824C970.188 20.9941 970.31 21.1401 970.393 21.3082C970.434 21.4063 970.468 21.5071 970.495 21.6098C970.495 21.656 970.517 21.7021 970.527 21.7482C970.538 21.7944 970.605 21.9292 970.637 22.025C970.762 22.3885 970.846 22.7645 970.889 23.1463C970.971 23.9411 971.021 24.736 971.155 25.5237C971.223 25.8826 971.308 26.2379 971.411 26.5882C971.5 26.3789 971.588 26.1695 971.681 25.9601C971.957 25.325 972.227 24.6827 972.465 24.0298C972.703 23.3769 972.958 22.6708 973.146 21.9753C973.191 21.8448 973.262 21.7246 973.355 21.6222C973.448 21.5198 973.56 21.4371 973.685 21.3792L973.753 21.3473C973.808 21.3045 973.867 21.2676 973.93 21.2373C974.257 21.0754 974.606 20.963 974.966 20.9037C975.389 20.8328 975.811 20.7831 976.23 20.705L977.436 20.485C977.775 20.4323 978.11 20.36 978.44 20.2686L978.646 20.1869L978.522 20.1621C978.167 20.0911 977.848 20.0095 977.511 19.9315C977.308 19.896 977.103 19.8711 976.897 19.8499C976.58 19.8138 976.266 19.7581 975.956 19.6831C975.637 19.6086 975.321 19.5092 975.002 19.4276C974.74 19.3942 974.482 19.3336 974.232 19.2466L974.214 19.2324ZM968.743 16.0886H968.711H968.743ZM978.575 18.0047L978.657 18.0224L978.575 18.0047ZM981.439 20.7866L981.616 20.8257L981.435 20.7866H981.439ZM980.885 18.4908H980.8L980.605 18.4482L980.885 18.5086V18.4908Z"
				fill="inherit"
			/>
			<path
				d="M5.04881 23.0345C5.17865 22.8607 5.33892 22.7118 5.52186 22.595C5.91218 22.339 6.30855 22.0901 6.716 21.8683C7.66403 21.3231 8.63826 20.8313 9.62358 20.3495C10.1662 20.0855 10.7158 19.8326 11.2675 19.5877C11.2566 19.3532 11.2945 19.1191 11.3786 18.9L11.4724 18.6923C11.5461 18.5239 11.6207 18.3596 11.6843 18.1851C11.8361 17.7936 11.9652 17.3937 12.0709 16.9873L12.0961 16.8824C12.1637 16.587 12.2304 16.2875 12.3031 15.9951C12.3717 15.7723 12.4403 15.5323 12.5019 15.3155C12.5987 14.9745 12.7871 14.6666 13.0467 14.4253C13.2213 14.278 13.4318 14.1796 13.6568 14.1401C13.8219 14.1122 13.9909 14.1179 14.1537 14.1568C14.3166 14.1956 14.4699 14.2669 14.6047 14.3662C14.7688 14.4875 14.9032 14.6444 14.9978 14.8252C15.2049 15.1026 15.3851 15.3991 15.536 15.7107C15.6792 16.1019 15.799 16.5013 15.8947 16.9067C16.0892 17.4194 16.321 17.9173 16.588 18.3963C16.6807 18.5788 16.7926 18.7523 16.8742 18.9419L16.9044 19.0629C17.3239 19.1124 17.7494 19.1347 18.1669 19.1762C18.5843 19.2177 18.9574 19.2873 19.3507 19.352C19.7439 19.4166 20.1957 19.4753 20.6192 19.5581C21.0427 19.6409 21.5569 19.7267 22.0066 19.863C22.2564 19.9291 22.4824 20.0647 22.6584 20.254C22.8344 20.4434 22.9531 20.6787 23.0008 20.9327C23.0485 21.1867 23.0233 21.449 22.9281 21.6893C22.8329 21.9296 22.6715 22.1379 22.4627 22.2903C22.1106 22.5606 21.7191 22.7754 21.3019 22.9273C20.7966 23.152 20.2883 23.3817 19.7528 23.5883C19.2173 23.7949 18.6657 23.954 18.1191 24.1162C17.8569 24.1817 17.5987 24.2462 17.3406 24.3106L17.3214 24.3711C17.3002 24.4921 17.284 24.6162 17.2588 24.7382C17.2012 24.9882 17.1376 25.2312 17.071 25.4793C17.0035 25.8954 16.9039 26.3056 16.7732 26.7064C16.6259 27.1117 16.3969 27.4817 16.2404 27.885C16.2192 27.9978 16.1912 28.1093 16.1566 28.2188C16.0481 28.4579 15.8959 28.6747 15.7077 28.8579C15.5719 28.9746 15.4135 29.0621 15.2425 29.1151C15.0715 29.1682 14.8914 29.1855 14.7134 29.1662C14.4603 29.1419 14.2182 29.0513 14.0113 28.9036C13.8044 28.7559 13.64 28.5563 13.5348 28.3249C13.4726 28.1701 13.424 28.0102 13.3898 27.8469C13.3031 27.62 13.1983 27.4062 13.1157 27.1783C13.033 26.9503 12.9353 26.7305 12.8315 26.5036C12.7299 26.2407 12.6142 25.9835 12.4848 25.7331C12.4385 25.6504 12.3961 25.5667 12.3568 25.4779C11.9626 25.4949 11.5663 25.5039 11.1659 25.4967C10.5972 25.4845 10.0265 25.4299 9.45878 25.3873C8.89108 25.3448 8.20539 25.3103 7.58021 25.2608C7.28678 25.2355 6.99537 25.2182 6.70698 25.196C6.38733 25.169 6.07078 25.1132 5.76117 25.0293C5.52099 24.9626 5.30543 24.8274 5.14076 24.6402C4.97608 24.4531 4.86941 24.222 4.83375 23.9753C4.80352 23.8123 4.80747 23.6448 4.84536 23.4833C4.88325 23.3219 4.95424 23.1701 5.05385 23.0376L5.04881 23.0345ZM12.3569 21.8225C11.5864 22.1692 10.8118 22.534 10.0333 22.917C10.7008 22.9646 11.3643 23.0131 12.0339 23.0002C12.3542 22.9753 12.6757 22.968 12.9969 22.9783C13.3051 23.0108 13.5994 23.1242 13.8497 23.307C14.1001 23.4899 14.2976 23.7356 14.4224 24.0194C14.5 24.1757 14.5665 24.3391 14.6482 24.4944L14.7641 24.7183L14.8337 24.4309C14.8945 23.9681 15.0114 23.5143 15.182 23.0798C15.3053 22.7798 15.4991 22.5138 15.7469 22.3045C16.0572 22.0938 16.4084 21.9506 16.7776 21.8843C16.9753 21.835 17.181 21.7836 17.3746 21.7352C17.5117 21.701 17.6489 21.6667 17.778 21.6345L17.7245 21.6264C17.2546 21.5809 16.7857 21.5394 16.3199 21.4758C15.9267 21.4506 15.5467 21.324 15.2168 21.1084C14.896 20.8647 14.6799 20.5081 14.6121 20.111L14.5778 19.9738L14.5658 19.9254C14.5053 19.8034 14.4378 19.6874 14.3682 19.5462L14.0306 18.8977C13.9337 19.179 13.7935 19.4411 13.6906 19.7154C13.6657 19.9065 13.5951 20.0888 13.4847 20.2468C13.3678 20.4089 13.2144 20.5411 13.0369 20.6328C13.0447 20.8762 12.9811 21.1165 12.854 21.3241C12.7269 21.5317 12.5418 21.6976 12.3216 21.8013L12.3569 21.8225ZM12.0133 17.2202L12.0436 17.0841L12.0133 17.2202ZM13.737 19.6267L13.7309 19.6025L13.7108 19.5218L13.7087 19.6337L13.737 19.6267ZM14.7984 24.5983L14.8105 24.5439L14.7984 24.5983ZM14.4484 17.6878L14.4938 17.4922L14.4555 17.6646L14.4484 17.6878Z"
				fill="inherit"
			/>
			<path
				d="M41.2292 3.30114C42.1048 6.80773 36.6564 8.17783 35.7786 4.66215C34.9007 1.14648 40.3525 -0.209998 41.2292 3.30114Z"
				fill="inherit"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M16.7921 44.7605C16.7365 45.466 16.3661 46.1389 15.5521 46.3704C14.663 46.6231 13.5856 46.4832 12.5776 45.7684C11.5862 45.0653 10.9671 44.0232 10.682 42.9961C10.4304 42.0899 10.6837 41.3559 11.1861 40.9487C11.3661 40.8029 11.5699 40.7028 11.7846 40.6411C11.8408 40.6001 11.9013 40.5618 11.9663 40.5267C12.532 40.2217 13.201 40.2951 13.7038 40.4168C14.5118 40.6124 15.1386 41.1689 15.5055 41.5755C15.9011 42.0139 16.2202 42.5223 16.4396 43.0189C16.6516 43.4988 16.8417 44.1308 16.7921 44.7605Z"
				fill="inherit"
			/>
			<path
				d="M1109.11 460.035C1109.24 459.861 1109.4 459.712 1109.59 459.595C1109.98 459.339 1110.37 459.09 1110.78 458.868C1111.73 458.323 1112.7 457.831 1113.69 457.35C1114.23 457.086 1114.78 456.833 1115.33 456.588C1115.32 456.353 1115.36 456.119 1115.44 455.9L1115.54 455.692C1115.61 455.524 1115.68 455.36 1115.75 455.185C1115.9 454.794 1116.03 454.394 1116.13 453.987L1116.16 453.882C1116.23 453.587 1116.29 453.288 1116.37 452.995C1116.44 452.772 1116.5 452.532 1116.57 452.316C1116.66 451.975 1116.85 451.667 1117.11 451.425C1117.29 451.278 1117.5 451.18 1117.72 451.14C1117.89 451.112 1118.05 451.118 1118.22 451.157C1118.38 451.196 1118.53 451.267 1118.67 451.366C1118.83 451.487 1118.97 451.644 1119.06 451.825C1119.27 452.103 1119.45 452.399 1119.6 452.711C1119.74 453.102 1119.86 453.501 1119.96 453.907C1120.15 454.419 1120.38 454.917 1120.65 455.396C1120.74 455.579 1120.86 455.752 1120.94 455.942L1120.97 456.063C1121.39 456.112 1121.81 456.135 1122.23 456.176C1122.65 456.218 1123.02 456.287 1123.41 456.352C1123.81 456.417 1124.26 456.475 1124.68 456.558C1125.11 456.641 1125.62 456.727 1126.07 456.863C1126.32 456.929 1126.55 457.065 1126.72 457.254C1126.9 457.443 1127.02 457.679 1127.06 457.933C1127.11 458.187 1127.09 458.449 1126.99 458.689C1126.9 458.93 1126.74 459.138 1126.53 459.29C1126.17 459.561 1125.78 459.775 1125.37 459.927C1124.86 460.152 1124.35 460.382 1123.82 460.588C1123.28 460.795 1122.73 460.954 1122.18 461.116C1121.92 461.182 1121.66 461.246 1121.4 461.311L1121.39 461.371C1121.36 461.492 1121.35 461.616 1121.32 461.738C1121.27 461.988 1121.2 462.231 1121.13 462.479C1121.07 462.895 1120.97 463.306 1120.84 463.706C1120.69 464.112 1120.46 464.482 1120.3 464.885C1120.28 464.998 1120.26 465.109 1120.22 465.219C1120.11 465.458 1119.96 465.675 1119.77 465.858C1119.64 465.975 1119.48 466.062 1119.31 466.115C1119.14 466.168 1118.96 466.186 1118.78 466.166C1118.52 466.142 1118.28 466.051 1118.08 465.904C1117.87 465.756 1117.7 465.556 1117.6 465.325C1117.54 465.17 1117.49 465.01 1117.45 464.847C1117.37 464.62 1117.26 464.406 1117.18 464.178C1117.1 463.95 1117 463.73 1116.9 463.504C1116.79 463.241 1116.68 462.983 1116.55 462.733C1116.5 462.65 1116.46 462.567 1116.42 462.478C1116.03 462.495 1115.63 462.504 1115.23 462.497C1114.66 462.484 1114.09 462.43 1113.52 462.387C1112.96 462.345 1112.27 462.31 1111.64 462.261C1111.35 462.235 1111.06 462.218 1110.77 462.196C1110.45 462.169 1110.13 462.113 1109.83 462.029C1109.58 461.963 1109.37 461.827 1109.2 461.64C1109.04 461.453 1108.93 461.222 1108.9 460.975C1108.87 460.812 1108.87 460.645 1108.91 460.483C1108.95 460.322 1109.02 460.17 1109.12 460.038L1109.11 460.035ZM1116.42 458.823C1115.65 459.169 1114.88 459.534 1114.1 459.917C1114.76 459.965 1115.43 460.013 1116.1 460C1116.42 459.975 1116.74 459.968 1117.06 459.978C1117.37 460.011 1117.66 460.124 1117.91 460.307C1118.16 460.49 1118.36 460.736 1118.49 461.019C1118.56 461.176 1118.63 461.339 1118.71 461.494L1118.83 461.718L1118.9 461.431C1118.96 460.968 1119.08 460.514 1119.25 460.08C1119.37 459.78 1119.56 459.514 1119.81 459.305C1120.12 459.094 1120.47 458.951 1120.84 458.884C1121.04 458.835 1121.24 458.784 1121.44 458.735C1121.58 458.701 1121.71 458.667 1121.84 458.635L1121.79 458.626C1121.32 458.581 1120.85 458.539 1120.38 458.476C1119.99 458.451 1119.61 458.324 1119.28 458.108C1118.96 457.865 1118.74 457.508 1118.68 457.111L1118.64 456.974L1118.63 456.925C1118.57 456.803 1118.5 456.687 1118.43 456.546L1118.09 455.898C1118 456.179 1117.86 456.441 1117.75 456.715C1117.73 456.907 1117.66 457.089 1117.55 457.247C1117.43 457.409 1117.28 457.541 1117.1 457.633C1117.11 457.876 1117.05 458.116 1116.92 458.324C1116.79 458.532 1116.61 458.698 1116.39 458.801L1116.42 458.823ZM1116.08 454.22L1116.11 454.084L1116.08 454.22ZM1117.8 456.627L1117.79 456.602L1117.77 456.522L1117.77 456.634L1117.8 456.627ZM1118.86 461.598L1118.87 461.544L1118.86 461.598ZM1118.51 454.688L1118.56 454.492L1118.52 454.665L1118.51 454.688Z"
				fill="inherit"
			/>
			<path
				d="M1145.29 440.301C1146.17 443.808 1140.72 445.178 1139.84 441.662C1138.96 438.147 1144.42 436.79 1145.29 440.301Z"
				fill="inherit"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1120.86 481.761C1120.8 482.466 1120.43 483.139 1119.62 483.371C1118.73 483.623 1117.65 483.483 1116.64 482.769C1115.65 482.066 1115.03 481.023 1114.75 479.996C1114.49 479.09 1114.75 478.356 1115.25 477.949C1115.43 477.803 1115.63 477.703 1115.85 477.641C1115.9 477.6 1115.97 477.562 1116.03 477.527C1116.6 477.222 1117.26 477.295 1117.77 477.417C1118.58 477.613 1119.2 478.169 1119.57 478.576C1119.97 479.014 1120.28 479.523 1120.5 480.019C1120.72 480.499 1120.91 481.131 1120.86 481.761Z"
				fill="inherit"
			/>
		</svg>
	);
};
export const styles = {
	container: ({ palette, transitions }: Theme) =>
		css`
			position: fixed;
			inset: 0;
			z-index: 0;

			background-color: ${palette.secondary.main};
			transition: background-color ${transitions.duration.standard}ms;
		`,

	layer0: css`
		position: absolute;
		inset: 0;
		z-index: 1;
		background: url("/images/backdrop-sheer.svg") no-repeat center top;
		background-size: cover;
		z-index: 0;
	`,

	layer1: css`
		position: absolute;
		inset: 0;
		display: flex;
		z-index: 2;
		transform-origin: 50% 50%;
		z-index: 1;
	`,

	layer1Graphics: ({ palette }) =>
		css`
			margin: 0 auto;
			margin-top: 200px;

			path {
				fill: ${palette.primary.main};
			}
		`,

	layer2: css`
		position: absolute;
		inset: 0;
		display: flex;
		z-index: 2;
		transform-origin: 50% 50%;
		z-index: 2;
	`,

	layer2Graphics: css`
		margin: auto;
	`,
};
