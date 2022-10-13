import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchListingComponent } from './branch-listing.component';

describe('BranchListingComponent', () => {
  let component: BranchListingComponent;
  let fixture: ComponentFixture<BranchListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchListingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
