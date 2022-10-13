import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchSectionComponent } from './branch-section.component';

describe('BranchSectionComponent', () => {
  let component: BranchSectionComponent;
  let fixture: ComponentFixture<BranchSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
