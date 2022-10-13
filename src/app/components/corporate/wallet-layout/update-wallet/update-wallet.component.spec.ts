import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWalletComponent } from './update-wallet.component';

describe('CreateWalletComponent', () => {
  let component: UpdateWalletComponent;
  let fixture: ComponentFixture<UpdateWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateWalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
