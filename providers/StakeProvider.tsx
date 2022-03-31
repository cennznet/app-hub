import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useState,
} from "react";
import { CENNZAsset, StakeAction, StakeAssets } from "@/types";

interface StakeContextType {
	stakingAsset: CENNZAsset;
	spendingAsset: CENNZAsset;

	stakeAction: StakeAction;
	setStakeAction: Dispatch<SetStateAction<StakeAction>>;
}

const StakeContext = createContext<StakeContextType>({} as StakeContextType);

interface StakeProviderProps {
	stakeAssets: StakeAssets;
}

const StakeProvider: FC<StakeProviderProps> = ({ children, stakeAssets }) => {
	const { stakingAsset, spendingAsset } = stakeAssets;
	const [stakeAction, setStakeAction] = useState<StakeAction>();

	return (
		<StakeContext.Provider
			value={{
				stakingAsset,
				spendingAsset,

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
