import { addUdtCell } from "./payment.service"
import { Signers, USDI } from '../config';
import { UdtPaymentClient } from "../../../src/udtPaymentClient";
import { showTxMessage,waitTransactionCommitted } from '../../../src/tx';
import { numFrom } from '@ckb-ccc/core';
import { faucetUSDI } from '../faucet';
import { assert } from 'console';

describe('demo', () => {
    it('should work', async () => {
        let udtClient = new UdtPaymentClient()
        // check udt convert service have udt token 
        await addUdtCell({ ckbCapacity: 100000000000n })
        
        // init 
        await faucetUSDI((await Signers[0].getAddressObjs())[0].script,40000000n);
        // let b = await balanceUSDI(Signers[0],USDI);
        // console.log("Signers[0] balance:",b);
        const { res: tx } = await USDI.transfer(
            Signers[0],
            [
                { to: (await Signers[1].getAddressObjs())[0].script, amount: 200000 },
                {
                    to: (await Signers[1].getAddressObjs())[0].script, amount: 200000
                },
            ],
        );
        let completedTx = await USDI.completeBy(tx, Signers[0]);

        completedTx = await Signers[0].signTransaction(completedTx);
        await showTxMessage(Signers[0].client, completedTx);

        let { askTokens,transaction,bidTokens } = await udtClient.initiate(completedTx, [2]);
        await showTxMessage(Signers[0].client, transaction);
        // check askTokens
        console.log("askTokens:",askTokens);
        // check bidTokens
        console.log("bidTokens:",bidTokens);
        let price = Number(numFrom(askTokens)) * 100 / Number(numFrom(bidTokens)) / 1.03
        console.log("price:",price);
        // 断言价格在预期范围内，允许0.1%的误差
        const expectedPrice = 0.03;
        const tolerance = 0.0001;
        assert(Math.abs(price - expectedPrice) <= tolerance, `Price ${price} should be approximately ${expectedPrice} within tolerance ${tolerance}`);
        let signTx = await Signers[0].signTransaction(transaction);
        await showTxMessage(Signers[0].client, signTx);
        // confirm
        signTx = await Signers[0].signTransaction(signTx);
        let response = await udtClient.confirm(signTx);
        await showTxMessage(Signers[0].client, response);
        assert(signTx.hash() == response.hash(), "Confirm transaction hash should be equal");
        await waitTransactionCommitted(Signers[0].client,response.hash());
    })

})