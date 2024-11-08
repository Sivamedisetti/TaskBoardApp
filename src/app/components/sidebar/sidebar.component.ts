import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { SavetaskserviceService } from '../../services/savetaskservice.service';
import { SaveprojectService } from '../../services/saveproject.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



interface ProjectDataType {
  id: number;
  titleName: string;
  task: any[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  Projects: ProjectDataType[] = [];

  selectedProjectTitle: string | null = null;

  constructor(
    private savetaskservice: SavetaskserviceService,
    private saveprojectservice: SaveprojectService,
    private http: HttpClient
    
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  // Load projects from localStorage
  loadProjects() {
    if (this.savetaskservice.isLocalStorageAvailable()) {
      this.Projects = JSON.parse(localStorage.getItem('Projects') || '[]');
    }
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
        if (projectName && projectName.trim()) {
            // Check for duplicates
            if (this.Projects.some(project => project.titleName === projectName.trim())) {
                swal("Error!", "Project name already exists.", "error");
                return;
            }

            const newProject: ProjectDataType = {
                id: Date.now(),
                titleName: projectName.trim(),
                task: [],
            };

            this.Projects.push(newProject);

            if (this.savetaskservice.isLocalStorageAvailable()) {
                try {
                    localStorage.setItem('Projects', JSON.stringify(this.Projects));
                    swal("Success!", "Your project has been added.", "success");
                } catch (error) {
                    console.error("Failed to save project:", error);
                    swal("Error!", "Failed to save the project.", "error");
                }
            }
        } else {
            console.log("No project name provided.");
        }
    });


  }

  sendtitletoservice(project: ProjectDataType) {
    this.selectedProjectTitle = project.titleName;
    this.saveprojectservice.sendtitle(project.titleName);
    this.savetaskservice.getProject(project);
  }
}
