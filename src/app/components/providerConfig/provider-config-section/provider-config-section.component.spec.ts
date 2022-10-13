import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderConfigSectionComponent } from './provider-config-section.component';

describe('ProviderConfigSectionComponent', () => {
  let component: ProviderConfigSectionComponent;
  let fixture: ComponentFixture<ProviderConfigSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProviderConfigSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderConfigSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
