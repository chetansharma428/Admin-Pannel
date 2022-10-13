import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelsSectionComponent } from './channels-section.component';

describe('ChannelsSectionComponent', () => {
  let component: ChannelsSectionComponent;
  let fixture: ComponentFixture<ChannelsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelsSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
