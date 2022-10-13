import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateCodeSectionComponent } from './corporate-code-section.component';

describe('CorporateCodeSectionComponent', () => {
  let component: CorporateCodeSectionComponent;
  let fixture: ComponentFixture<CorporateCodeSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateCodeSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateCodeSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
