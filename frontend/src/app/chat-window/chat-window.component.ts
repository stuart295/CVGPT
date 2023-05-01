import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CvService } from '../services/cv.service';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  @Input() chatMessages: string[] = [];
  @Output() pdfGenerated = new EventEmitter<any>();
  inputMessage: string = '';

  constructor(private cvService: CvService) {}

  sendMessage() {
    if (this.inputMessage.trim() !== '') {
      this.chatMessages.push(this.inputMessage);
      let instr = {"instr": this.inputMessage}

      this.cvService.editCv(instr).subscribe(
      (response) => {
        if (this.cvService.pdfBlob) {
          const cvPdfUrl = URL.createObjectURL(this.cvService.pdfBlob);
          this.pdfGenerated.emit(cvPdfUrl);
        }
      },
      (error) => {
        console.error('Error editing CV:', error);
      }
    );

      this.inputMessage = '';
    }
  }
}
