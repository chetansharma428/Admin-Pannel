import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueSectionComponent } from './revenue-section.component';

describe('RevenueSectionComponent', () => {
  let component: RevenueSectionComponent;
  let fixture: ComponentFixture<RevenueSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevenueSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevenueSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
