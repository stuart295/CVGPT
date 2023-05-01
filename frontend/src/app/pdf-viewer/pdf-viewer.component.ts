import { Component, Input, OnInit } from '@angular/core';

interface CustomPDFAnnotationData {
  subtype: string;
  url?: string;
}


@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {
  @Input() pdfUrl: any;

  constructor() { }

  ngOnInit(): void {}

   onPdfLoaded(pdf: any): void {
  console.log("LOADED");
  const numPages = pdf.numPages;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    pdf.getPage(pageNum).then((page: any) => {
      page.getAnnotations().then((annotations: CustomPDFAnnotationData[]) => {
        annotations.forEach((annotation) => {
          const linkElement = document.querySelector(
            `a[href='${annotation.url}']`
          );

          if (linkElement) {
            linkElement.addEventListener('click', (event: Event) => {
              console.log('Clicked section label:', annotation.url);
              event.preventDefault();

              // Perform actions based on the clicked section label
            });
          }
        });
      });
    });
  }
}

//   onPdfLoaded(pdf: any): void {
//     console.log("LOADED");
//     const numPages = pdf.numPages;
//
//     for (let pageNum = 1; pageNum <= numPages; pageNum++) {
//       pdf.getPage(pageNum).then((page: any) => {
//         console.log("page " + pageNum);
//         page.getAnnotations().then((annotations: CustomPDFAnnotationData[]) => {
//           console.log(annotations);
//           annotations.forEach((annotation) => {
//             if (annotation.subtype === 'Link' && annotation.url) {
//               const linkElement = document.querySelector(
//                 `a[href='${annotation.url}']`
//               );
//
//               if (linkElement) {
//                 linkElement.addEventListener('click', (event: Event) => {
//                   event.preventDefault();
//                   console.log('Clicked section label:', annotation.url);
//                   // Perform actions based on the clicked section label
//                 });
//               }
//             }
//           });
//         });
//       });
//     }
//   }


}
