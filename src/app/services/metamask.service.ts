import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ChainInfo } from '../models/chain.model';
import { StringUtil } from 'src/utils/string.util';

declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class MetamaskService {
  private accountChangedSubject: Subject<string | null> = new Subject<
    string | null
  >();

  constructor() {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          this.accountChangedSubject.next(accounts[0]);
        } else {
          this.accountChangedSubject.next(null);
        }
      });
    }
  }

  async getPermissions() {
    const getPermissions = await window.ethereum.request({
      method: 'wallet_getPermissions',
    });
    return getPermissions;
  }

  async getCurrentAccount() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      return accounts[0];
    }
  }

  getAccountChanges(): Observable<string | null> {
    return this.accountChangedSubject.asObservable();
  }

  async getCurrentChain() {
    if (window.ethereum) {
      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });
      return chainId;
    }
  }

  async switchChain(chain: ChainInfo) {
    let success: boolean = false;
    const checkForChainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    if (checkForChainId === StringUtil.formatChainToHex(chain.chainId)) {
      success = true;
    } else {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: StringUtil.formatChainToHex(chain.chainId) }],
        });
        success = true;
      } catch (switchError: any) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: StringUtil.formatChainToHex(chain.chainId),
                  chainName: chain.name,
                  rpcUrls: [...chain.rpc],
                  nativeCurrency: {
                    decimals: chain.nativeCurrency.decimals,
                    name: chain.nativeCurrency.name,
                    symbol: chain.nativeCurrency.symbol,
                  },
                },
              ],
            });
            success = true;
          } catch (addError: any) {
            success = false;
            console.error(addError, 'Could not add selected chain to MetaMask');
          }
        }
      }
    }
    return success;
  }

  async transaction(
    currentAddress: string,
    recipientAddress: string,
    amount: string
  ) {
    let response: string = '';
    try {
      await window.ethereum
        .request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: currentAddress,
              to: recipientAddress,
              value: amount,
            },
          ],
        })
        .then((res: any) => {
          response = res;
        });
    } catch (e: any) {
      response = e.code.toString();
    }
    return response;
  }
}
