import {
	FC,
	memo,
	createContext,
	useContext,
	useEffect,
	useState,
	PropsWithChildren,
} from "react";
import type { IBrowser, IOS, IDevice } from "ua-parser-js";

type AgentContext = {
	browser: IBrowser;
	os: IOS;
	device: IDevice;
};
const UserAgentContext = createContext<AgentContext>({} as AgentContext);

type ProviderProps = {
	value?: string;
};

const UserAgentProvider: FC<PropsWithChildren<ProviderProps>> = ({
	children,
	value,
}) => {
	const [userAgent, setUserAgent] = useState<AgentContext>({} as AgentContext);

	useEffect(() => {
		import("ua-parser-js").then(({ default: UAParser }) => {
			const instance = new UAParser(value);
			setUserAgent({
				browser: instance.getBrowser(),
				device: instance.getDevice(),
				os: instance.getOS(),
			});
		});
	}, [value]);

	return (
		<UserAgentContext.Provider value={userAgent}>
			{children}
		</UserAgentContext.Provider>
	);
};

export default memo(UserAgentProvider);

export function useUserAgent(): AgentContext {
	return useContext(UserAgentContext);
}