import { ccc, Since } from "@ckb-ccc/core";
import { faucetCKB, faucetUSDI } from "./faucet";
import fs from "fs";
import { showTxMessage } from "../../src/tx";

describe('faucet', () => {
    let signers: ccc.SignerCkbPrivateKey[]
    let rpcClient: ccc.ClientPublicTestnet
    
    beforeEach(async () => {
        rpcClient = new ccc.ClientPublicTestnet({
            url: "http://127.0.0.1:8114",
            scripts: JSON.parse(fs.readFileSync("./devnet-offckb.json", "utf8")),
            fallbacks: [],
        // cache: new NoCache(),
        });
        signers = [
            new ccc.SignerCkbPrivateKey(
                rpcClient,
                "0xf235a1996cbb7a941bf680f147b86ee5dc500ff2eaa20d39b10280a4ef5b1d29",
            ),
            new ccc.SignerCkbPrivateKey(
                rpcClient,
                "0xf235a1996cbb7a941bf680f147b86ee5dc500ff2eaa20d39b10280a4ef5b1d29",
            )
        ];
    })

    it('faucetUSDI', async () => {
         let txHash = await faucetUSDI((await signers[1].getAddressObjs())[0].script, 1000000000000000000n);
        console.log(`txHash:${txHash}`);
        await showTxMessage(rpcClient, (await rpcClient.getTransaction(txHash))?.transaction!);
        txHash = await faucetCKB((await signers[1].getAddressObjs())[0].script, 10000000000n);
        await showTxMessage(rpcClient, (await rpcClient.getTransaction(txHash))?.transaction!);
        // const since = Since.from("0x5d29c26800000040");
        // console.log(since);
    })
})