import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChainListTableComponent } from './chain-list-table.component';

describe('ChainListTableComponent', () => {
  let component: ChainListTableComponent;
  let fixture: ComponentFixture<ChainListTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChainListTableComponent]
    });
    fixture = TestBed.createComponent(ChainListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
