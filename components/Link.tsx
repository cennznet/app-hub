import { IntrinsicElements } from "@/types";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { FC, memo } from "react";

/* eslint-disable react/jsx-no-target-blank */
const Link: FC<IntrinsicElements["a"] & NextLinkProps> = ({
	href,
	children,
	...props
}) => {
	if (!href) href = "#";
	const internal = /^\/(?!\/)/.test(href) || (href && href.indexOf("#") === 0);

	if (!internal) {
		const nofollow = /app\.cennz\.net/.test(href)
			? null
			: { rel: "nofollow noreferrer" };
		return (
			<a
				{...props}
				{...nofollow}
				href={href}
				target={href.indexOf("mailto:") === 0 ? "_self" : "_blank"}
			>
				{children}
			</a>
		);
	}

	return (
		<NextLink href={href} passHref>
			<a {...props}>{children}</a>
		</NextLink>
	);
};

export default memo(Link);
