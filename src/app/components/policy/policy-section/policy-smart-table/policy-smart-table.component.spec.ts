import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySmartTableComponent } from './policy-smart-table.component';

describe('PolicySmartTableComponent', () => {
  let component: PolicySmartTableComponent;
  let fixture: ComponentFixture<PolicySmartTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicySmartTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicySmartTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
