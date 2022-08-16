import { ethers, utils } from 'ethers';
import React, { useEffect, useState } from 'react';
import { Api } from '@cennznet/api';
import {cvmToAddress} from "@cennznet/types/utils";
// import ethUtil from 'ethereumjs-util';
import {hexToString, hexToU8a, stringToHex, stringToU8a, u8aToHex, u8aToString} from '@polkadot/util';
import {base64Decode, base64Encode, blake2AsHex} from '@polkadot/util-crypto';
import {encodeAddress} from '@polkadot/keyring';

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
		const rpc = {
			ethWallet: {
				addressNonce: {
					params: [
						{
							name: 'ethAddress',
							type: '[u8; 20]'
						}
					],
					type: 'u32'
				}
			}
		};
		let types = {
			ethWalletCall: {
				call: 'Call',
				nonce: 'u32',
			}
		};

		let cennznet_ = await Api
			.create({
				provider: "ws://localhost:9944",//process.env.NEXT_PUBLIC_API_URL,
				rpc,
				types: {
					ethWalletCall: {
						call: 'Call',
						nonce: 'Index',
					}
				}
			});
		await cennznet_.isReady;
		setCennznet(cennznet_);
		console.log('cennznet connected');
	}, []);

	useEffect(async () => {
		if(!cennznetAddress) return;
		let cpayBalance_ = await cennznet.query.genericAsset.freeBalance(16001, cennznetAddress);
		let cennzBalance_ = await cennznet.query.genericAsset.freeBalance(16000, cennznetAddress);
		let cb1 = cennzBalance_.toString().slice(0, -4);
		let cb2 = cennzBalance_.toString().slice(-4);
		setCennzBalance(`${cb1}.${cb2}`);
		let cp1 = cpayBalance_.toString().slice(0, -4);
		let cp2 = cpayBalance_.toString().slice(-4);
		setCpayBalance(`${cp1}.${cp2}`);

	}, [cennznetAddress]);

	function connectMetamask() {
		ethereum.request({ method: 'eth_requestAccounts' }).then((accounts) => {
			const cennznetaddress = cvmToAddress(accounts[0]);
			console.log('cennznetaddress:',cennznetaddress);
			setAccount(accounts[0]);
		})
	}

	const signMessage = async () => {
		let address = account;
		console.log(`got address: ${address}`);
		const cennznetAddress = cvmToAddress(address);
		console.log('cennznetaddress:',cennznetAddress);


		let collectionName = 'global-example-collection';
		let quantity = 100;
		const collectionId = 0;
		const metadataPath = {"Https": "example123.com/nft/metadata" }
		if  (cennznet) {

			// await cennznet.tx.nft.createCollection(
			// 	collectionName,
			// 	null,
			// )
			// await cennznet.tx.nft.mintSeries(collectionId,
            //  quantity,
            //  cennznetAddress,
            //  metadataPath,
            //  null
			await cennznet.tx.nft.setSeriesName(collectionId,
             0,
             "FLUFFY"
          ).signViaEthWallet(
				address,
				cennznet,
				ethereum, async ({events, status}) => {
					console.log('status:', status.toString());
					if (status.isInBlock) {
						console.log(events[0].event.method);
						console.log(events[0].event.section);

					}
				}
			);
		}

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
