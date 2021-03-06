import type { PropsWithChildren } from "@/libs/types";

import { createContext, useCallback, useContext, useState, FC } from "react";
import { GlobalModal } from "@/libs/components";

type GlobalModalContent = {
	title: string;
	message: string | JSX.Element;
	actions?: string | JSX.Element;
	buttonText?: string;
	link?: string;
	disabled?: boolean;
	callback?: Function;
	loading?: boolean;
};

type GlobalModalContext = {
	showDialog: (content: GlobalModalContent) => Promise<void>;
	closeDialog: () => void;
};

const GlobalModalContext = createContext<GlobalModalContext>(
	{} as GlobalModalContext
);

interface GlobalModalProviderProps extends PropsWithChildren {}

const GlobalModalProvider: FC<GlobalModalProviderProps> = ({ children }) => {
	const [modalOpened, setModalOpened] = useState<{ resolve: () => void }>();
	const onModalRequestClose = useCallback(() => {
		setModalOpened((previous) => {
			previous?.resolve?.();
			return null;
		});
	}, []);

	const [content, setContent] = useState<GlobalModalContent>(
		{} as GlobalModalContent
	);

	const showDialog = useCallback(async (content) => {
		setContent(content);
		return new Promise<void>((resolve) => {
			setModalOpened({ resolve });
		});
	}, []);

	return (
		<>
			<GlobalModalContext.Provider
				value={{ showDialog, closeDialog: onModalRequestClose }}
			>
				{children}
			</GlobalModalContext.Provider>
			<GlobalModal
				isOpen={!!modalOpened}
				// disableButton={content.disabled}
				onRequestClose={onModalRequestClose}
				shouldCloseOnEsc={true}
				{...content}
				// buttonLink={content.link}
				// buttonText={content.buttonText}
				// callback={content.callback}
				// loading={content.loading}
			/>
		</>
	);
};

export default GlobalModalProvider;

export function useGlobalModal(): GlobalModalContext {
	return useContext(GlobalModalContext);
}
