import { Component, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { SavetaskserviceService } from '../../services/savetaskservice.service';
import { SaveprojectService } from '../../services/saveproject.service';
import swal from 'sweetalert';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.css']
})
export class TaskBoardComponent implements OnInit{
  constructor(
    private dialog:MatDialog, 
    private savaTaskService:SavetaskserviceService,
    private changetitle:SaveprojectService
  ){}
  projecttitle: string = '';
  flag:boolean = false;

  isSelected(currentStatus:string,title:string)
  {
    if(this.projecttitle === 'Select Projects')
    {
      swal(" Oops!", "Before Creating Task Please Add or Select Project!", "error");
    }
    else{
      this.openDialog(currentStatus,title);
    }
  }
  openDialog(
    status: string,
    heading:string,
    operationType?:string,
    taskName?: string,
    startDate?: string,
    deadlineDate?: string,
    taskId?:string) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '670px',
      height: '380px',
      disableClose: true,
      hasBackdrop: true,
      enterAnimationDuration:'100ms',
      exitAnimationDuration:'100ms',
      data: {
        type: status,
        taskName: taskName == null ? '' : taskName,
        startDate: startDate == null ? '' : startDate,
        deadlineDate: deadlineDate == null ? '' : deadlineDate,
        heading: heading,
        operation:operationType,
        taskId: taskId || "",
        pid:this.proid
      },
    });

  }
  tasks: any[] = [];
  todo: any[] = [];
  inProgress: any[] = [];
  inReview: any[] = [];
  completed: any[] = [];
  proid:string = ""

  ngOnInit(): void {
      this.savaTaskService.tasks.subscribe((tasks) => {
        this.tasks = tasks;
        
        console.log('Tasks Loaded:',tasks);

        this.todo = tasks.filter((task) => task.status === 'Todo');
        this.inProgress = tasks.filter((task) => task.status === 'In Progress');
        this.inReview = tasks.filter((task) => task.status === 'In Review');
        this.completed = tasks.filter((task) => task.status === 'Completed');
      });
      this.changetitle.updatedTitle.subscribe((title)=>this.projecttitle = title)

      this.savaTaskService.getProjects.subscribe((pro:any)=>{
        if(pro)
        {
          this.proid = pro.pid;
        }
      })
  }
  openSidebar()
  {
    this.flag = !this.flag;
    this.changetitle.openmenu(this.flag);
  }

}
