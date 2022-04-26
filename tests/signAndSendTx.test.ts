import signAndSendTx from "@/utils/signAndSendTx";
import { Signer, SubmittableExtrinsic } from "@cennznet/api/types";
import { CENNZTransaction } from "@/utils";
import { SingleAccountSigner } from "@/utils/__mocks__/SingleAccountSigner";
import { Keyring } from "@polkadot/keyring";

const { cennzAsset } = global.getEthereumAssetsForTest();
const api = global.getCENNZApiForTest();

let alice, extrinsic: SubmittableExtrinsic<"promise">, signer: Signer;
beforeAll(async () => {
	const keyring = new Keyring({ type: "sr25519" });
	alice = keyring.addFromUri("//Alice");
	signer = new SingleAccountSigner(api.registry, alice);

	api.setSigner(signer);

	extrinsic = api.tx.erc20Peg.withdraw(cennzAsset.assetId, "10", alice.address);
});

describe("signAndSendTx", () => {
	it("signs and sends", async () => {
		const transaction: CENNZTransaction = await signAndSendTx(
			extrinsic,
			alice.address,
			signer
		);

		const expected = await extrinsic.signAndSend(alice);
		expect(transaction.hash).toEqual(expected.hash);
	});
	it("throws if error", async () => {
		signAndSendTx(extrinsic, "bad-address", signer).catch((error) => {
			expect(error).toBeInstanceOf(Error);
		});
	});
});
