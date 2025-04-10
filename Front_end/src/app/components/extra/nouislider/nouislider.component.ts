import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from "@angular/forms";
import { NouiFormatter } from "ng2-nouislider";


export class TimeFormatter implements NouiFormatter {
  to(value: number): string {
    let h = Math.floor(value / 3600);
    let m = Math.floor(value % 3600 / 60);
    let s = value - 60 * m - 3600 * h;
    let values = [h, m, s];
    let timeString: string = '';
    let i = 0;
    for(let v of values) {
      if(values[i] < 10)
        timeString += '0';
        timeString += values[i].toFixed(0);
      if(i < 2) {
        timeString += ':';
      }
      i++;
    }
    return timeString;
  };

  from(value: string): number {
    let v = value.split(':').map(parseInt);
    let time: number = 0;
    time += v[0] * 3600;
    time += v[1] * 60;
    time += v[2];
    return time;
  }
}


@Component({
    selector: 'app-nouislider',
    templateUrl: './nouislider.component.html',
    styleUrls: ['./nouislider.component.scss']
})

export class NouiSliderComponent implements OnInit {
  // Variable Declaration
  public disabled: boolean = false;
  public keyupLabelOn: boolean = false;
  public keydownLabelOn: boolean = false;

  public someValue: number = 5;
  public someMin: number = -10;
  public someMax: number = 10;
  public someRange: number[] = [3, 7];
  public someRange2: number[] = [10, 15];
  public someRange3: number[] = [2, 8];

  //Horizontal
  public someRangeprimaryH: number[] = [45, 55];
  public someRangeSuccessH: number[] = [40, 60];
  public someRangeInfoH: number[] = [35, 65];
  public someRangeWarningH: number[] = [45, 55];
  public someRangeDangerH: number[] = [40, 60];
  public someRangeSecondaryH: number[] = [35, 65];

  //Vertival

  public verticalconfig: any = {
    orientation: 'vertical'
  };

  public verticalHandleConfig: any = {
    orientation: 'vertical'
  };

  public verticalSquareHandleConfig: any = {
    orientation: 'vertical'
  };

  public verticalFilledHandleConfig: any = {
    orientation: 'vertical'
  };

  public valueDefaultVS: number = 20;
  public valueInfoVS: number = 50;
  public valueSuccessVS: number = 20;
  public valueWarningVS: number = 50;
  public valueDangerVS: number = 20;

  public RangeprimaryV: number[] = [40, 60];
  public RangeSuccessV: number[] = [35, 65];
  public RangeInfoV: number[] = [30, 70];
  public RangeWarningV: number[] = [25, 75];
  public RangeDangerV: number[] = [20, 80];

  public RangeprimaryHandleV: number[] = [45, 55];
  public RangeSuccessHandleV: number[] = [40, 60];
  public RangeInfoHandleV: number[] = [35, 65];
  public RangeWarningHandleV: number[] = [30, 70];
  public RangeDangerHandleV: number[] = [25, 75];

  public RangeprimarySquareHandleV: number[] = [45, 55];
  public RangeSuccessSquareHandleV: number[] = [40, 60];
  public RangeInfoSquareHandleV: number[] = [35, 65];
  public RangeWarningSquareHandleV: number[] = [30, 70];
  public RangeDangerSquareHandleV: number[] = [25, 75];

  public RangeprimaryFilledHandleV: number[] = [45, 55];
  public RangeSuccessFilledHandleV: number[] = [40, 60];
  public RangeInfoFilledHandleV: number[] = [35, 65];
  public RangeWarningFilledHandleV: number[] = [30, 70];
  public RangeDangerFilledHandleV: number[] = [25, 75];

  public RangeTooltipV: number[] = [20, 80];
  public RangeTooltipV1: number[] = [20, 80];
  public RangeTooltipV2: number[] = [20, 80];


  public someTime: number = 55000;
  public someRange2config: any = {
    behaviour: 'drag',
    connect: true,
    margin: 1,
    limit: 5,
    range: {
      min: 0,
      max: 20
    },
    pips: {
      mode: 'steps',
      density: 5
    }
  };

  // Keyboard Support
  public someKeyboard: number[] = [1, 3];

  // Keyboard Support Configuration
  public someKeyboardConfig: any = {
    behaviour: 'drag',
    connect: true,
    start: [0, 5],
    keyboard: true,
    step: 0.1,
    pageSteps: 10,  // number of page steps, defaults to 10
    range: {
      min: 0,
      max: 5
    },
    pips: {
      mode: 'count',
      density: 2,
      values: 6,
      stepped: true
    }
  };

  // With Custom Key Handler
  public someKeyboard2: number[] = [1, 3];
  public form1: UntypedFormGroup;
  public form2: UntypedFormGroup;

  // With Custom Key Handler Support
  public someTimeConfig: any = {
    start: 86400 / 2,
    range: {
      min: 0,
      max: 86399
    },
    tooltips: new TimeFormatter(),
    step: 1
  };

  constructor (
    private formBuilder: UntypedFormBuilder
  ) {}

  public ngOnInit () {
    this.form1 = this.formBuilder.group({ 'single': [ 10 ] });
    this.form2 = this.formBuilder.group({ 'range': [ [ 2, 8 ] ] });
  }

  // EventHandler
  public someKeyboard2EventHandler = (e: KeyboardEvent) => {
   //your code here

    // determine which handle triggered the event
    let index = parseInt((<HTMLElement>e.target).getAttribute('data-handle'));

    let multiplier: number = 0;
    let stepSize = 0.1;

    switch ( e.which ) {
      case 40:  // ArrowDown
      case 37:  // ArrowLeft
        multiplier = -2;
        e.preventDefault();
        break;

      case 38:  // ArrowUp
      case 39:  // ArrowRight
        multiplier = 3;
        e.preventDefault();
        break;

      default:
        break;
    }

    let delta = multiplier * stepSize;
    let newValue = [].concat(this.someKeyboard2);
    newValue[index] += delta;
    this.someKeyboard2 = newValue;
  };

  public someKeyboardConfig2: any = {
    behaviour: 'drag',
    connect: true,
    start: [0, 5],
    step: 0.1,
    range: {
      min: 0,
      max: 5
    },
    pips: {
      mode: 'count',
      density: 2,
      values: 6,
      stepped: true
    },
    keyboard: true,
    onKeydown: this.someKeyboard2EventHandler,
  };
}
