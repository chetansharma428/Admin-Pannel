import { TestBed } from '@angular/core/testing';

import { CorporateCodeService } from './corporate-code.service';

describe('CorporateCodeService', () => {
  let service: CorporateCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorporateCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
