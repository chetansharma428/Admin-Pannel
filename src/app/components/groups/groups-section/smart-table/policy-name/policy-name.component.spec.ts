import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyNameComponent } from './policy-name.component';

describe('PolicyNameComponent', () => {
  let component: PolicyNameComponent;
  let fixture: ComponentFixture<PolicyNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
