import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingDetailComponent } from './pricing-detail.component';

describe('PricingDetailComponent', () => {
  let component: PricingDetailComponent;
  let fixture: ComponentFixture<PricingDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
