import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useState,
} from "react";
import { CENNZAsset, StakeAction } from "@/types";

interface StakeContextType {
	stakeAsset: CENNZAsset;

	stakeAction: StakeAction;
	setStakeAction: Dispatch<SetStateAction<StakeAction>>;
}

const StakeContext = createContext<StakeContextType>({} as StakeContextType);

interface StakeProviderProps {
	stakeAsset: CENNZAsset;
}

const StakeProvider: FC<StakeProviderProps> = ({ children, stakeAsset }) => {
	const [stakeAction, setStakeAction] = useState<StakeAction>();

	return (
		<StakeContext.Provider
			value={{
				stakeAsset,
				stakeAction,
				setStakeAction,
			}}
		>
			{children}
		</StakeContext.Provider>
	);
};

export default StakeProvider;

export const useStake = (): StakeContextType => {
	return useContext(StakeContext);
};
