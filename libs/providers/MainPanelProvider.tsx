import type { PropsWithChildren } from "@/libs/types";

import {
	createContext,
	FC,
	SetStateAction,
	Dispatch,
	useState,
	useContext,
} from "react";

interface MainPanelContextType {
	title: string;
	setTitle: Dispatch<SetStateAction<string>>;
}

const MainPanelContext = createContext<MainPanelContextType>(
	{} as MainPanelContextType
);

interface MainPanelProviderProps extends PropsWithChildren {
	defaultTitle: string;
}

const MainPanelProvider: FC<MainPanelProviderProps> = ({
	children,
	defaultTitle,
}) => {
	const [title, setTitle] = useState<string>(defaultTitle);

	return (
		<MainPanelContext.Provider value={{ title, setTitle }}>
			{children}
		</MainPanelContext.Provider>
	);
};

export default MainPanelProvider;

export const useMainPanel = (): MainPanelContextType => {
	return useContext(MainPanelContext);
};
