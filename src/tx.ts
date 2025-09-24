import { ccc, udtBalanceFrom,sleep } from "@ckb-ccc/core";

export interface TxMsg {
    address: string;
    balance: bigint;
    udtBalnce: bigint;
    udtArgs: string;
}

export async function showTxMessage(client: ccc.Client, tx: ccc.Transaction): Promise<{
    inputs: TxMsg[];
    outputs: TxMsg[];
}> {
    // decode inputs 
    let txMsgs: {
        inputs: TxMsg[];
        outputs: TxMsg[];
    } = {
        "inputs": [],
        "outputs": []
    }
    // if (tx instanceof cccA.JsonRpcTransaction) {
        // tx = cccA.JsonRpcTransformers.transactionTo(tx);
    // }
    for (const input of tx.inputs) {
        if (input.cellOutput == undefined) {
            let tx = await client.getTransaction(input.previousOutput.txHash);
            input.cellOutput = tx!.transaction.outputs[Number(input.previousOutput.index)];
            input.outputData = tx!.transaction.outputsData[Number(input.previousOutput.index)];
        }

        let inputMsg = {
            "address": input.cellOutput.lock.args+":"+input.previousOutput.index,
            "balance": input.cellOutput!.capacity,
            "udtBalnce": udtBalanceFrom(input.outputData!),
            "udtArgs": input.cellOutput.type?.args || "",
        }
        txMsgs.inputs.push(inputMsg);
    }

    // decode outputs
    for (const [index, output] of tx.outputs.entries()) {
        let outputMsg: TxMsg = {
            "address": output.lock.args,
            "balance": output.capacity,
            "udtBalnce": udtBalanceFrom(tx.outputsData[index]),
            "udtArgs": output.type?.args || "",
        }
        txMsgs.outputs.push(outputMsg);
    }

    // decode witness 


    // 合并inputs和outputs到一个表格
    const combinedData = [
        ...txMsgs.inputs.map((input, index) => ({
            type: 'Input',
            index: index ,
            address: input.address,
            balance: input.balance.toString(),
            udtBalance: input.udtBalnce.toString(),
            udtArgs: input.udtArgs.slice(0, 5)
        })),
        ...txMsgs.outputs.map((output, index) => ({
            type: 'Output',
            index: index ,
            address: output.address,
            balance: output.balance.toString(),
            udtBalance: output.udtBalnce.toString(),
            udtArgs: output.udtArgs.slice(0, 5)
        }))
    ];
    console.table(combinedData);
    return txMsgs
}

export async function waitTransactionCommitted(
        client: ccc.Client,
        txHash: string,
        options: {
            timeout?: number;
        } = {}
    ): Promise<ccc.ClientTransactionResponse> {
        const {timeout = 1200 * 1000} = options;

        let tx = await client.getTransaction(txHash);
        if (!tx) {
            throw new Error(`not found tx: ${txHash}`);
        }

        let duration = 0;
        while (
                tx?.status === "pending" ||
            tx?.status === "proposed" || tx?.status === "unknown"
            ) {
            if (duration > timeout) {
                throw new Error(`wait transaction committed timeout ${txHash}`);
            }
            await sleep(1000);
            duration += 1000;
            tx = await client.getTransaction(txHash);
        }

        if (tx?.status !== "committed") {
            throw new Error("transaction status is not committed");
        }
        return tx;
}