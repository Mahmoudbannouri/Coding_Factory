import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { FaqService } from './faq.service';
import { FAQ, FAQMain } from './faq.model';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
  providers: [FaqService]
})
export class FaqComponent {

  faqMain: FAQMain;
  swiperIndex = 2;

  @ViewChild(SwiperDirective, { static: false }) directiveRef?: SwiperDirective;

  public swiperCenterOpt1Config: SwiperConfigInterface = {
    slidesPerView: 'auto',
    centeredSlides: true,
    initialSlide: 2,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slideToClickedSlide: true
  };

  constructor(private faqService: FaqService) {
      this.filter();
  }

  onIndexChange(index: number): void {
    this.swiperIndex = index;
    this.filter();
  }

  filter() {
    this.faqMain = this.faqService.faqmain.find((faqmain: FAQMain) => faqmain.typeId === this.swiperIndex);

  }

}
