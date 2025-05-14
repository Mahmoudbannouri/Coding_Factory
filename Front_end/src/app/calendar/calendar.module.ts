import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { NgbModalModule, NgbDatepickerModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarRoutingModule } from "./calendar-routing.module";

import { CalendarsComponent } from "./calendar.component";
import { DateTimePickerComponent } from './date-time-picker.component';
import { HttpClientModule } from '@angular/common/http';
import { PfeService } from 'app/services/pfe.service';

@NgModule({
    imports: [
        CommonModule,
        CalendarRoutingModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory
          }),
        NgbModalModule,
        NgbDatepickerModule,
        NgbTimepickerModule,
        FormsModule,
        HttpClientModule,
    ],
    declarations: [
        CalendarsComponent,
        DateTimePickerComponent
    ],
    providers: [PfeService],
    exports: [CalendarsComponent]
})
export class CalendarsModule { }