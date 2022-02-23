export const formatBalance = (balance: number): string => {
	return balance - Math.round(balance) !== 0
		? balance <= 0.00001
			? "<0.00001"
			: balance.toFixed(4)
		: String(balance);
};
