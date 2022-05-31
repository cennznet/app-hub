import { FC, useDeferredValue, useLayoutEffect, useState } from "react";
import { css } from "@emotion/react";
import dynamic from "next/dynamic";
import type { IdentityProps } from "@polkadot/react-identicon/types";

const Identicon = dynamic(() => import("@polkadot/react-identicon"), {
	ssr: false,
});

interface Props extends IdentityProps {
	fadeOnChange?: boolean;
}

const AccountIdenticon: FC<Props> = ({ value, fadeOnChange, ...props }) => {
	const [visible, setVisible] = useState<boolean>(false);
	const address = useDeferredValue(value);

	useLayoutEffect(() => {
		if (!address || !fadeOnChange) return;
		setVisible(false);
		setTimeout(() => setVisible(true), 200);
	}, [address, fadeOnChange]);

	return (
		<Identicon
			css={styles.iconContainer(fadeOnChange, visible)}
			value={value}
			{...props}
		/>
	);
};

export default AccountIdenticon;

export const styles = {
	iconContainer: (fadeOnChange: boolean, visible: boolean) => css`
		opacity: ${!fadeOnChange ? 1 : visible ? 1 : 0};
		transition: opacity 0.2s;
	`,
};
