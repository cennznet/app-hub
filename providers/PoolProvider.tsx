import { CENNZAsset, PoolAction } from "@/types";
import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useState,
} from "react";

interface PoolContextType {
	poolAction: PoolAction;
	setPoolAction: Dispatch<SetStateAction<PoolAction>>;
}

const PoolContext = createContext<PoolContextType>({} as PoolContextType);

interface PoolProviderProps {
	supportedAssets: CENNZAsset[];
}

const PoolProvider: FC<PoolProviderProps> = ({ supportedAssets, children }) => {
	const [poolAction, setPoolAction] = useState<PoolAction>("Add");

	return (
		<PoolContext.Provider value={{ poolAction, setPoolAction }}>
			{children}
		</PoolContext.Provider>
	);
};

export default PoolProvider;

export const usePool = (): PoolContextType => {
	return useContext(PoolContext);
};
