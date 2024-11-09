import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaveprojectService {

  private titleService = new BehaviorSubject<string>('Select Projects');
  private formenu = new BehaviorSubject<boolean>(false);
  
  updatedTitle = this.titleService.asObservable();
  updatedFormenu = this.formenu.asObservable();

  sendtitle(title:string)
  {
    title = title.toUpperCase();
    this.titleService.next(title);
  }

  openmenu(flag:boolean)
  {
    this.formenu.next(flag);
  }

}
