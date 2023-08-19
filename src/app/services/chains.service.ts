import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChainInfo } from '../models/chain.model';

@Injectable({
  providedIn: 'root',
})
export class ChainsService {
  private chainsUrl = 'https://chainid.network/chains_mini.json';
  public chains: ChainInfo[] = [];

  constructor(private http: HttpClient) {}

  fetchChains(): Observable<ChainInfo[]> {
    return this.http.get<ChainInfo[]>(this.chainsUrl);
  }

  loadChains(): void {
    try {
      this.fetchChains().subscribe((res: ChainInfo[]) => {
        this.chains = res;
      });
    } catch (e) {
      console.error('Failed fetching chains', e);
    }
  }
}
