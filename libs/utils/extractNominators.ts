import { Nominations, Option, Result, StorageKey } from "@/libs/types";

export default function extractNominators(
	nominations: [StorageKey, Option<Nominations>][]
): Result {
	return nominations.reduce((mapped: Result, [key, optNoms]) => {
		if (optNoms.isSome && key.args.length) {
			const nominatorId = key.args[0].toString();
			const { submittedIn, targets } = optNoms.unwrap();

			targets.forEach((_validatorId, index): void => {
				const validatorId = _validatorId.toString();
				const info = { index: index + 1, nominatorId, submittedIn };

				if (!mapped[validatorId]) {
					mapped[validatorId] = [info];
				} else {
					mapped[validatorId].push(info);
				}
			});
		}

		return mapped;
	}, {});
}
