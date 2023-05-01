import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CvService } from '../services/cv.service';


@Component({
  selector: 'app-cv-form',
  templateUrl: './cv-form.component.html',
  styleUrls: ['./cv-form.component.css']
})
export class CvFormComponent implements OnInit {
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() pdfGenerated = new EventEmitter<string>();

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

  constructor(private cvService: CvService) {
    this.cvService.pdfGenerated.subscribe(() => {
      if (this.cvService.pdfBlob) {
        const cvPdfUrl = URL.createObjectURL(this.cvService.pdfBlob);
        this.pdfGenerated.emit(cvPdfUrl);
      }
    });
  }

  onSubmit() {
    this.cvService.generateCv(this.formData).subscribe(
      (response) => {
        this.formSubmitted.emit(this.formData);
      },
      (error) => {
        console.error('Error generating CV:', error);
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
