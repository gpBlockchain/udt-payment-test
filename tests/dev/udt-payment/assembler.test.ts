import { sleep } from "@ckb-ccc/core"
import { FUND_POOL_SIGNERS } from "../config"
import { faucetCKB } from "../faucet"

describe('udt payment demo', () => {
    it('split 1000ckb ckb -> tow 500 ckb cell with 0 udt', async () => {
        let signers = await FUND_POOL_SIGNERS.getAddressObjSecp256k1()
        console.log(signers)
        // USDI.
        let cells = FUND_POOL_SIGNERS.findCells({"outputData":"0x00000000000000000000000000000000"})
        let before_cells:any[] = []
        for await (const cell of cells) {
            console.log(cell)
            before_cells.push(cell)
        }
        await faucetCKB((await FUND_POOL_SIGNERS.getAddressObjs())[0].script, 100000000000n)
        await sleep(40 * 1000)
        cells = FUND_POOL_SIGNERS.findCells({"outputData":"0x00000000000000000000000000000000"})
        let after_cells:any[] = []
        for await (const cell of cells) {
            after_cells.push(cell)
        }
        console.log(`before_cells length:${before_cells.length} after_cells.length:${after_cells.length}`)
        console.assert(before_cells.length === after_cells.length - 2)
    })
    
})