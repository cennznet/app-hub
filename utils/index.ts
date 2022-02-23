export const formatBalance = (balance: number): string => {
	if (balance === 0 || !balance) return "";
	return balance - Math.round(balance) !== 0
		? balance <= 0.00001
			? "<0.00001"
			: balance.toFixed(4)
		: String(balance);
};
