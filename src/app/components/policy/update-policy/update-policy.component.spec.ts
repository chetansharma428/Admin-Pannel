import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePolicyComponent } from './update-policy.component';

describe('UpdatePolicyComponent', () => {
  let component: UpdatePolicyComponent;
  let fixture: ComponentFixture<UpdatePolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
