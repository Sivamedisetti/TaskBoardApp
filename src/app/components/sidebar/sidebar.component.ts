import { Component, Inject, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { SavetaskserviceService } from '../../services/savetaskservice.service';
import { SaveprojectService } from '../../services/saveproject.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { error } from 'console';



interface ProjectDataType {
  pid: string;
  title: string;
  tasks: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  Projects: any[] = [];
  projectsLoaded:boolean = true;
  selectedProjectTitle: string | null = null;
  private baseUrl: string = "https://taskboardapp-backend.onrender.com";
  // private baseUrl: string = "http://localhost:3000";

  flag:boolean = false;
  constructor(
    private savetaskservice: SavetaskserviceService,
    private saveprojectservice: SaveprojectService,
    private http: HttpClient
    
  ) {}

  ngOnInit() {
    this.loadProjects();
    this.saveprojectservice.updatedFormenu.subscribe((res)=>this.flag = res);

  }
  
  // Load projects from DB
  loadProjects() {
    this.http.get<any[]>(`${this.baseUrl}/getproject`).subscribe(
      (res)=>{this.Projects = res,
        this.projectsLoaded = true
      },
      (error) => {this.projectsLoaded = false,
        swal("Error!", "Failed to load projects check Network Ones!", "error")}
    )
  }
  addProject() {
    swal({
        title: "Enter your project name",
        content: {
            element: "input",
            attributes: {
                placeholder: "Project name",
                type: "text",
            },
        },
        buttons: ["Cancel", "Add"],
        className: "custom-swal",
    }).then((projectName) => {
        if (projectName.trim()) {
            // Check for duplicates
            if (this.Projects.some(project => project.title === projectName.trim())) {
                swal("Error!", "Project name already exists.", "error");
                return;
            }

            const newProject: ProjectDataType = {
                pid: Date.now().toString(),
                title: projectName.trim(),
                tasks: "",
            };
            this.http.post(`${this.baseUrl}/addproject`,newProject).subscribe(
              (res)=>{
                this.Projects.push(newProject);
                swal("Success!", "Your project has been added.", "success");
              },
              (error)=>{
                swal("Error!", "Failed to save the project.", "error");
              }
            )
        } 
        else {
            swal("Oops!","No project name provided.");
        }
    });


  }

  sendtitletoservice(project: ProjectDataType) {
    this.selectedProjectTitle = project.title;
    this.saveprojectservice.sendtitle(project.title);
    this.savetaskservice.getProject(project);
  }


}
