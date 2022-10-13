import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateSectionComponent } from './corporate-section.component';

describe('CorporateSectionComponent', () => {
  let component: CorporateSectionComponent;
  let fixture: ComponentFixture<CorporateSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
