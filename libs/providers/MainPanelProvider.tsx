import {
	createContext,
	memo,
	FC,
	SetStateAction,
	Dispatch,
	useState,
	useContext,
	PropsWithChildren,
} from "react";

interface MainPanelContextType {
	title: string;
	setTitle: Dispatch<SetStateAction<string>>;
}

const MainPanelContext = createContext<MainPanelContextType>(
	{} as MainPanelContextType
);

interface MainPanelProviderProps {
	defaultTitle: string;
}

const MainPanelProvider: FC<PropsWithChildren<MainPanelProviderProps>> = ({
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

export default memo(MainPanelProvider);

export const useMainPanel = (): MainPanelContextType => {
	return useContext(MainPanelContext);
};
