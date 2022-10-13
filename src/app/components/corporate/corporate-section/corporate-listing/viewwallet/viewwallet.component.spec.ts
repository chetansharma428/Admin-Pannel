import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewwalletComponent } from './viewwallet.component';

describe('ViewwalletComponent', () => {
  let component: ViewwalletComponent;
  let fixture: ComponentFixture<ViewwalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewwalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewwalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
