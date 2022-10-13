import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingViewHeaderComponent } from './booking-view-header.component';

describe('BookingViewHeaderComponent', () => {
  let component: BookingViewHeaderComponent;
  let fixture: ComponentFixture<BookingViewHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingViewHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingViewHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
