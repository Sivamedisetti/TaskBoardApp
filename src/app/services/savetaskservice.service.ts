import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient} from '@angular/common/http';

interface ProjectDataType{
  pid: string;
  title:string;
  tasks :string
}

@Injectable({
  providedIn: 'root'
})

export class SavetaskserviceService {
  private _tasks = new BehaviorSubject<any[]>([]);
  public getProjects = new BehaviorSubject<ProjectDataType |null>(null);
  
  tasks = this._tasks.asObservable();
  projects = this.getProjects.asObservable();

  private baseUrl: string = "https://taskboardapp-backend.onrender.com";

  constructor(private http:HttpClient) {}

  // Load tasks from DB
  public loadTasks(proId:string): void {
    this.http.get<any[]>(`${this.baseUrl}/gettasks/${proId}`).subscribe(
      (task)=>this._tasks.next(task)
    )
  }

  addTask(task: any) {
    let projectId:string = "";

    this.projects.subscribe((pro)=>{if(pro){ projectId = pro.pid}})

    if(projectId)
    {
      this.http.post(`${this.baseUrl}/addtask`,task).subscribe((res)=>this.loadTasks(projectId));
    }

  }

  updateTask(task: any) {
    let projectId:string = "";
    this.projects.subscribe((pro)=>{if(pro){ projectId = pro.pid}})

    if(projectId)
    {
      this.http.put(`${this.baseUrl}/updatetask`,task).subscribe((res)=>this.loadTasks(projectId));
    }
  }

  getProject(project:ProjectDataType)
  {
    this.getProjects.next(project);
    this.loadTasks(project.pid);
    
  }

}
