import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
import { ModalsComponent } from "./bootstrap/modals/modals.component";
import { CollapseComponent } from "./bootstrap/collapse/collapse.component";
import { AccordionComponent } from './bootstrap/accordion/accordion.component';
import { CarouselComponent } from './bootstrap/carousel/carousel.component';
import { PopoverComponent } from './bootstrap/popover/popover.component';
import { RatingComponent } from './bootstrap/rating/rating.component';
import { NavsComponent } from './bootstrap/navs/navs.component';
import { TooltipComponent } from './bootstrap/tooltip/tooltip.component';
import { TypeaheadComponent } from './bootstrap/typeahead/typeahead.component';
import { NgButtonsComponent } from "./bootstrap/ng-buttons/ng-buttons.component";
import { UploadComponent } from './extra/upload/upload.component';
import { DragDropComponent } from './extra/drag-drop/drag-drop.component';
import { TourComponent } from './extra/tour/tour.component';
import { CropperComponent } from './extra/cropper/cropper.component';
import { AvatarComponent } from './extra/avatar/avatar.component';
import { SwiperComponent } from './extra/swiper/swiper.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'buttons',
        component: ButtonsComponent,
        data: {
          title: 'Buttons'
        }
      },

      {
        path: 'lists',
        component: ListsComponent,
        data: {
          title: 'Lists'
        }
      },
      {
        path: 'alerts',
        component: AlertsComponent,
        data: {
          title: 'Alerts'
        }
      },
      {
        path: 'sweetalerts',
        component: SweetAlertsComponent,
        data: {
          title: 'Sweet Alerts'
        }
      },
      {
        path: 'toastr',
        component: ToastrComponent,
        data: {
          title: 'Toastr'
        }
      },
      {
        path: 'nouislider',
        component: NouiSliderComponent,
        data: {
          title: 'NoUI Slider'
        }
      },

      {
        path: 'upload',
        component: UploadComponent,
        data: {
          title: 'Upload'
        }
      },
      {
        path: 'dragndrop',
        component: DragDropComponent,
        data: {
          title: 'Drag and Drop'
        }
      },
      {
        path: 'tour',
        component: TourComponent,
        data: {
          title: 'Tour'
        }
      },
      {
        path: 'cropper',
        component: CropperComponent,
        data: {
          title: 'Cropper'
        }
      },
      {
        path: 'badges',
        component: BadgesComponent,
        data: {
          title: 'Badges'
        }
      },
      {
        path: 'dropdowns',
        component: DropdownsComponent,
        data: {
          title: 'Dropdowns'
        }
      },
      {
        path: 'media',
        component: MediaObjectsComponent,
        data: {
          title: 'Media Objects'
        }
      },
      {
        path: 'pagination',
        component: PaginationComponent,
        data: {
          title: 'Pagination'
        }
      },
      {
        path: 'progress',
        component: ProgressBarsComponent,
        data: {
          title: 'Progress Bars'
        }
      },
      {
        path: 'models',
        component: ModalsComponent,
        data: {
          title: 'Models'
        }
      },
      {
        path: 'collapse',
        component: CollapseComponent,
        data: {
          title: 'Collapse'
        }
      },
      {
        path: 'accordion',
        component: AccordionComponent,
        data: {
          title: 'Accordion'
        }
      },
      {
        path: 'carousel',
        component: CarouselComponent,
        data: {
          title: 'Carousel'
        }
      },
      {
        path: 'popover',
        component: PopoverComponent,
        data: {
          title: 'Popovers'
        }
      },
      {
        path: 'rating',
        component: RatingComponent,
        data: {
          title: 'Rating'
        }
      },
      {
        path: 'navs',
        component: NavsComponent,
        data: {
          title: 'Navs'
        }
      },
      {
        path: 'tooltip',
        component: TooltipComponent,
        data: {
          title: 'Tooltips'
        }
      },
      {
        path: 'typeahead',
        component: TypeaheadComponent,
        data: {
          title: 'Typeahead'
        }
      },
      {
        path: 'ng-buttons',
        component: NgButtonsComponent,
        data: {
          title: 'Ngb-Bootstrap'
        }
      },
      {
        path: 'avatar',
        component: AvatarComponent,
        data: {
          title: 'Avatar'
        }
      },
      {
        path: 'swiper',
        component: SwiperComponent,
        data: {
          title: 'Swiper'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UIComponentsRoutingModule { }
