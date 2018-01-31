import { Injectable } from '@angular/core';

@Injectable()
export class UtilsService {

  constructor() {
  }

  // Esta es una version mas rapida del "_.find" de lodash :3
  // Gracias a https://pouchdb.com/2015/02/28/efficiently-managing-ui-state-in-pouchdb.html
  public binarySearch(arr: any, property: string, search: any): number {
    let low: number = 0;
    let high: number = arr.length;
    let mid: number;
    while (low < high) {
      mid = (low + high) >>> 1; // faster version of Math.floor((low + high) / 2)
      arr[mid][property] < search ? low = mid + 1 : high = mid;
    }
    return low;
  }

}
