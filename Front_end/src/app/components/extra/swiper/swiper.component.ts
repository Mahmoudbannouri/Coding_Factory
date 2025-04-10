import { Component, OnInit, ViewChild } from '@angular/core';
import { SwiperDirective, SwiperConfigInterface} from 'ngx-swiper-wrapper';


@Component({
  selector: 'app-swiper',
  templateUrl: './swiper.component.html',
  styleUrls: ['./swiper.component.scss']
})
export class SwiperComponent implements OnInit {


  @ViewChild(SwiperDirective, { static: false }) directiveRef?: SwiperDirective;

  // default
  public swiperDefaultConfig: SwiperConfigInterface = {};

  // navigation
  public swiperNavigationConfig: SwiperConfigInterface = {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  // pagination
  public swiperPaginationConfig: SwiperConfigInterface = {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  // progress
  public swiperProgressConfig: SwiperConfigInterface = {
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  // multiple
  public swiperMultipleConfig: SwiperConfigInterface = {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  // multi row
  public swiperMultiRowConfig: SwiperConfigInterface = {
    slidesPerView: 3,
    slidesPerColumn: 2,
    spaceBetween: 30,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
  };

  // centered slides option-1
  public swiperCenterOpt1Config: SwiperConfigInterface = {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 30,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    slideToClickedSlide: true
  };

  // centered slides option-2
  public swiperCenterOpt2Config: SwiperConfigInterface = {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 30,
  };

  // fade effect
  public swiperFadeEffectConfig: SwiperConfigInterface = {
    spaceBetween: 30,
    effect: 'fade',
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  // cube effect
  public swiperCubeEffectConfig: SwiperConfigInterface = {
    effect: 'cube',
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
    pagination: {
      el: '.swiper-pagination',
    },
  };

  // coverflow effect
  public swiperCoverflowEffectConfig: SwiperConfigInterface = {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    coverflowEffect: {
      rotate: 50,
      stretch: 0,
      depth: 100,
      modifier: 1,
      slideShadows: true,
    },
    pagination: {
      el: '.swiper-pagination',
    },
  };

  // autoplay
  public swiperAutoplayConfig: SwiperConfigInterface = {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  // parallax
  public swiperParallaxConfig: SwiperConfigInterface = {
    speed: 600,
    parallax: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  // lazy loading
  public swiperLazyLoadingConfig: SwiperConfigInterface = {
    // Enable lazy loading
    lazy: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  // Responsive Breakpoints
  public swiperResponsiveBreakpointsConfig: SwiperConfigInterface = {
    slidesPerView: 5,
    spaceBetween: 50,
    // init: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      1024: {
        slidesPerView: 4,
        spaceBetween: 40,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      320: {
        slidesPerView: 1,
        spaceBetween: 10,
      }
    }
  };




  constructor() { }

  ngOnInit(): void {
  }

}
