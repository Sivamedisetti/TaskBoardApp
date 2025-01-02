import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SavetaskserviceService } from '../../services/savetaskservice.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent implements OnInit {
  buttonText: string = '';
  popUpTitle: string = ''; 
  proid:string ="";
  taskData = {
    taskName: '',
    startDate: '',
    endDate: '',
    status: ''
  };

  constructor(
    private dialog: MatDialog,
    private taskService: SavetaskserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    
    this.taskService.getProjects.subscribe((pro:any)=>this.proid = pro.pid)
    // Assign `data` values here, after it is injected
    this.taskData = {
      taskName: this.data.taskName || '',
      startDate: this.data.startDate || '',
      endDate: this.data.deadlineDate || '',
      status: this.data.type || 'Todo',
    };
    
    this.buttonText = this.data.operation === 'Save' ? 'Save' : 'Add';
    this.popUpTitle = this.data.heading || 'Default Heading';
  }

  onSubmit(taskForm: NgForm) {
    this.buttonText === 'Save' ? this.updateTask(taskForm) : this.save(taskForm);
  }

  canceldialog() {
    this.dialog.closeAll();
  }

  save(taskForm: NgForm) {
    if (taskForm.valid) {
      const taskData = {
        taskName: this.taskData.taskName,
        startDate: this.taskData.startDate,
        deadlineDate: this.taskData.endDate,
        status: this.taskData.status,
        taskId: Date.now().toString(),
        pid:this.proid
      };
      // console.log("Saving task:", taskData); 
      this.taskService.addTask(taskData); // Call service to save task
      this.resetTaskData();
      this.dialog.closeAll();
    }
    else {
      taskForm.controls['taskName'].markAsTouched();
      taskForm.controls['startDate'].markAsTouched();
      taskForm.controls['endDate'].markAsTouched();
    }
  }

  updateTask(taskForm: NgForm) {
    if (taskForm.valid) {
      const taskData = {
        taskName: this.taskData.taskName,
        startDate: this.taskData.startDate,
        deadlineDate: this.taskData.endDate,
        status: this.taskData.status,
        taskId: this.data.taskId,
        pid:this.proid
      };
      this.taskService.updateTask(taskData);
      this.dialog.closeAll();
    }
  }

  private resetTaskData() {
    this.taskData = {
      taskName: '',
      startDate: '',
      endDate: '',
      status: this.data.type,
    };
  }
}
