import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CvService } from '../services/cv.service';
import { SpinnerService } from '../shared/spinner.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  @Input() chatMessages: string[] = [];
  @Output() pdfGenerated = new EventEmitter<any>();
  inputMessage: string = '';
  @Input() cvPdfUrl: string | null = null;

  constructor(private cvService: CvService, private spinnerService: SpinnerService) {}

  sendMessage() {
    if (this.inputMessage.trim() !== '') {
      this.chatMessages.push(this.inputMessage);
      let instr = {"instr": this.inputMessage}

      this.spinnerService.show();
      this.cvService.editCv(instr).subscribe(
      (response) => {
        this.spinnerService.hide();
        if (this.cvService.pdfBlob) {
          this.cvPdfUrl = URL.createObjectURL(this.cvService.pdfBlob);
          this.pdfGenerated.emit(this.cvPdfUrl);
        }
      },
      (error) => {
        console.error('Error editing CV:', error);
        this.spinnerService.hide();
      }
    );

      this.inputMessage = '';
    }
  }

  downloadPdf() {
    if (this.cvPdfUrl) {
      const link = document.createElement('a');
      link.href = this.cvPdfUrl;
      link.download = 'cv.pdf';
      link.click();
    }
  }
}
