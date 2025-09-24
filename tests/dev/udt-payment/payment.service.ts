import { sleep } from "@ckb-ccc/core"
import { FUND_POOL_SIGNERS } from "../config"
import { faucetCKB } from "../faucet"



export async function addUdtCell(params: { ckbCapacity: bigint }) {
    let signers = await FUND_POOL_SIGNERS.getAddressObjSecp256k1()
    console.log(signers)
    // USDI.
    let cells = FUND_POOL_SIGNERS.findCells({ "outputData": "0x00000000000000000000000000000000" })
    let before_cells: any[] = []
    let ckbCapacity = 0n
    for await (const cell of cells) {
        console.log(cell)
        ckbCapacity += BigInt(cell.cellOutput.capacity)
        before_cells.push(cell)
    }
    if (ckbCapacity > params.ckbCapacity) {
        console.log(`ckbCapacity:${ckbCapacity} params.ckbCapacity:${params.ckbCapacity}`)
        return
    }
    let capacity = params.ckbCapacity - ckbCapacity
    if (capacity <= 62n * 100000000n) {
        console.log(`capacity:${capacity} params.ckbCapacity:${params.ckbCapacity}`)
        return
    }


    await faucetCKB((await FUND_POOL_SIGNERS.getAddressObjs())[0].script, params.ckbCapacity - ckbCapacity)
    await sleep(40 * 1000)
    cells = FUND_POOL_SIGNERS.findCells({ "outputData": "0x00000000000000000000000000000000" })
    let after_cells: any[] = []
    let afterCkbCapacity = 0n
    for await (const cell of cells) {
        after_cells.push(cell)
        afterCkbCapacity += BigInt(cell.cellOutput.capacity)
    }
    console.log(`before_cells length:${before_cells.length} after_cells.length:${after_cells.length}`)
    console.log(`before_cells ckbCapacity:${ckbCapacity} after_cells ckbCapacity:${afterCkbCapacity}`)
}