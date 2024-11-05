import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
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
    console.log("Dialog data:", this.data); // Check if data is received correctly
    
    // Assign `data` values here, after it is injected
    this.taskData = {
      taskName: this.data.taskName || '',
      startDate: this.data.startDate || '',
      endDate: this.data.deadlineDate || '',
      status: this.data.type || 'ToDo',
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
        id: Date.now(), // Add a unique ID for each task
      };
      // console.log("Saving task:", taskData); // Log to verify data before saving
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
        id: this.data.id,
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
