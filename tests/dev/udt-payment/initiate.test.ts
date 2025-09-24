import { UdtPaymentClient } from "../../../src/udtPaymentClient";
describe('initiate', () => {

    it('{}=>err:Input ckbytes are enough for output ckbytes!', async () => {
        let udtClient = new UdtPaymentClient()
        await expect(udtClient.initiate({})).rejects.toThrow(/Input ckbytes are enough for output ckbytes!/) 
    })
})