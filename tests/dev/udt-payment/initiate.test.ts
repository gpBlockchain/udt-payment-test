import { numFrom } from "@ckb-ccc/core";
import { showTxMessage, waitTransactionCommitted } from "../../../src/tx";
import { UdtPaymentClient } from "../../../src/udtPaymentClient";
import { FUND_POOL_SIGNERS, Signers, USDI } from "../config";
import { faucetUSDI } from "../faucet";
import { addUdtCell } from "./payment.service";
import assert from "assert";
describe('initiate', () => {

    let udtClient: UdtPaymentClient;
    beforeEach(async () => {
        // check udt convert service have udt token 
        udtClient = new UdtPaymentClient()

        await addUdtCell({ ckbCapacity: 100000000000n })
    })
    it('{}=>err:Input ckbytes are enough for output ckbytes!', async () => {
        await expect(udtClient.initiate({})).rejects.toThrow(/Input ckbytes are enough for output ckbytes!/)
    })
    it("input 为空 ->报错", async () => {
        // let udtClient = new UdtPaymentClient()
        // await expect(udtClient.initiate({})).rejects.toThrow(/Input ckbytes are enough for output ckbytes!/) 
    })

    it("output need mutil live_cell", async () => {
        // check udt convert service have udt token 
        await addUdtCell({ ckbCapacity: 200000000000n })

        // init 
        await faucetUSDI((await Signers[0].getAddressObjs())[0].script, 400000000n);
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
        completedTx.addOutput({
            lock: (await Signers[1].getAddressObjs())[0].script,
            capacity: `0x${BigInt(50000000000n).toString(16)}`,
        })
        completedTx = await Signers[0].signTransaction(completedTx);
        await showTxMessage(Signers[0].client, completedTx);

        let { askTokens, transaction, bidTokens } = await udtClient.initiate(completedTx, [2]);
        await showTxMessage(Signers[0].client, transaction);
        // check askTokens
        console.log("askTokens:", askTokens);
        // check bidTokens
        console.log("bidTokens:", bidTokens);
        let price = Number(numFrom(askTokens)) * 100 / Number(numFrom(bidTokens)) / 1.03
        console.log("price:", price);
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
        await waitTransactionCommitted(Signers[0].client, response.hash());
    })

    it("input'ckb contains FUND_POOL_PRIVATE_KEY lock -> Input cells uses invalid lock script", async () => {
        await faucetUSDI((await FUND_POOL_SIGNERS.getAddressObjs())[0].script, 200000000n);
        const { res: tx } = await USDI.transfer(
            Signers[0],
            [
                { to: (await Signers[1].getAddressObjs())[0].script, amount: 2000000 },
                { to: (await Signers[1].getAddressObjs())[0].script, amount: 20000000 },

            ],
        );
        let completedTx = await USDI.completeBy(tx, FUND_POOL_SIGNERS);
        await showTxMessage(FUND_POOL_SIGNERS.client, completedTx);
        let { transaction } = await udtClient.initiate(completedTx, [2]);
        await showTxMessage(FUND_POOL_SIGNERS.client, transaction);
        await expect(udtClient.initiate(transaction, [2])).rejects.toThrow(/Input cells uses invalid lock script!/)
    })

})