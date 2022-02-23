export const formatBalance = (balance: number): string => {
	if (balance === 0 || !balance) return "";
	return balance <= 0.00001 ? "<0.00001" : balance.toFixed(4);
};
