import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CvFormComponent } from './cv-form/cv-form.component';
import { ChatWindowComponent } from './chat-window/chat-window.component';
import { FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';


@NgModule({
  declarations: [
    AppComponent,
    CvFormComponent,
    ChatWindowComponent,
    PdfViewerComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
     HttpClientModule,
     FormsModule,
     PdfViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
