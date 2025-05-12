import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // ✅ Import ReactiveFormsModule
import { EntrepriseRoutingModule } from './entreprise-routing.module';
import { EntrepriseComponent } from './entreprise.component';
import { EntrepriseAddComponent } from './entreprise-add/entreprise-add.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    EntrepriseComponent,
    EntrepriseAddComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // ✅ Required for formGroup and formControlName
    EntrepriseRoutingModule,
    NgxSpinnerModule,
  ],
})
export class EntrepriseModule {}
