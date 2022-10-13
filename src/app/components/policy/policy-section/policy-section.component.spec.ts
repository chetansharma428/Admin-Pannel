import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicySectionComponent } from './policy-section.component';

describe('PolicySectionComponent', () => {
  let component: PolicySectionComponent;
  let fixture: ComponentFixture<PolicySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicySectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
