import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelTableComponent } from './channel-table.component';

describe('ChannelTableComponent', () => {
  let component: ChannelTableComponent;
  let fixture: ComponentFixture<ChannelTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
