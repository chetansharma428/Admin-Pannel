import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRevenueRuleSetComponent } from './update-revenue-rule-set.component';

describe('UpdateRevenueRuleSetComponent', () => {
  let component: UpdateRevenueRuleSetComponent;
  let fixture: ComponentFixture<UpdateRevenueRuleSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateRevenueRuleSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateRevenueRuleSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
