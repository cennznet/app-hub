import type { PropsWithChildren } from "@/libs/types";
import type { IBrowser, IOS, IDevice } from "ua-parser-js";

import { FC, createContext, useContext, useEffect, useState } from "react";

type AgentContext = {
	browser: IBrowser;
	os: IOS;
	device: IDevice;
};
const UserAgentContext = createContext<AgentContext>({} as AgentContext);

interface ProviderProps extends PropsWithChildren {
	value?: string;
}

const UserAgentProvider: FC<ProviderProps> = ({ children, value }) => {
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

export default UserAgentProvider;

export function useUserAgent(): AgentContext {
	return useContext(UserAgentContext);
}
