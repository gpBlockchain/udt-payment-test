import { ccc } from "@ckb-ccc/core";
import { Udt } from "@ckb-ccc/udt";
import fs from "fs";

export const CkbDevRpcUrl = "http://127.0.0.1:8114";
export const DevnetOffCkbPath = "./devnet-offckb.json";
export const DevRpcClient = new ccc.ClientPublicTestnet({
    url: CkbDevRpcUrl,
    scripts: JSON.parse(fs.readFileSync(DevnetOffCkbPath, "utf8")),
    fallbacks: []
});
export const USDIOwnerPrivkey = "0x6109170b275a09ad54877b82f7d9930f88cab5717d484fb4741ae9d1dd078cd6"
export const USDI = new Udt(
    {
        txHash: "0x1dbed8dcfe0f18359c65c5e9546fd15cd69de73ea0a502345be30180649c9467",
        index: 6,
    },
    {
        codeHash: "0x1a1e4fef34f5982906f745b048fe7b1089647e82346074e0f32c2ece26cf6b1e",
        hashType: "type",
        args: "0x7de82d61a7eb2ec82b0dc653e558ba120efcbfbb44dac87c12972d05bf25065300000000"
    },
);

export const USDIOwnerSigner = new ccc.SignerCkbPrivateKey(
    DevRpcClient,
    USDIOwnerPrivkey,
)

export const FaucetAccount = new ccc.SignerCkbPrivateKey(
    DevRpcClient,
    "0x6109170b275a09ad54877b82f7d9930f88cab5717d484fb4741ae9d1dd078cd6",
)

export const Signers = [
    new ccc.SignerCkbPrivateKey(
        DevRpcClient,
        "0x9f315d5a9618a39fdc487c7a67a8581d40b045bd7a42d83648ca80ef3b2cb4a1",
    ),
    new ccc.SignerCkbPrivateKey(
        DevRpcClient,
        "0x59ddda57ba06d6e9c5fa9040bdb98b4b098c2fce6520d39f51bc5e825364697a",
    ),
    new ccc.SignerCkbPrivateKey(
        DevRpcClient,
        "0xf4a1fc19468b51ba9d1f0f5441fa3f4d91e625b2af105e1e37cc54bf9b19c0a1",
    ),
    new ccc.SignerCkbPrivateKey(
        DevRpcClient,
        "0x0334ddff3b1e19af5c5fddda8dbcfb235416eaaba11cfca8acf63ad46e9f55b2",
    ),
    new ccc.SignerCkbPrivateKey(
        DevRpcClient,
        "0x6f358d92f408511707803d292efa148236a2e114d73a472be2a07e0ba49200c7",
    ),
    new ccc.SignerCkbPrivateKey(
        DevRpcClient,
        "0xbde2f19c98dc5ab4cc98f73c573757a9f1782dc44398022a23f77ca752ad8fbe",
    ),

]


// udt payment config 
export const FUND_POOL_PRIVATE_KEY="0x00001c5893cd0a68b82f8e328a0327e85076666b99b8e6d7057d030753407c09"
export const FUND_POOL_SIGNERS = new ccc.SignerCkbPrivateKey(
        DevRpcClient,
        FUND_POOL_PRIVATE_KEY,
)
export const INITIAL_UDT_CELL_CKB="500000"
export const MIN_UDT_CELL_CKB="300"
export const LOCKED_SECONDS="15"
export const COMMITING_SECONDS="120"
export const REFRESHER_TRIGGER_SECONDS=30
export const ASSEMBLER_TRIGGER_SECONDS=120
