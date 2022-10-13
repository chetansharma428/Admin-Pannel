import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateCodeComponent } from './corporate-code.component';

describe('CorporateCodeComponent', () => {
  let component: CorporateCodeComponent;
  let fixture: ComponentFixture<CorporateCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CorporateCodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
