import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletSmartTableComponent } from './wallet-smart-table.component';

describe('WalletSmartTableComponent', () => {
  let component: WalletSmartTableComponent;
  let fixture: ComponentFixture<WalletSmartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletSmartTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletSmartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
