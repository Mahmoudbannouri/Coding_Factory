import { Component, ViewEncapsulation } from '@angular/core';

import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';


@Component({
  selector: 'app-tags-input',
  templateUrl: './tags-input.component.html',
  styleUrls: ['./tags-input.component.scss', '../../../../assets/sass/libs/input-tags.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TagsInputComponent {

  form: UntypedFormGroup;

  constructor(private http: HttpClient) {
    this.form = new UntypedFormBuilder().group({
      chips: [['chip'], []]
    });
  }

  disabled = true;

  items = ['Javascript', 'Typescript'];
  items1 = ['Javascript', 'Typescript'];
  items2 = ['Javascript', 'Typescript'];
  items3 = ['Javascript', 'Typescript'];
  items4 = ['Javascript', 'Typescript'];

  inputText = 'text';

  itemsAsObjects = [{ id: 0, name: 'Angular', readonly: true }, { id: 1, name: 'React' }];

  autocompleteItems = ['Item1', 'item2', 'item3'];

  autocompleteItemsAsObjects = [
    { value: 'Item1', id: 1, extra: 1 },
    { value: 'item2', id: 2, extra: 1 },
    { value: 'item3', id: 3, extra: 1 }
  ];

  dragAndDropExample = ['C#', 'Java'];

  dragAndDropObjects = [{ display: 'Javascript', value: 'Javascript' }, { display: 'Typescript', value: 'Typescript' }];
  dragAndDropStrings = ['CoffeScript', 'Scala.js'];



  public requestAutocompleteItems = (text: string): Observable<any> => {
    const url = `https://api.github.com/search/repositories?q=${text}`;
    return this.http
      .get<any>(url)
      .pipe(map(items => items.map(item => item.full_name)));
  }

  public requestAutocompleteItemsFake = (text: string): Observable<string[]> => {
    return of([
      'item1', 'item2', 'item3'
    ]);
  };

  public options = {
    readonly: undefined,
    placeholder: '+ Tag'
  };

  public onAdd(item) {
    console.log('tag added: value is ' + item);
  }

  public onRemove(item) {
    console.log('tag removed: value is ' + item);
  }

  public onSelect(item) {
    console.log('tag selected: value is ' + item);
  }

  public onFocus(item) {
    console.log('input focused: current value is ' + item);
  }

  public onTextChange(text) {
    console.log('text changed: value is ' + text);
  }

  public onBlur(item) {
    console.log('input blurred: current value is ' + item);
  }

  public onTagEdited(item) {
    console.log('tag edited: current value is ' + item);
  }

  public onValidationError(item) {
    console.log('invalid tag ' + item);
  }


  public transform(value: string): Observable<object> {
    const item = { display: `@${value}`, value: `@${value}` };
    return of(item);
  }

  private startsWithAt(control: UntypedFormControl) {
    if (control.value.charAt(0) !== '@') {
      return {
        'startsWithAt@': true
      };
    }

    return null;
  }

  private endsWith$(control: UntypedFormControl) {
    if (control.value.charAt(control.value.length - 1) !== '$') {
      return {
        'endsWith$': true
      };
    }

    return null;
  }

  private validateAsync(control: UntypedFormControl): Promise<any> {
    return new Promise(resolve => {
      const value = control.value;
      const result: any = isNaN(value) ? {
        isNan: true
      } : null;

      setTimeout(() => {
        resolve(result);
      }, 1);
    });
  }

  public asyncErrorMessages = {
    isNan: 'Please only add numbers'
  };

  public validators = [this.startsWithAt, this.endsWith$];

  public asyncValidators = [this.validateAsync];

  public errorMessages = {
    'startsWithAt@': 'Your items need to start with \'@\'',
    'endsWith$': 'Your items need to end with \'$\''
  };

  public onAdding(tag): Observable<any> {
    const confirm = window.confirm('Do you really want to add this tag?');
    return of(tag)
      .pipe(filter(() => confirm));
  }

  public onRemoving(tag): Observable<any> {
    const confirm = window.confirm('Do you really want to remove this tag?');
    return of(tag)
      .pipe(filter(() => confirm));
  }

  public asyncOnAdding(tag): Observable<any> {
    const confirm = window.confirm('Do you really want to add this tag?');
    return of(tag)
      .pipe(filter(() => confirm));
  }

}
