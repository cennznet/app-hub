export const formatBalance = (balance) =>
	balance - Math.round(balance) !== 0 ? balance.toFixed(4) : balance;
