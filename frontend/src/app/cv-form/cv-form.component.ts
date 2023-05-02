import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CvService } from '../services/cv.service';
import { SpinnerService } from '../shared/spinner.service';


@Component({
  selector: 'app-cv-form',
  templateUrl: './cv-form.component.html',
  styleUrls: ['./cv-form.component.css']
})
export class CvFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() pdfGenerated = new EventEmitter<any>();

  formData = {
    name: '',
    email: '',
    phone: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      facebook: ''
    },
    summary: '',
    education: [
      {
        school: '',
        degree: '',
        startDate: '',
        endDate: ''
      }
    ],
    workExperience: [
      {
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        summary: ''
      }
    ],
    skills: []  as string[]
  };

  skillsInput: string = '';

  ngOnInit(): void {}

  constructor(private cvService: CvService, private spinnerService: SpinnerService) {}

  onSubmit() {
    this.spinnerService.show();
    this.cvService.generateCv(this.formData).subscribe(
      (response) => {
        this.spinnerService.hide();
        this.formSubmitted.emit(this.formData);
        if (this.cvService.pdfBlob) {
          const cvPdfUrl = URL.createObjectURL(this.cvService.pdfBlob);
          this.pdfGenerated.emit(cvPdfUrl);
        }
      },
      (error) => {
        console.error('Error generating CV:', error);
        this.spinnerService.hide();
      }
    );
  }

  addDegree() {
    this.formData.education.push({
      school: '',
      degree: '',
      startDate: '',
      endDate: ''
    });
  }

  addJob() {
    this.formData.workExperience.push({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      summary: ''
    });
  }

  parseSkills() {
   this.formData.skills  = this.skillsInput.split(',').map(skill => skill.trim());
  }
}
