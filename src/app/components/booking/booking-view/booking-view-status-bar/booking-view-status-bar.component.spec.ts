import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingViewStatusBarComponent } from './booking-view-status-bar.component';

describe('BookingViewStatusBarComponent', () => {
  let component: BookingViewStatusBarComponent;
  let fixture: ComponentFixture<BookingViewStatusBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingViewStatusBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingViewStatusBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
