import { IntrinsicElements } from "@/types";
import { css } from "@emotion/react";
import { FC, useCallback, useEffect, useState } from "react";
import SubmitButton from "@/components/shared/SubmitButton";
import { Theme } from "@mui/material";
import { usePool } from "@/providers/PoolProvider";
import { useCENNZApi } from "@/providers/CENNZApiProvider";

interface PoolFormProps {}

const PoolForm: FC<IntrinsicElements["form"] & PoolFormProps> = ({
	children,
	...props
}) => {
	const { api } = useCENNZApi();
	const [buttonLabel, setButtonLabel] = useState<string>("Add to Pool");
	const { poolAction } = usePool();

	useEffect(() => {
		if (poolAction === "Add") return setButtonLabel("Add to Pool");
		if (poolAction === "Remove") return setButtonLabel("Withdraw from Pool");
	}, [poolAction]);

	const onFormSubmit = useCallback(
		(event) => {
			event.preventDefault();

			if (!api) return;

			console.log("onFormSubmit");
		},
		[api]
	);

	return (
		<form {...props} css={styles.root} onSubmit={onFormSubmit}>
			{children}

			<div css={styles.formSubmit}>
				<SubmitButton requireCENNZnet={true} requireMetaMask={false}>
					{buttonLabel}
				</SubmitButton>
			</div>
		</form>
	);
};

export default PoolForm;

const styles = {
	root: css`
		width: 100%;
		position: relative;
	`,

	formSubmit: ({ palette }: Theme) => css`
		text-align: center;
		border-top: 1px solid ${palette.divider};
		padding-top: 2em;
		margin: 2em -2.5em 0;
	`,
};
