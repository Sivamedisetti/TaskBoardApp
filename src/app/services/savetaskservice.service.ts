import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


interface ProjectDataType{
  id: number;
  titleName:string;
  task :any[]
}

@Injectable({
  providedIn: 'root'
})

export class SavetaskserviceService {
  private _tasks = new BehaviorSubject<any[]>(this.loadTasks(0));
  private getProjects = new BehaviorSubject<ProjectDataType |null>(null);
  tasks = this._tasks.asObservable();
  projects = this.getProjects.asObservable();
  

  constructor() {}

  // Checking if localStorage is available
  public isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Load tasks from localStorage
  public loadTasks(proId:number): any[] {
    var newTask:any[] = []; 
    if (this.isLocalStorageAvailable()) {
      const project = JSON.parse(localStorage.getItem('Projects') || "[]")
      const ind = project.findIndex((it:any)=>it.id === proId)
      if(ind !== -1){
        newTask = [...project[ind].task || []]
      }
    }
    return newTask;
  }

  // Add a task to localStorage and update the observable
  addTask(task: any) {
    let projectId:number = 0;

  this.projects.subscribe((pro)=>{if(pro){ projectId = pro.id}})


    const currentTasks = this.loadTasks(projectId);  
    currentTasks.push(task);
    if (this.isLocalStorageAvailable()) {
      let get_project = JSON.parse(localStorage.getItem('Projects')|| '[]');
      const ind = get_project.findIndex((it:ProjectDataType) => it.id === projectId);
      if(ind !== -1)
      {
        get_project[ind].task = [...currentTasks];
        localStorage.setItem('Projects',JSON.stringify(get_project));
      }
    }
    this._tasks.next(currentTasks);
      // Update the observable
  }

  // Update an existing task
  updateTask(task: any) {
    let projectId:number = 0;
    this.projects.subscribe((pro)=>{if(pro){ projectId = pro.id}})

    const tasks = this.loadTasks(projectId);
    const index = tasks.findIndex((it) => it.id === task.id);
    if (index !== -1) {
      tasks[index] = {...tasks[index],...task};
      if (this.isLocalStorageAvailable()) {
        let get_project= JSON.parse(localStorage.getItem('Projects')|| '[]')
        const ind = get_project.findIndex((it:ProjectDataType)=>it.id === projectId);
        if(ind!== -1)
        {
          get_project[ind].task = tasks;
          localStorage.setItem('Projects',JSON.stringify(get_project));
        }
      }
    }
    this._tasks.next(tasks); // Update the observable
  }

  getProject(project:ProjectDataType)
  {
    this.getProjects.next(project);
    const task = this.loadTasks(project.id);
    this._tasks.next(task);
    
  }

}
