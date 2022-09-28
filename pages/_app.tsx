import { ethers, utils } from 'ethers';
import React, { useEffect, useState } from 'react';
import {ApiPromise, WsProvider} from '@polkadot/api';
import {cvmToAddress} from "@cennznet/types/utils";
// import ethUtil from 'ethereumjs-util';
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
import {ExtrinsicPayloadValue, GenericExtrinsicPayloadV4} from '@polkadot/types';
import {IMMORTAL_ERA} from "@polkadot/types/extrinsic/constants";

function App() {
	let ethereum;
	if (typeof global.ethereum !== "undefined" ) {
		// Existing code goes here
		ethereum = global.ethereum;
	}
	// A Web3Provider wraps a standard Web3 provider, which is
	// what Metamask injects as window.ethereum into each page
	const [cennznet, setCennznet] = useState();
	const [cennznetAddress, setCennznetAddress] = useState();
	const [cpayBalance, setCpayBalance] = useState();
	const [cennzBalance, setCennzBalance] = useState();
	const [account, setAccount] = useState();
	const [signature, setSignature] = useState();
	// The Metamask plugin also allows signing transactions to
	// send ether and pay to change state within the blockchain.
	// For this, you need the account signer...

	useEffect(async () => {
		const provider = new WsProvider('ws://127.0.0.1:9944/');
		let cennznet_ = await ApiPromise
			.create({
				provider,
				// provider: process.env.NEXT_PUBLIC_API_URL,
				rpc: {
					ethy: {
						getXrplTxProof: {
							description: "Get event proof for event Id",
							params: [
								{
									name: "EventId",
									type: "EthyEventId",
								},
							],
							type: "Json",
						},
					},
				},
				types: {
					VersionedEventProof: {
						_enum: {
							sentinel: null,
							EventProof: "EventProof",
						},
					},
					EthyId: "[u8; 32]",
					EthyEventId: "u64",
					EthWalletCall: {
						// call: 'Call',
						nonce: 'u32',
					},
					AccountId: 'EthereumAccountId',
					AccountId20: 'EthereumAccountId',
					AccountId32: 'EthereumAccountId',
					Address: 'AccountId',
					LookupSource: 'AccountId',
					Lookup0: 'AccountId',
				},
			});
		await cennznet_.isReady;
		setCennznet(cennznet_);
		console.log('cennznet connected');
	}, []);

	useEffect(async () => {
		if(!cennznetAddress) return;
		// let cpayBalance_ = await cennznet.query.genericAsset.freeBalance(16001, cennznetAddress);
		// let cennzBalance_ = await cennznet.query.genericAsset.freeBalance(16000, cennznetAddress);
		// let cb1 = cennzBalance_.toString().slice(0, -4);
		// let cb2 = cennzBalance_.toString().slice(-4);
		// setCennzBalance(`${cb1}.${cb2}`);
		// let cp1 = cpayBalance_.toString().slice(0, -4);
		// let cp2 = cpayBalance_.toString().slice(-4);
		// setCpayBalance(`${cp1}.${cp2}`);

	}, [cennznetAddress]);

	function connectMetamask() {
		ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
			const cennznetaddress = cvmToAddress(accounts[0]);
			console.log('cennznetaddress:',cennznetaddress);
			setAccount(accounts[0]);
		})
	}


	function makeSignOptions(api, partialOptions, extras) {
		const a = objectSpread({
			blockHash: api.genesisHash,
			genesisHash: api.genesisHash
		}, partialOptions, extras, {
			runtimeVersion: api.runtimeVersion,
			signedExtensions: api.registry.signedExtensions,
			version: api.extrinsicType
		});
		console.log('*****:::',a);
		// console.log('*****:::',a.toJSON());
		return a;
	}

	function makeEraOptions(api, partialOptions, _ref) {
		let {
			header,
			mortalLength,
			nonce
		} = _ref;
		console.log('header::::', header);
		console.log('mortalLength:::::',mortalLength);
		console.log('nonce:::',nonce);

		if (!header) {
			if (partialOptions.era && !partialOptions.blockHash) {
				throw new Error('Expected blockHash to be passed alongside non-immortal era options');
			}

			if (isNumber(partialOptions.era)) {
				// since we have no header, it is immortal, remove any option overrides
				// so we only supply the genesisHash and no era to the construction
				delete partialOptions.era;
				delete partialOptions.blockHash;
			}

			return makeSignOptions(api, partialOptions, {
				nonce
			});
		}

		return makeSignOptions(api, partialOptions, {
			blockHash: header.hash,
			era: api.registry.createTypeUnsafe('ExtrinsicEra', [{
				current: header.number,
				period: partialOptions.era || mortalLength
			}]),
			nonce
		});
	}

	const signMessage = async () => {
		let address = account;
		console.log(`got address: ${address}`);
		const dest = '0xFf64d3F6efE2317EE2807d223a0Bdc4c0c49dfDB';
		const call = await  cennznet.tx.balances.transfer(dest, 17);
		const signingInfo = await cennznet.derive.tx.signingInfo(address, undefined, undefined);
		const eraOptions = makeEraOptions(cennznet,  {}, signingInfo);
		const { era, runtimeVersion: { specVersion, transactionVersion } } = eraOptions;
		let payload = (new GenericExtrinsicPayloadV4(cennznet.registry, objectSpread<ExtrinsicPayloadValue>({}, eraOptions, {
			era: era || IMMORTAL_ERA,
			method: call.toHex(),
			specVersion,
			transactionVersion
		})));
		console.log('payload:::', payload.toHuman());
		console.log('payload::',payload.toJSON());
		const payloadU8 = payload.toU8a({ method: true });
		console.log('payloadU8::',payloadU8);
		// console.log('hex payload::', u8aToHex(payloadU8));
		const hashed = (payloadU8.length > (256 + 1) * 2)
			? blake2AsHex(payloadU8)
			: u8aToHex(payloadU8);
		// Request signature from ethereum wallet
		// const signature = await ethereum.request({ method: 'eth_sign', params: [address, hashed] });
		const signature = await ethereum.request({ method: 'personal_sign', params: [hashed, address] });
		console.log('Signature::', signature);
		call.addSignature(address, signature, payload);
		console.log('Call now :::', call.toHuman());
		call.send();

	};

	return (
		<div className="App" style={{ fontFamily: 'helvetica neue', textAlign: 'center', justifyContent: 'center', alignContent: 'center' }}>
			<header className="App-header">
				<h1>CENNZnet/Metamask Demo 🦊</h1>
			</header>
			<div style={{ borderRadius: '16px', border: '1px black solid', overflow: 'hidden', padding: '1em'}}>
				<p>Ethereum Address: {account}</p>
				<p>CENNZnet address: {cennznetAddress}</p>
				<p>CPAY balance: {cpayBalance}</p>
				<p>CENNZ balance: {cennzBalance}</p>
				<p>signature: {signature}</p>

				<button style={{ cursor: 'pointer', height: '3em', padding: '0.5em', margin: '0.2em' }} onClick={() => connectMetamask()}>Connect</button>
				<button style={{ cursor: 'pointer', height: '3em', padding: '0.5em', margin: '0.2em' }}onClick={() => signMessage()}>Full Send!</button>
			</div>
		</div>
	);
}

export default App;
