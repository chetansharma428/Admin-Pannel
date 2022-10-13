import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { StorageService } from './storage.handler/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private isLoading = false;
  loadingStatus = new Subject<boolean>();
  constructor(private storageService: StorageService) { }

  get loading(): boolean {
    return this.isLoading;
  }

  set loading(value) {
    this.isLoading =  value;
    this.storageService.setIsLoading(value);
    this.loadingStatus.next(this.isLoading);
  }

  public startLoading(): void {
    this.loading = true;
  }

  public stopLoading(): void {
    this.loading = false;
  }
}
