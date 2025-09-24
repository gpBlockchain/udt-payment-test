// import { Udt } from '@ckb-ccc/udt';
// import fs from "fs";

// import { ccc, sleep, WitnessArgs } from '@ckb-ccc/core';
// import { showTxMessage } from '../../src/tx';
// import { mintUSDI } from '../../src/udt';
// import { faucetCKB, faucetUSDI } from './faucet';


// describe('udt', () => {
//     let udt: Udt
//     let rpcClient: ccc.ClientPublicTestnet
//     let signers: ccc.SignerCkbPrivateKey[]
    
//     beforeEach(async () => {
//         rpcClient = new ccc.ClientPublicTestnet({
//             url: "http://127.0.0.1:8114",
//             scripts: JSON.parse(fs.readFileSync("./devnet-offckb.json", "utf8")),
//             fallbacks: [],
//         // cache: new NoCache(),
//         });
//         signers = [
//             new ccc.SignerCkbPrivateKey(
//                 rpcClient,
//                 "0x000c06bfd800d27397002dca6fb0993d5ba6399b4238b2f29ee9deb97593d2b1",
//             ),
//             new ccc.SignerCkbPrivateKey(
//                 rpcClient,
//                 "0x9f315d5a9618a39fdc487c7a67a8581d40b045bd7a42d83648ca80ef3b2cb4a1",
//             )
//         ];


//         // Create UDT instance
  
//         udt = new Udt(
//                 {
//                     txHash: "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
//                     index: 6,
//                 },
//                 {
//                     codeHash: "0x1a1e4fef34f5982906f745b048fe7b1089647e82346074e0f32c2ece26cf6b1e",
//                     hashType: "type",
//                     args: "0x7de82d61a7eb2ec82b0dc653e558ba120efcbfbb44dac87c12972d05bf25065300000000"
//                 },
//             );
        
        
//     })
//   it('faucet', async () => {
//     // await completedTx.completeInputsByCapacity(signers[0]);
//     // await completedTx.completeFeeBy(signers[0]);
//     // completedTx = await signers[0].signTransaction(completedTx);
//     // let txHash = await signers[0].client.sendTransaction(completedTx);
//     let txHash = await faucetUSDI((await signers[1].getAddressObjs())[0].script, 1000000000000000000n);
//     console.log(`txHash:${txHash}`);
//     await showTxMessage(rpcClient, (await rpcClient.getTransaction(txHash))?.transaction!);
//     txHash = await faucetCKB((await signers[1].getAddressObjs())[0].script, 10000000000n);
//     await showTxMessage(rpcClient, (await rpcClient.getTransaction(txHash))?.transaction!);

//   })

//   it('mint', async() => {
//         let lock = (await signers[0].getRecommendedAddressObj()).script;
//         console.log(`lock:${ccc.stringify(lock)}`)
//         let hash = ccc.hashCkb(lock.toBytes());
//         console.log(`hash:${hash}`)
//         // Create UDT instance
//         udt = new Udt(
//             {
//                 txHash: "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
//                 index: 6,
//             },
//             {
//                 codeHash: "0x1a1e4fef34f5982906f745b048fe7b1089647e82346074e0f32c2ece26cf6b1e",
//                 hashType: "type",
//                 args: "0x7de82d61a7eb2ec82b0dc653e558ba120efcbfbb44dac87c12972d05bf25065300000000"
//             },
//         );
//         const { res: tx } = await udt.mint(signers[0], [{
//             to: (await signers[0].getAddressObjs())[0].script,
//             amount: 1000000000000000000n,
//         }]);
//         console.log(`${ccc.stringify(tx)}`)
//         await tx.completeInputsByCapacity(signers[0]);
//         await tx.completeFeeBy(signers[0]);
//         let signTx = await signers[0].signTransaction(tx);
//         await showTxMessage(signers[0].client, signTx);
//         let txHash = await signers[0].client.sendTransaction(signTx);
//         console.log(`txHash:${txHash}`);
//     });
// })