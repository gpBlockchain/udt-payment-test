import { ccc } from "@ckb-ccc/core";
import { waitTransactionCommitted } from "../../src/tx";
import { FaucetAccount, USDI, USDIOwnerSigner } from "./config";
import { mintUSDI } from "../../src/udt";



export async function faucetUSDI(to: ccc.ScriptLike, amount: bigint) {
    return await mintUSDI(USDI,USDIOwnerSigner,to, amount);
}

export async function faucetCKB(to: ccc.ScriptLike, amount: bigint) {
    let tx = ccc.Transaction.from({
        outputs: [
            {
                lock: to,
                capacity: amount,
            },
        ],
    });
    await tx.completeInputsByCapacity(FaucetAccount);
    await tx.completeFeeBy(FaucetAccount, 1000n);
    let signTx = await FaucetAccount.signTransaction(tx);
    let txHash = await FaucetAccount.client.sendTransaction(signTx);
    console.log(`txHash:${txHash}`);
    await waitTransactionCommitted(FaucetAccount.client, txHash);
    return Promise.resolve(txHash);
}