import { Component } from '@angular/core';
import * as Chartist from 'chartist';
import { ChartType, ChartEvent } from "ng-chartist";

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexLegend,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexTheme,
  ApexNonAxisChartSeries,
  ApexResponsive
} from "ng-apexcharts";

declare var require: any;

const data: any = require('../../shared/data/chartist.json');
import * as chartsData from '../../shared/data/chartjs';

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  colors: string[],
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[],
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels,
  stroke: ApexStroke,
  grid: ApexGrid,
  legend?: ApexLegend,
  tooltip?: ApexTooltip,
  plotOptions?: ApexPlotOptions,
  labels?: string[],
  fill: ApexFill,
  markers?: ApexMarkers,
  theme: ApexTheme,
  responsive: ApexResponsive[]
};

var $info = "#2F8BE6",
$info_light = "#ACE0FC"
var themeColors = [$info, $info_light];


export interface Chart {
  type: ChartType;
  data: Chartist.IChartistData;
  options?: any;
  responsiveOptions?: any;
  events?: ChartEvent;
}

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss']
})

export class Dashboard2Component {

  columnChartOptions : Partial<ChartOptions>;

  constructor() {

  this.columnChartOptions = {
    chart: {
      height: 350,
      type: 'bar',
      toolbar: {
        show: false
      },
      animations: {
        enabled: false
      }
    },
    colors: themeColors,
    plotOptions: {
      bar: {
        horizontal: false,
        endingShape: 'rounded',
        columnWidth: '25%',
      },
    },
    grid: {
      borderColor: "#BDBDBD44"
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    series: [{
      name: 'Net Profit',
      data: [40, 50, 110, 90, 85, 115, 100, 90]
    }, {
      name: 'Revenue',
      data: [30, 40, 100, 80, 75, 105, 90, 80]
    }],
    legend: {
      show: false
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      axisBorder: {
        color: "#BDBDBD44"
      }
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + val + " thousands"
        }
      }
    }
  }

}


  // barChart
  public barChartOptions = chartsData.barChartOptions;
  public barChartLabels = chartsData.barChartLabels;
  public barChartType = chartsData.barChartType;
  public barChartLegend = chartsData.barChartLegend;
  public barChartData = chartsData.barChartData;
  public barChartColors = chartsData.barChartColors;

  //Column chart



  // Line chart configuration Starts
  WidgetlineChart: Chart = {
    type: 'Line', data: data['WidgetlineDashboard2Chart'],
    options: {
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0,
      },
      axisY: {
        showGrid: false,
        low: 50,
        showLabel: false,
        offset: 0,
      },
      fullWidth: true
    },
  };
  WidgetlineChart1: Chart = {
    type: 'Line', data: data['WidgetlineDashboard2Chart_1'],
    options: {
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0,
      },
      axisY: {
        showGrid: false,
        low: 50,
        showLabel: false,
        offset: 0,
      },
      fullWidth: true
    },
  };
  WidgetlineChart2: Chart = {
    type: 'Line', data: data['WidgetlineDashboard2Chart_2'],
    options: {
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0,
      },
      axisY: {
        showGrid: false,
        low: 50,
        showLabel: false,
        offset: 0,
      },
      fullWidth: true
    },
  };
  WidgetlineChart3: Chart = {
    type: 'Line', data: data['WidgetlineDashboard2Chart_3'],
    options: {
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0,
      },
      axisY: {
        showGrid: false,
        low: 50,
        showLabel: false,
        offset: 0,
      },
      fullWidth: true
    },
  };
  // Line chart configuration Ends

  // Line chart configuration Starts
  WidgetlineChartEarning: Chart = {
    type: 'Line', data: data['WidgetlineChartEarning'],
    options: {
      axisX: {
        showGrid: true,
        showLabel: false,
        offset: 0,
      },
      axisY: {
        showGrid: false,
        low: 40,
        showLabel: false,
        offset: 0,
      },
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      fullWidth: true
    },
    events: {
      created(data: any): void {

        var defs = data.svg.elem('defs');
        defs.elem('linearGradient', {
          id: 'widgradient1',
          x1: 0,
          y1: 1,
          x2: 0,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-color': '#226CC5'
        }).parent().elem('stop', {
          offset: 1,
          'stop-color': '#81C8F7'
        });
      },

    },
  };
  // Line chart configuration Ends

  // Donut chart configuration Starts
  DonutChart1: Chart = {
    type: 'Pie',
    data: data['DashboardDonut'],
    options: {
      donut: true,
      donutWidth: 3,
      startAngle: 0,
      chartPadding: 25,
      labelInterpolationFnc: function (value) {
        return '\ue8dd';
      }
    },
    events: {
      draw(data: any): void {
        if (data.type === 'label') {
          if (data.index === 0) {
            data.element.attr({
              dx: data.element.root().width() / 2,
              dy: (data.element.root().height() + (data.element.height() / 4)) / 2,
              class: 'ct-label',
              'font-family': 'feather'
            });
          } else {
            data.element.remove();
          }
        }
      }
    }
  };
  // Donut chart configuration Ends

  // Donut chart configuration Starts
  DonutChart2: Chart = {
    type: 'Pie',
    data: data['DashboardDonut'],
    options: {
      donut: true,
      donutWidth: 3,
      startAngle: 90,
      chartPadding: 25,
      labelInterpolationFnc: function (value) {
        return '\ue8f8';
      }
    },
    events: {
      draw(data: any): void {
        if (data.type === 'label') {
          if (data.index === 0) {
            data.element.attr({
              dx: data.element.root().width() / 2,
              dy: (data.element.root().height() + (data.element.height() / 4)) / 2,
              class: 'ct-label',
              'font-family': 'feather'
            });
          } else {
            data.element.remove();
          }
        }
      }
    }
  };
  // Donut chart configuration Ends

  // Donut chart configuration Starts
  DonutChart3: Chart = {
    type: 'Pie',
    data: data['DashboardDonut'],
    options: {
      donut: true,
      donutWidth: 3,
      startAngle: 270,
      chartPadding: 25,
      labelInterpolationFnc: function (value) {
        return '\ue879';
      }
    },
    events: {
      draw(data: any): void {
        if (data.type === 'label') {
          if (data.index === 0) {
            data.element.attr({
              dx: data.element.root().width() / 2,
              dy: (data.element.root().height() + (data.element.height() / 4)) / 2,
              class: 'ct-label',
              'font-family': 'feather'
            });
          } else {
            data.element.remove();
          }
        }
      }
    }
  };
  // Donut chart configuration Ends

  // Line area chart configuration Starts
  lineAreaChart: Chart = {
    type: 'Line',
    data: data['lineArea3'],
    options: {
      low: 0,
      showArea: true,
      fullWidth: true,
      onlyInteger: true,
      axisY: {
        low: 0,
        scaleMinSpace: 50,
      },
      axisX: {
        showGrid: false
      }
    },
    events: {
      created(data: any): void {
        var defs = data.svg.elem('defs');
        defs.elem('linearGradient', {
          id: 'gradient',
          x1: 0,
          y1: 1,
          x2: 0,
          y2: 0
        }).elem('stop', {
          offset: 0,
          'stop-opacity': '0.2',
          'stop-color': 'rgba(255, 255, 255, 1)'
        }).parent().elem('stop', {
          offset: 1,
          'stop-opacity': '0.2',
          'stop-color': 'rgba(181, 131, 255, 1)'
        });
      },
      draw(data: any): void {

        var circleRadius = 6;
        if (data.type === 'point') {
          var circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: circleRadius,
            class: 'ct-point-circle'
          });
          data.element.replace(circle);
        }
      }
    },
  };
  // Line area chart configuration Ends

  // Line chart configuration Starts
  lineChart2: Chart = {
    type: 'Line', data: data['line2'],
    options: {
      axisX: {
        showGrid: false,
      },
      axisY: {
        low: 0,
        scaleMinSpace: 50,
      },
      fullWidth: true,
    },
    responsiveOptions: [
      ['screen and (max-width: 640px) and (min-width: 381px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 2 === 0 ? value : null;
          }
        }
      }],
      ['screen and (max-width: 380px)', {
        axisX: {
          labelInterpolationFnc: function (value, index) {
            return index % 3 === 0 ? value : null;
          }
        }
      }]
    ],
    events: {
      draw(data: any): void {
        var circleRadius = 6;
        if (data.type === 'point') {
          var circle = new Chartist.Svg('circle', {
            cx: data.x,
            cy: data.y,
            r: circleRadius,
            class: 'ct-point-circle'
          });
          data.element.replace(circle);
        }
        else if (data.type === 'label') {
          // adjust label position for rotation
          const dX = data.width / 2 + (30 - data.width)
          data.element.attr({ x: data.element.attr('x') - dX })
        }
      }
    },

  };
  // Line chart configuration Ends
  onResized(event: any) {
    setTimeout(() => {
      this.fireRefreshEventOnWindow();
    }, 300);
  }

  fireRefreshEventOnWindow = function () {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("resize", true, false);
    window.dispatchEvent(evt);
  };
}
