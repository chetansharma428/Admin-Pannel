import { TestBed } from '@angular/core/testing';

import { CorporateGroupService } from './corporate-group.service';

describe('CorporateGroupService', () => {
  let service: CorporateGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorporateGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
