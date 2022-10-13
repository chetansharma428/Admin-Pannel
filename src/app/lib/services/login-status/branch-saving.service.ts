import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BranchSavingService {

  private $branch= new Subject();

  channcelData: any;
  providersData: any;
  ruleSetsData: any;
  passThroughConfig: any;
  corporateCodeData: any;

  constructor() { }

  watchBranchSubject(): Observable<any> {
    return this.$branch.asObservable();
  }

  setBranchSubject(branch: string) {
    this.$branch.next(branch);
  }

  // setChannelSubject(channelsDetails: Array<any>) {
  //   this.$channelDetails.next(channelsDetails);
  // }

  // watchChannelSubject(): Observable<any> {
  //   return this.$channelDetails.asObservable();
  // }

}
