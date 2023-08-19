import { Component, ChangeDetectorRef } from '@angular/core';
import { MetamaskService } from './services/metamask.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChainInfo } from './models/chain.model';
import { Validator } from './validators/validator';
import { MessageService } from 'primeng/api';
import { ChainsService } from './services/chains.service';
import { StringUtil } from 'src/utils/string.util';

declare let window: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService],
})
export class AppComponent {
  title = 'nefta-coding-test';

  connected: boolean = false;
  provider: any;
  chainId: string = '';
  currentBalance: any;
  chains: ChainInfo[] = [];
  chainName: string | undefined = '';
  selectedChain: ChainInfo | null = null;
  currentAccount: string | null = null;
  accountChangeSubscription: Subscription | undefined;
  formGroup: FormGroup;
  recipientAddressSubscription: Subscription | undefined;
  amountSubscription: Subscription | undefined;

  constructor(
    private metamaskService: MetamaskService,
    private changeDetectorRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private messageService: MessageService,
    private chainsService: ChainsService
  ) {
    this.formGroup = this.fb.group({
      chain: [''],
      recipientAddress: ['', [Validator.RecipientAddressValidator]],
      amount: [''],
    });
  }

  ngOnInit(): void {
    this.accountChangeSubscription = this.metamaskService
      .getAccountChanges()
      .subscribe((account: string | null) => {
        this.currentAccount = account;
        this.changeDetectorRef.detectChanges();
        // get new chain when user changes it
        this.getChain();
        this.findChainName();
      });
  }

  async getAccounts() {
    await this.metamaskService.getCurrentAccount().then((success) => {
      this.currentAccount = success;
      if (this.currentAccount?.length) {
        this.connected = true;
      }
      if (this.connected) {
        this.getAccounts();
        this.getChain();
        this.getBalance();
      } else {
        this.messageService.add({
          key: 'err',
          severity: 'error',
          summary: 'Something went wrong',
          detail: 'Metamask extension is not present. Please install it',
        });
      }
    });
  }

  async getChain() {
    await this.metamaskService.getCurrentChain().then((res) => {
      this.chainId = res;
      this.fetchChains();
    });
  }

  fetchChains() {
    if (!this.chains.length) {
      try {
        this.chainsService.fetchChains().subscribe((res: ChainInfo[]) => {
          this.chains = res;
          this.findChainName();
        });
      } catch (e) {
        console.error('Failed fetching list', e);
      }
    }
  }

  findChainName() {
    this.chainName = this.chains.find(
      (chain: ChainInfo) =>
        StringUtil.formatChainToHex(chain.chainId) === this.chainId
    )?.name;
  }

  async getBalance() {
    if (window.ethereum) {
      this.currentBalance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [this.currentAccount, 'latest'],
      });
    }
  }

  handleChainSelection(chain: ChainInfo) {
    this.formGroup.patchValue(chain);
  }

  isValid(): boolean {
    return this.formGroup.valid;
  }

  createTransation() {
    if (this.currentAccount && this.formGroup.valid) {
      try {
        this.metamaskService
          .transaction(
            this.currentAccount,
            this.formGroup.get('recipientAddress')?.value,
            StringUtil.ethToWeiHex(this.formGroup.get('amount')?.value)
          )
          .then((res) => {
            if (StringUtil.transactionHash(res)) {
              this.showSuccess();
            } else if (res === '-32602') {
              this.invalidValue();
            } else {
              this.showError();
            }
          });
      } catch (e) {
        this.showError();
      }
    }
  }

  showError() {
    this.messageService.add({
      key: 'err',
      severity: 'error',
      summary: 'Something went wrong',
      detail: 'Please open your MetaMask extension.',
    });
  }

  showSuccess() {
    this.messageService.add({
      key: 'suc',
      severity: 'success',
      summary: 'Successfuly made a transation',
      detail: 'Check your MetaMask extension for details.',
    });
  }

  invalidValue() {
    this.messageService.add({
      key: 'err',
      severity: 'error',
      summary: 'Something went wrong',
      detail: 'Invalid value inputed. Please try again.',
    });
  }

  handleNetworkChange(success: string) {
    if (success === 'error') {
      this.messageService.add({
        key: 'err',
        severity: 'error',
        summary: 'Could not change network',
        detail:
          'Something went wrong. Try changing network manually in MetaMask extension.',
      });
    } else {
      this.messageService.add({
        key: 'suc',
        severity: 'success',
        summary: 'Successfuly changed network',
        detail: '',
      });
    }
  }

  ngOnDestroy() {
    if (this.accountChangeSubscription) {
      this.accountChangeSubscription.unsubscribe();
    }
  }
}
