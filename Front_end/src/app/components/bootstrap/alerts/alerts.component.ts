import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

//Interface
export interface IAlert {
  id: number;
  title: string;
  type: string;
  message: string;
}

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})

export class AlertsComponent implements OnInit {
  @Input()
  public alerts: Array<IAlert> = [];

  private backup: Array<IAlert>;

  private _success = new Subject<string>();

  staticAlertClosed = false;
  successMessage: string;
  // Closable Alert's code
  constructor() {
    this.alerts.push(
      {
        id: 1,
        title: "Primary Alert",
        type: 'primary',
        message: 'Good Morning! Start your day with some alerts.',
      },
      {
        id: 2,
        title: "Secondary Alert",
        type: 'secondary',
        message: 'Hello! This is secondary alert - check it out.',
      },
      {
        id: 3,
        title: "Success Alert",
        type: 'success',
        message: 'Well done! You successfully read this important alert message.',
      },
      {
        id: 4,
        title: "Danger Alert",
        type: 'danger',
        message: 'Oh snap! Change a few things up and submit again.',
      },
      {
        id: 5,
        title: "Info Alert",
        type: 'info',
        message: "Heads up! This alert needs your attention, but it's not super important.",
      },
      {
        id: 6,
        title: "Warning Alert",
        type: 'warning',
        message: "Warning! Better check yourself, you're not looking too good.",
      },
      {
        id: 7,
        title: "Light Alert",
        type: 'light',
        message: 'Hello! This is light alert - check it out.',
      },
      {
        id: 8,
        title: "Dark Alert",
        type: 'dark',
        message: 'Hello! This is dark alert - check it out.',
      });
    this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));
  }

  // Close Alert on close icon click
  public closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  // Reset all the alerts on click of reset button
  public reset() {
    this.alerts = this.backup.map((alert: IAlert) => Object.assign({}, alert));
  }

  ngOnInit(): void {
    // Auto close alert timer
    setTimeout(() => this.staticAlertClosed = true, 20000);

    // Success message
    this._success.subscribe((message) => this.successMessage = message);

    // Subscribe section code
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }

  // Self closing alert's message change code
  public changeSuccessMessage() {
    this._success.next(`${new Date()} - Message successfully changed.`);
  }
}
