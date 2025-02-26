import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { UIComponentsRoutingModule } from "./ui-components-routing.module";
import { NouisliderModule } from 'ng2-nouislider';
import { FileUploadModule } from 'ng2-file-upload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { MatchHeightModule } from "../shared/directives/match-height.directive";

import { ButtonsComponent } from "./bootstrap/buttons/buttons.component";
import { ListsComponent } from "./bootstrap/lists/lists.component";
import { AlertsComponent } from "./bootstrap/alerts/alerts.component";
import { SweetAlertsComponent } from "./extra/sweet-alerts/sweet-alerts.component";
import { ToastrComponent } from "./extra/toastr/toastr.component";
import { NouiSliderComponent } from "./extra/nouislider/nouislider.component";
import { BadgesComponent } from "./bootstrap/badges/badges.component";
import { DropdownsComponent } from "./bootstrap/dropdowns/dropdowns.component";
import { MediaObjectsComponent } from "./bootstrap/media-objects/media-objects.component";
import { PaginationComponent } from "./bootstrap/pagination/pagination.component";
import { ProgressBarsComponent } from "./bootstrap/progress/progress.component";
import { ModalsComponent, NgbdModalContent } from "./bootstrap/modals/modals.component";
import { CollapseComponent } from "./bootstrap/collapse/collapse.component";
import { AccordionComponent } from './bootstrap/accordion/accordion.component';
import { CarouselComponent } from './bootstrap/carousel/carousel.component';
import { PopoverComponent } from './bootstrap/popover/popover.component';
import { RatingComponent } from './bootstrap/rating/rating.component';
import { NavsComponent } from './bootstrap/navs/navs.component';
import { TooltipComponent } from './bootstrap/tooltip/tooltip.component';
import { TypeaheadComponent } from './bootstrap/typeahead/typeahead.component';
import { NgButtonsComponent } from './bootstrap/ng-buttons/ng-buttons.component';
import { UploadComponent } from './extra/upload/upload.component';
import { DragDropComponent } from './extra/drag-drop/drag-drop.component';
import { TourComponent } from './extra/tour/tour.component';
import { CropperComponent } from './extra/cropper/cropper.component';
import { AvatarComponent } from './extra/avatar/avatar.component';
import { SwiperComponent } from './extra/swiper/swiper.component';

@NgModule({
    imports: [
        CommonModule,
        UIComponentsRoutingModule,
        NouisliderModule,
        FileUploadModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        DragulaModule.forRoot(),
        MatchHeightModule,
        ImageCropperModule,
        HttpClientModule,
        SwiperModule
    ],
    declarations: [
        ButtonsComponent,
        ListsComponent,
        AlertsComponent,
        SweetAlertsComponent,
        ToastrComponent,
        NouiSliderComponent,
        BadgesComponent,
        DropdownsComponent,
        MediaObjectsComponent,
        PaginationComponent,
        ProgressBarsComponent,
        ModalsComponent,
        CollapseComponent,
        AccordionComponent,
        CarouselComponent,
        PopoverComponent,
        RatingComponent,
        NavsComponent,
        TooltipComponent,
        TypeaheadComponent,
        NgbdModalContent,
        NgButtonsComponent,
        UploadComponent,
        DragDropComponent,
        TourComponent,
        CropperComponent,
        AvatarComponent,
        SwiperComponent
    ]
})
export class UIComponentsModule { }
