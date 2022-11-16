import {Contract, ethers, utils, Wallet} from 'ethers';
import React, { useEffect, useState } from 'react';
import {ApiPromise, WsProvider} from '@polkadot/api';
import {cvmToAddress} from "@cennznet/types/utils";
// import ethUtil from 'ethereumjs-util';
import { JsonRpcProvider } from "@ethersproject/providers";
import {
	hexToString,
	hexToU8a,
	isNumber,
	objectSpread,
	stringToHex,
	stringToU8a,
	u8aToHex,
	u8aToString
} from '@polkadot/util';
import {base64Decode, base64Encode, blake2AsHex} from '@polkadot/util-crypto';
import {encodeAddress, Keyring} from '@polkadot/keyring';
// import {ExtrinsicPayloadValue, GenericExtrinsicPayloadV4} from '@polkadot/types';
import {IMMORTAL_ERA} from "@polkadot/types/extrinsic/constants";
import { toChecksumAddress } from 'ethereumjs-util';

function App() {
	let ethereum;
	if (typeof global.ethereum !== "undefined" ) {
		// Existing code goes here
		ethereum = global.ethereum;
	}
	// A Web3Provider wraps a standard Web3 provider, which is
	// what Metamask injects as window.ethereum into each page
	const [api, setApi] = useState<any>();
	const [gas, setGas] = useState<any>();
	const [gasXRP, setGasXRP] = useState<any>();
	const [gasSYLO, setGasSYLO] = useState<any>();
	const [gasXRP1, setGasXRP1] = useState<any>();
	const [txReceipt, setTxReceipt] = useState<any>();


	const [account, setAccount] = useState();

	const [web3Provider, setWeb3Provider] = useState(null);
	const [metamaskProvider, setMetamaskProvider] = useState(null);
	const [contract, setContract] = useState(null);
	const ALICE_PRIVATE_KEY = '0xcb6df9de1efca7a3998a8ead4e02159d5fa99c3e0d4fd6432667390bb4726854';
	const BOB_PRIVATE_KEY = '0x79c3b7fc0b7697b9414cb87adcb37317d1cab32818ae18c0e97ad76395d1fdcf';
	const FERDIE_PRIVATE_KEY = '0x1a02e99b89e0f7d3488d53ded5a3ef2cff6046543fc7f734206e3e842089e051';

	const NATIVE_TOKEN_ID = 2;
	const FEE_TOKEN_ID = 1124;
	const SYLO_TOKEN_ID = 3172;
	const ERC20_ABI = [
		'event Transfer(address indexed from, address indexed to, uint256 value)',
		'event Approval(address indexed owner, address indexed spender, uint256 value)',
		'function approve(address spender, uint256 amount) public returns (bool)',
		'function allowance(address owner, address spender) public view returns (uint256)',
		'function balanceOf(address who) public view returns (uint256)',
		'function name() public view returns (string memory)',
		'function symbol() public view returns (string memory)',
		'function decimals() public view returns (uint8)',
		'function transfer(address who, uint256 amount)',
	];
	const FEE_PROXY_ADDRESS = '0x00000000000000000000000000000000000004bb';

	const FEE_PROXY_ABI = [
		'function callWithFeePreferences(address asset, uint128 maxPayment, address target, bytes input)',
	];


	// useEffect(async () => {
	async function signMessage() {
		const metamaskProvider = new ethers.providers.Web3Provider(window.ethereum);
		setMetamaskProvider(metamaskProvider);
		const { api, alice, bob, bobSigner, xrpToken, feeToken } = await connect();

		// get initial token balances
		const [xrpBalance, tokenBalance] = await Promise.all([ xrpToken.balanceOf(bob.address), feeToken.balanceOf(bob.address) ]);
		// call `transfer` on erc20 token - via `callWithFeePreferences` precompile function
		let iface = new utils.Interface(ERC20_ABI);
		const contractAddress = feeToken.address;
		const transferInput = iface.encodeFunctionData("transfer", [alice.address, 1 ]);

		const maxFeePaymentInToken = utils.parseEther('2'); // 10e18 // max 2 sylo tokens
		const feeProxy = new Contract(FEE_PROXY_ADDRESS, FEE_PROXY_ABI, bobSigner);

		const feeData = await bobSigner.provider.getFeeData();
		console.log('*********************');
		console.log('Fee data::', feeData);
		console.log('feeData:', {
			gasPrice: feeData.gasPrice?.toNumber(),
			maxFeePerGas: feeData.maxFeePerGas?.toNumber(),
			lastBaseFeePerGas: feeData?.lastBaseFeePerGas?.toNumber(),
			maxPriorityFeePerGas: feeData.maxPriorityFeePerGas?.toNumber(),
		});

		// sign and send feeProxy transaction with custom nonce and gas limit
		const gas = await feeProxy.connect(bobSigner).estimateGas
			.callWithFeePreferences(feeToken.address, maxFeePaymentInToken, contractAddress, transferInput);
		console.log('estimated gas used by tx:', gas.toNumber());
		setGas(gas.toNumber());
		const xrpGasCost = gas.mul(feeData.gasPrice!);
		const xrpGasCostScaled = utils.formatEther(xrpGasCost.toString());
		console.log(`estimated gas (XRP): ${xrpGasCost.div(10 ** 12)} = ${xrpGasCostScaled} (actual)`); // 6 decimals
		setGasXRP(`${xrpGasCostScaled}`)
		const { Ok: [ syloCost, _ ] } = await (api.rpc as any).dex.getAmountsIn(xrpGasCost.div(10 ** 12).toNumber(), [SYLO_TOKEN_ID, NATIVE_TOKEN_ID]);
		console.log(`estimated gas (SYLO): ${syloCost} = ${utils.formatEther(syloCost.toString())} (actual)`); // 18 decimals
		setGasSYLO(`${utils.formatEther(syloCost.toString())}`);
		 const metamaskContract = new ethers.Contract(FEE_PROXY_ADDRESS, FEE_PROXY_ABI, metamaskProvider.getSigner());
		// call `callWithFeePreferences` on fee proxy
		const tx = await metamaskContract
			.callWithFeePreferences(feeToken.address, maxFeePaymentInToken, contractAddress, transferInput, {
				gasLimit: gas,
				gasPrice: feeData.gasPrice,
			});
		const receipt = await tx.wait();
		setTxReceipt(receipt);
		const actualCost = receipt.gasUsed?.mul(receipt.effectiveGasPrice);
		console.log('actual gas (XRP): ', actualCost.div(10 ** 12).toString()); // 6dp
		setGasXRP1(`${actualCost.div(10 ** 12).toString()}`)
		// check updated balances
		const [xrpBalanceUpdated, tokenBalanceUpdated] = await Promise.all([
			xrpToken.balanceOf(bob.address),
			feeToken.balanceOf(bob.address),
		]);
		console.table({
			xrpBalanceUpdated: { ...xrpBalanceUpdated, num: xrpBalanceUpdated.toString() },
			tokenBalanceUpdated: { ...tokenBalanceUpdated, num: tokenBalanceUpdated.toString() },
		});

		const tokenBalanceDifference = tokenBalanceUpdated.sub(tokenBalance).toString();
		console.log(`XRP balance difference: ${xrpBalanceUpdated.sub(xrpBalance).toString()}`); // should be 0
		console.log(`Token balance difference: ${tokenBalanceDifference} = ${utils.formatEther(tokenBalanceDifference)} (actual)`);

	}


	function connectMetamask() {
		ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
			setAccount(accounts[0]);
		})
	}

	async function connect() {

		const rpc = {
			dex: {
				quote: {
					description: "Returns the amount of output token that can be obtained by swapping an amount of input token",
					params: [
						{
							name: "amountIn",
							type: "u128",
						},
						{
							name: "reserveIn",
							type: "u128",
						},
						{
							name: "reserveOut",
							type: "u128",
						},
					],
					type: "Json",
				},
				getAmountsOut: {
					description: "Returns the amount of output tokens that can be obtained by swapping an amount of inputs token",
					params: [
						{
							name: "amountIn",
							type: "Balance",
						},
						{
							name: "path",
							type: "Vec<AssetId>",
						},
					],
					type: "Json",
				},
				getAmountsIn: {
					description: "Returns the amount of input tokens that can be obtained by swapping an amount of output token",
					params: [
						{
							name: "amountOut",
							type: "Balance",
						},
						{
							name: "path",
							type: "Vec<AssetId>",
						},
					],
					type: "Json",
				},
			},
		};
		// Setup providers for jsonRPCs and WS
		const jsonProvider = new JsonRpcProvider(`https://porcini.au.rootnet.app/`);
		const wsProvider = new WsProvider(`wss://porcini.au.rootnet.app/ws/`);
		const api = await ApiPromise.create({ provider: wsProvider, types: { AccountId: 'EthereumAccountId',
				AccountId20: 'EthereumAccountId',
				AccountId32: 'EthereumAccountId',
				Address: 'AccountId',
				LookupSource: 'AccountId',
				Lookup0: 'AccountId',
				EthereumSignature: {
					r: 'H256',
					s: 'H256',
					v: 'U8'
				},
				ExtrinsicSignature: 'EthereumSignature',
				SessionKeys: '([u8; 32], [u8; 32])'}, rpc });
		setApi(api);

		const keyring = new Keyring({ type: 'ethereum' });

		const alice = keyring.addFromSeed(hexToU8a(ALICE_PRIVATE_KEY));
		const bob = keyring.addFromSeed(hexToU8a(BOB_PRIVATE_KEY));
		const bobSigner = new Wallet(BOB_PRIVATE_KEY).connect(jsonProvider); // 'development' seed

		const xrpTokenAddress = assetIdToERC20ContractAddress(NATIVE_TOKEN_ID);
		const xrpToken = new Contract(xrpTokenAddress, ERC20_ABI, bobSigner);

		const feeToken = new Contract(assetIdToERC20ContractAddress(SYLO_TOKEN_ID), ERC20_ABI, bobSigner);

		return { api, alice, bob, bobSigner, xrpToken, feeToken };
	}

	const assetIdToERC20ContractAddress = (assetId: string | Number): string => {
		const asset_id_hex = (+assetId).toString(16).padStart(8, '0');
		return toChecksumAddress(`0xCCCCCCCC${asset_id_hex}000000000000000000000000`);
	}


	return (
		<div className="App" style={{ fontFamily: 'helvetica neue', textAlign: 'center', justifyContent: 'center', alignContent: 'center' }}>
			<header className="App-header">
				<h1>ROOTnet/Metamask Demo 🦊</h1>
			</header>
			<div style={{ borderRadius: '16px', border: '1px black solid', overflow: 'hidden', padding: '1em'}}>
				<p>Ethereum Address: {account}</p>
				<p>Gas used by Tx: {gas}</p>
				<p>Estimated gas (XRP): {gasXRP}</p>
				<p>Estimated gas (SYLO): {gasSYLO}</p>

				<p>Actual gas (XRP): {gasXRP1}</p>
				<p>Tx receipt: {txReceipt}</p>

				<button style={{ cursor: 'pointer', height: '3em', padding: '0.5em', margin: '0.2em' }} onClick={() => connectMetamask()}>Connect</button>
				<button style={{ cursor: 'pointer', height: '3em', padding: '0.5em', margin: '0.2em' }}onClick={() => signMessage()}>Tranfer (fee preference)!</button>
			</div>
		</div>
	);
}

export default App;
