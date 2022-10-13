import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRevenueRuleSetComponent } from './add-revenue-rule-set.component';

describe('AddRevenueRuleSetComponent', () => {
  let component: AddRevenueRuleSetComponent;
  let fixture: ComponentFixture<AddRevenueRuleSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRevenueRuleSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRevenueRuleSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
