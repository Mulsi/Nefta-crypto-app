import { Component, EventEmitter, Output } from '@angular/core';
import { ChainInfo } from 'src/app/models/chain.model';
import { MetamaskService } from 'src/app/services/metamask.service';
import { ChainsService } from 'src/app/services/chains.service';

@Component({
  selector: 'app-chain-list-table',
  templateUrl: './chain-list-table.component.html',
  styleUrls: ['./chain-list-table.component.css'],
})
export class ChainListTableComponent {
  @Output() public selectedChain: EventEmitter<ChainInfo> =
    new EventEmitter<ChainInfo>();
  @Output() public error: EventEmitter<any> = new EventEmitter<any>();
  chains!: ChainInfo[];

  constructor(
    private metamaskService: MetamaskService,
    private chainsService: ChainsService
  ) {}

  ngOnInit(): void {
    this.fetchChains();
  }

  fetchChains() {
    try {
      this.chainsService.fetchChains().subscribe((res: ChainInfo[]) => {
        this.chains = res;
      });
    } catch (e) {
      console.error('Failed fetching list', e);
    }
  }

  onListboxChange(chain: ChainInfo) {
    this.selectedChain.emit(chain);
    this.metamaskService.switchChain(chain).then((res) => {
      if (!res) {
        this.error.emit('error');
      } else {
        this.error.emit('success');
      }
    });
  }
}
