import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchRegisterComponent } from './branch-register.component';

describe('BranchRegisterComponent', () => {
  let component: BranchRegisterComponent;
  let fixture: ComponentFixture<BranchRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
