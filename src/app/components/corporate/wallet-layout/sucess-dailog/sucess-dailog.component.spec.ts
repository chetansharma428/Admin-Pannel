import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucessDailogComponent } from './sucess-dailog.component';

describe('SucessDailogComponent', () => {
  let component: SucessDailogComponent;
  let fixture: ComponentFixture<SucessDailogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SucessDailogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SucessDailogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
