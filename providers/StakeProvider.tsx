import {
	createContext,
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useEffect,
	useState,
} from "react";
import { CENNZAsset, StakeAction, ElectionInfo } from "@/types";
import { useCENNZApi } from "@/providers/CENNZApiProvider";

interface StakeContextType {
	stakeAsset: CENNZAsset;

	stakeAction: StakeAction;
	setStakeAction: Dispatch<SetStateAction<StakeAction>>;

	electionInfo: ElectionInfo;
}

const StakeContext = createContext<StakeContextType>({} as StakeContextType);

interface StakeProviderProps {
	stakeAsset: CENNZAsset;
}

const StakeProvider: FC<StakeProviderProps> = ({ children, stakeAsset }) => {
	const { api } = useCENNZApi();
	const [stakeAction, setStakeAction] = useState<StakeAction>();
	const [electionInfo, setElectionInfo] = useState<ElectionInfo>();

	useEffect(() => {
		if (!api) return;

		const fetchElectionInfo = async () => {
			const [elected, waiting] = await Promise.all([
				api.derive.stakingCennznet.electedInfo,
				api.derive.stakingCennznet.waitingInfo,
			]);

			setElectionInfo({ elected: await elected(), waiting: await waiting() });
		};

		void fetchElectionInfo();
	}, [api]);

	return (
		<StakeContext.Provider
			value={{
				stakeAsset,

				stakeAction,
				setStakeAction,

				electionInfo,
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
