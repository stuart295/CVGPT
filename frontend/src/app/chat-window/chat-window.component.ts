import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  @Input() chatMessages: string[] = [];
  inputMessage: string = '';

  sendMessage() {
    if (this.inputMessage.trim() !== '') {
      this.chatMessages.push(this.inputMessage);
      this.inputMessage = '';
    }
  }
}
