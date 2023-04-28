import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  formSubmitted: boolean = false;
  chatMessages: string[] = [];

  onFormSubmitted(formData: any) {
    this.formSubmitted = true;
    this.chatMessages.push('Form submitted with data:');
    this.chatMessages.push(JSON.stringify(formData, null, 2));
  }
}
