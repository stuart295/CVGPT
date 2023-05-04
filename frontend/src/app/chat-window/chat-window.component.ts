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
  @Output() pdfGenerated = new EventEmitter<string>();
  inputMessage = '';
  @Input() cvPdfUrl: string | null = null;

  constructor(
    private cvService: CvService,
    private spinnerService: SpinnerService
  ) {}

  sendMessage(): void {
    const message = this.inputMessage.trim();

    if (message) {
      this.chatMessages.push(message);
      const instructions = { instr: message };

      this.spinnerService.show();
      this.cvService.editCv(instructions).subscribe(
        () => {
          this.spinnerService.hide();
          if (this.cvService.pdfBlob) {
            this.cvPdfUrl = URL.createObjectURL(this.cvService.pdfBlob);
            this.pdfGenerated.emit(this.cvPdfUrl);
          }
        },
        error => {
          console.error('Error editing CV:', error);
          this.spinnerService.hide();
        }
      );

      this.inputMessage = '';
    }
  }

  downloadPdf(): void {
    if (this.cvPdfUrl) {
      const link = document.createElement('a');
      link.href = this.cvPdfUrl;
      link.download = 'cv.pdf';
      link.click();
    }
  }
}
