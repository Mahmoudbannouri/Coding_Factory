import { Component } from '@angular/core';
import * as swalFunctions from '../../../shared/data/sweet-alerts';


@Component({
    selector: 'app-sweet-alerts',
    templateUrl: './sweet-alerts.component.html',
    styleUrls: ['./sweet-alerts.component.scss']
})

export class SweetAlertsComponent  {
  swal =  swalFunctions;
}
