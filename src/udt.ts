import { USDI } from "../tests/dev/config";
import { ccc, sleep, } from "@ckb-ccc/core";
import { waitTransactionCommitted } from "./tx";
import { Udt } from "@ckb-ccc/udt";




export async function mintUSDI(udt: Udt, ownerSigner: ccc.Signer, to: ccc.ScriptLike, amount: bigint): Promise<string> {
    let { res: tx } = await udt.mint(ownerSigner, [{
        to: to,
        amount: ccc.numLeToBytes(amount, 18),
    }]);
    // tx.outputCells[0].capacity = 14600000000n;
    tx.outputsData = [ccc.hexFrom(ccc.numLeToBytes(amount, 16))]
    await tx.completeInputsByCapacity(ownerSigner);
    await tx.completeFeeBy(ownerSigner,1000n);
    let signTx = await ownerSigner.signTransaction(tx);
    let txHash = await ownerSigner.client.sendTransaction(signTx);
    console.log(`tx hash:${txHash}`);
    await waitTransactionCommitted(ownerSigner.client, txHash);
    return Promise.resolve(txHash);
}

export async function transferUSDI(from: ccc.Signer, to: ccc.ScriptLike, amount: bigint): Promise<string> {
    let { res: tx } = await USDI.transfer(from, [{
        to: to,
        amount: amount,
    }]);
    tx = await USDI.completeBy(tx, from);

    console.log(`${ccc.stringify(tx)}`)
    await tx.completeInputsByCapacity(from);
    await tx.completeFeeBy(from);
    let signTx = await from.signTransaction(tx);
    let txHash = await from.client.sendTransaction(signTx);
    console.log(`txHash:${txHash}`);
    await waitTransactionCommitted(from.client, txHash);
    return Promise.resolve(txHash);
}

export async function balanceUSDI(signer: ccc.Signer, udt: Udt): Promise<bigint> {
    let balance = 0n;
    let cells = signer.findCells({
        script: udt.script,
    });
    for await (const cell of cells) {
        balance += ccc.udtBalanceFrom(cell.outputData);
        console.log(`Found UDT txHash ${cell.outPoint.txHash} data: ${cell.outputData}: ${ccc.udtBalanceFrom(cell.outputData)} ,balance:${balance}`);
        await sleep(1000);
    }
    return balance;
}

