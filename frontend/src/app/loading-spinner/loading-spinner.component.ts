import { Component, OnInit, OnDestroy } from '@angular/core';
import { SpinnerService } from '../shared/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css'],
})
export class LoadingSpinnerComponent implements OnInit, OnDestroy {
  isLoading = false;
  private subscription!: Subscription;

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit() {
    this.subscription = this.spinnerService.getLoadingStatus().subscribe(status => {
      this.isLoading = status;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
