import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidationFormsComponent } from "./validation/validation-forms.component";
import { InputsComponent } from './elements/inputs/inputs.component';
import { InputGroupsComponent } from './elements/input-groups/input-groups.component';
import { ArchwizardComponent } from './archwizard/archwizard.component';
import { RadioComponent } from './elements/radio/radio.component';
import { CheckboxComponent } from './elements/checkbox/checkbox.component';
import { SwitchComponent } from './elements/switch/switch.component';
import { DatepickerComponent } from './elements/datepicker/datepicker.component';
import { TimepickerComponent } from './elements/timepicker/timepicker.component';
import { LayoutComponent } from './layout/layout.component';
import { EditorComponent } from './elements/editor/editor.component';
import { TagsInputComponent } from './elements/tags-input/tags-input.component';
import { SelectComponent } from './elements/select/select.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'inputs',
        component: InputsComponent,
        data: {
          title: 'Inputs'
        }
      },
      {
        path: 'input-groups',
        component: InputGroupsComponent,
        data: {
          title: 'Input Groups'
        }
      },
      {
        path: 'radio',
        component: RadioComponent,
        data: {
          title: 'Radio'
        }
      },
      {
        path: 'checkbox',
        component: CheckboxComponent,
        data: {
          title: 'Checkbox'
        }
      },
      {
        path: 'switch',
        component: SwitchComponent,
        data: {
          title: 'Switch'
        }
      },
      {
        path: 'datepicker',
        component: DatepickerComponent,
        data: {
          title: 'Datepicker'
        }
      },
      {
        path: 'timepicker',
        component: TimepickerComponent,
        data: {
          title: 'Timepicker'
        }
      },
      {
        path: 'editor',
        component: EditorComponent,
        data: {
          title: 'Quill Editor'
        }
      },
      {
        path: 'tags',
        component: TagsInputComponent,
        data: {
          title: 'Tags'
        }
      },
      {
        path: 'switch',
        component: SwitchComponent,
        data: {
          title: 'Switch'
        }
      },
      {
        path: 'select',
        component: SelectComponent,
        data: {
          title: 'Select'
        }
      },
      {
        path: 'layout',
        component: LayoutComponent,
        data: {
          title: 'Layout'
        }
      },
      {
        path: 'validation',
        component: ValidationFormsComponent,
        data: {
          title: 'Validation Forms'
        }
      },
      {
        path: 'archwizard',
        component: ArchwizardComponent,
        data: {
          title: 'Angular Wizard Forms'
        }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule { }
