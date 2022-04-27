# CHANGELOG

## [Unreleased]

## [1.1.0] - 2022-04-28

- Update UI when transaction is in progress [#156](https://github.com/cennznet/app-hub/pull/156)
- Update UI/UX for historical withdrawals [#171](https://github.com/cennznet/app-hub/pull/171)
- Ask user to confirm before exiting if there is a transaction pending [#173](https://github.com/cennznet/app-hub/pull/173)

## [1.0.2] - 2022-04-01

- Add confirming state to the Bridge [#151](https://github.com/cennznet/app-hub/pull/151)
- Add a generic missing token [#149](https://github.com/cennznet/app-hub/pull/149)

## [1.0.1] - 2022-03-31

- Update correct icons for CENNZnet
- Take into account of staking lock amount when retrieving user balance
- Avoid checking `ethBridge.bridgePaused` status when it's Deposit
- Explicitly using `assetId` to check if it's CPAY
- Move BRIDGE / PEG contract address to `constants.ts`
- Add default timeout value to be 1000 instead of zero
- Use `sellAsset` extrinsic instead
- Update Slippage in Swap to target the receiving token
- Add ">=" or "<=" to Slippage in Swap and Pool

## [1.0.0] - 2022-03-30

- Initial release of the App Hub
