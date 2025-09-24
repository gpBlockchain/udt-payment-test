

import { JSONRPCClient, JSONRPCResponse } from "json-rpc-2.0";
import { ccc } from "@ckb-ccc/core";
import { cccA } from "@ckb-ccc/core/advanced";


/**
 * Initiate接口响应类型
 */
export interface InitiateResponse {
  validUntil: string;
  transaction: ccc.Transaction;
  askTokens: string;
  bidTokens: string;
}

/**
 * UDT支付客户端类
 */
export class UdtPaymentClient {
  private rpcClient: JSONRPCClient;

  constructor(serverUrl?: string) {
    const url = serverUrl || "http://localhost:8000/rpc";
    
    if (!url) {
      throw new Error('Server URL is required');
    }
    
    this.rpcClient = new JSONRPCClient(
      (jsonRPCRequest: any): Promise<any> =>
        fetch(url, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: ccc.stringify(jsonRPCRequest),
        }).then((response) => {
          if (response.status === 200) {
            // Use client.receive when you received a JSON-RPC response.
            return response
                .json()
                .then((jsonRPCResponse) => this.rpcClient.receive(jsonRPCResponse as JSONRPCResponse));
          } else if (jsonRPCRequest.id !== undefined) {
            return Promise.reject(new Error(response.statusText));
          }
        }),
    );
  }

  /**
   * 发起交易初始化请求
   * @param tx 交易对象
   * @param params 参数数组，默认为[1]
   * @returns 包含valid_until、transaction、ask_tokens、bid_tokens的响应
   */
  async initiate(tx: ccc.TransactionLike, params: number[] = [1]): Promise<InitiateResponse> {
    try {
        console.log("tx0:", ccc.stringify(tx));

    //   let tx1 = cccA.JsonRpcTransformers.transactionFrom(tx);
    //   console.log("tx1:", JSON.stringify(tx1));
      const response = await this.rpcClient.request("initiate", [tx, params]);
      console.log("response:", ccc.stringify(response));
      const {
        validUntil,
        transaction,
        askTokens,
        bidTokens,
      } = response;
      console.log("validUntil:", validUntil);
      console.log("transaction:", ccc.stringify(transaction));
      console.log("askTokens:", askTokens);
      console.log("bidTokens:", bidTokens);
      return {
        validUntil,
        // transaction: cccA.JsonRpcTransformers.transactionTo(transaction),
        transaction: transaction,
        askTokens,
        bidTokens,
      };
    } catch (error) {
      console.error('Initiate request failed:', error);
      throw error;
    }
  }

  async confirm(tx: ccc.Transaction): Promise<ccc.Transaction> {
    try {
      const response = await this.rpcClient.request("confirm", [tx]);
      console.log("confirm response:", ccc.stringify(response));
      return ccc.Transaction.from(response['transaction']);
      // return cccA.JsonRpcTransformers.transactionTo(response['transaction']);
    } catch (error) {
      console.error('Confirm request failed:', error);
      throw error;
    }
  }

  /**
   * 获取RPC客户端实例（用于其他自定义请求）
   */
  getRpcClient(): JSONRPCClient {
    return this.rpcClient;
  }

  /**
   * 发送自定义RPC请求
   * @param method 方法名
   * @param params 参数
   * @returns 响应结果
   */
  async request(method: string, params?: any): Promise<any> {
    try {
      return await this.rpcClient.request(method, params);
    } catch (error) {
      console.error(`RPC request ${method} failed:`, error);
      throw error;
    }
  }
}

/**
 * 创建UdtPaymentClient实例的工厂函数
 */
export function createUdtPaymentClient(serverUrl?: string): UdtPaymentClient {
  return new UdtPaymentClient(serverUrl);
}