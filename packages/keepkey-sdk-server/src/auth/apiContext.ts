import type { BIP32Path } from '@shapeshiftoss/hdwallet-core'
import type { KeepKeyHDWallet } from '@shapeshiftoss/hdwallet-keepkey'
import { isEqual } from 'lodash'

// import { FailureType, isKKFailureType } from '../util'
import type { SdkClient } from './sdkClient'
// import Web3 from 'web3';
const horribleAccountsHack = new WeakMap<KeepKeyHDWallet, Record<string, BIP32Path>>()

//@TODO get web3 providers

//serve web3 provider

//maintain network context from renderer selections

export class ApiContext {
  readonly sdkClient: SdkClient
  readonly wallet: KeepKeyHDWallet
  readonly accounts: Record<string, BIP32Path>
  readonly path: string
  chainId: number;
  // web3: Web3; // Add a web3 instance property

  protected constructor(sdkClient: SdkClient, accounts: Record<string, BIP32Path>, path: string) {
    this.sdkClient = sdkClient
    this.wallet = sdkClient.wallet
    this.accounts = accounts
    this.path = path
    this.chainId = 1;
    // this.web3 = new Web3('https://cloudflare-eth.com'); // Initialize the web3 instance
  }

  static async create(sdkClient: SdkClient, path: string): Promise<ApiContext> {
    // TODO: something something database something
    if (!horribleAccountsHack.has(sdkClient.wallet)) {
      horribleAccountsHack.set(sdkClient.wallet, {})
      // try {
      //   horribleAccountsHack.set(
      //     sdkClient.wallet,
      //     Object.fromEntries(
      //       await Promise.all(
      //         (
      //           await sdkClient.wallet.ethGetAccountPaths({
      //             coin: 'Ethereum',
      //             accountIdx: 0,
      //           })
      //         ).map(async x => [
      //           await sdkClient.wallet.ethGetAddress({
      //             addressNList: x.addressNList,
      //             showDisplay: false,
      //           }),
      //           x.addressNList,
      //         ]),
      //       ),
      //     ),
      //   )
      // } catch (e) {
      //   if (!isKKFailureType(e, FailureType.FAILURE_NOTINITIALIZED)) {
      //     console.warn('horribleAccountsHack failed', e)
      //   }
      // }
    }

    return new ApiContext(sdkClient, horribleAccountsHack.get(sdkClient.wallet) ?? {}, path)
  }

  async getAccount(address: string): Promise<{
    addressNList: BIP32Path
  }> {
    const out = this.accounts[address]
    if (!out) throw new Error('unrecognized address')
    return {
      addressNList: out,
    }
  }

  async saveAccount(address: string, addressNList: BIP32Path): Promise<void> {
    if (address in this.accounts) {
      if (isEqual(this.accounts[address], addressNList)) return
      throw new Error('conflicting account entry already present')
    }
    this.accounts[address] = addressNList
    // TODO: something something database something
  }
}
