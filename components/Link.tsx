import { IntrinsicElements } from "@/types";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { FC } from "react";

/* eslint-disable react/jsx-no-target-blank */
const Link: FC<IntrinsicElements["a"] & NextLinkProps> = ({
	className,
	href,
	children,
	...props
}) => {
	if (!href) href = "#";
	const internal = /^\/(?!\/)/.test(href) || (href && href.indexOf("#") === 0);

	if (!internal) {
		const nofollow = /lithoverse\.xyz/.test(href)
			? null
			: { rel: "nofollow noreferrer" };
		return (
			<a
				{...props}
				href={href}
				{...nofollow}
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

export default Link;
