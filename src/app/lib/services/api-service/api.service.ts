import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private readonly http: HttpClient) { }

  /**Get call */
  public get(url: string, options?: any) {
    return this.http.get(url, options);
  }

  /**POST call */
  public post(url: string, data: any, options?: any) {
    return this.http.post(url, data, options);
  }

  /**Update call */
  public put(url: string, data: any, options?: any) {
    return this.http.put(url, data, options);
  }

  /**Delete call */
  public delete(url: string, options?: any) {
    return this.http.delete(url, options);
  }
}
