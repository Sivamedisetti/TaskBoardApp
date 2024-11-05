import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveprojectService {

  private titleService = new BehaviorSubject<string>('Select Projects');
  
  updatedTitle = this.titleService.asObservable();

  sendtitle(title:string)
  {
    title = title.toUpperCase();
    this.titleService.next(title);
  }

}
