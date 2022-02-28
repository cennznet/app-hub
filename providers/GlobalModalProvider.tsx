import { useMemo } from "react";
import {
	createContext,
	PropsWithChildren,
	useCallback,
	useContext,
	useState,
} from "react";

import GlobalModal from "@/components/shared/GlobalModal";

type GlobalModalContent = {
	title: string;
	message: string | JSX.Element;
	buttonText?: string;
	disabled?: boolean;
	callback?: Function;
};

type GlobalModalContext = {
	showDialog: (content: GlobalModalContent) => Promise<void>;
	closeDialog: () => void;
};

const GlobalModalContext = createContext<GlobalModalContext>(
	{} as GlobalModalContext
);

type ProviderProps = {};

export default function GlobalModalProvider({
	children,
}: PropsWithChildren<ProviderProps>) {
	const [modalOpened, setModalOpened] = useState<boolean>(false);
	const onModalRequestClose = useCallback(() => {
		setModalOpened(false);
	}, []);

	const [content, setContent] = useState<GlobalModalContent>(
		{} as GlobalModalContent
	);

	const showDialog = useCallback(async (content) => {
		setContent({ ...content });
		setModalOpened(true);
	}, []);

	return (
		<>
			<GlobalModalContext.Provider
				value={{ showDialog, closeDialog: onModalRequestClose }}
			>
				{children}
			</GlobalModalContext.Provider>
			<GlobalModal
				isOpen={modalOpened}
				disableButton={content.disabled}
				setModalOpened={setModalOpened}
				title={content.title}
				message={content.message}
				buttonText={content.buttonText}
				callback={content.callback}
			/>
		</>
	);
}

export function useGlobalModal(): GlobalModalContext {
	return useContext(GlobalModalContext);
}
