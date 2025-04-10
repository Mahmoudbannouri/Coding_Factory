import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { ChartsModule } from 'ng2-charts';
import { ChartistModule} from 'ng-chartist';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgApexchartsModule } from "ng-apexcharts";
import { ChartsRoutingModule } from "./charts-routing.module";

import { ChartistComponent } from "./chartist/chartist.component";
import { ChartjsComponent } from "./chartjs/chartjs.component";
import { NGXChartsComponent } from "./ngx-charts/ngx-charts.component";
import { ApexComponent } from './apex/apex.component';

@NgModule({
    imports: [
        CommonModule,
        ChartsRoutingModule,
        ChartsModule,
        ChartistModule,
        NgxChartsModule,
        NgApexchartsModule
    ],
    declarations: [
        ChartistComponent,
        ChartjsComponent,
        NGXChartsComponent,
        ApexComponent
    ],
})
export class ChartsNg2Module { }
