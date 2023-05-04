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
    skills: [] as string[],
    cv_instructions: ''
  };

  skillsInput = '';

  constructor(
    private cvService: CvService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {}

  onSubmit(): void {
    this.spinnerService.show();
    this.cvService.generateCv(this.formData).subscribe(
      () => {
        this.spinnerService.hide();
        this.formSubmitted.emit(this.formData);
        if (this.cvService.pdfBlob) {
          const cvPdfUrl = URL.createObjectURL(this.cvService.pdfBlob);
          this.pdfGenerated.emit(cvPdfUrl);
        }
      },
      error => {
        console.error('Error generating CV:', error);
        this.spinnerService.hide();
      }
    );
  }

  addDegree(): void {
    this.formData.education.push({
      school: '',
      degree: '',
      startDate: '',
      endDate: ''
    });
  }

  addJob(): void {
    this.formData.workExperience.push({
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      summary: ''
    });
  }

  parseSkills(): void {
    this.formData.skills = this.skillsInput
      .split(',')
      .map(skill => skill.trim());
  }
}
