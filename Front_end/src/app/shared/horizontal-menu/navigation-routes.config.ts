import { RouteInfo } from '../vertical-menu/vertical-menu.metadata';

export const HROUTES: RouteInfo[] = [

  {
    path: '', title: 'Dashboard', icon: 'ft-home', class: 'dropdown nav-item has-sub', isExternalLink: false,
    submenu: [
      { path: '/dashboard/dashboard1', title: 'Dashboard 1', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/dashboard/dashboard2', title: 'Dashboard 2', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] }
    ]
  },
  {
    path: '', title: 'Apps', icon: 'ft-box', class: 'dropdown nav-item has-sub', isExternalLink: false,
    submenu: [
      { path: '/inbox', title: 'Email', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/chat', title: 'Chat', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/chat-ngrx', title: 'Chat NgRx', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/taskboard', title: 'Task Board', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/taskboard-ngrx', title: 'Task Board NgRx', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/calendar', title: 'Calendar', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] }
    ]
  },
  {
    path: '', title: 'UI Kit', icon: 'ft-aperture', class: 'dropdown nav-item has-sub', isExternalLink: false,
    submenu: [
      { path: '/uikit/grids', title: 'Grid', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/uikit/typography', title: 'Typography', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/uikit/syntaxhighlighter', title: 'Syntax Highlighter', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/uikit/helperclasses', title: 'Helper Classes', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/uikit/textutilities', title: 'Text Utilities', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/uikit/colorpalettes', title: 'Color Palette', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      {
        path: '', title: 'Icons', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', isExternalLink: false,
        submenu: [
          { path: '/uikit/feather', title: 'Feather Icon', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/uikit/font-awesome', title: 'Font Awesome Icon', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/uikit/simple-line', title: 'Simple Line Icon', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] }
        ]
      },
    ]
  },
  {
    path: '', title: 'Components', icon: 'ft-briefcase', class: 'dropdown nav-item has-sub', isExternalLink: false,
    submenu: [
      {
        path: '', title: 'Cards', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', isExternalLink: false,
        submenu: [
          { path: '/cards/basic', title: 'Basic Cards', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/cards/advanced', title: 'Advanced Cards', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] }
        ]
      },
      {
        path: '', title: 'Bootstrap', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', isExternalLink: false,
        submenu: [
          { path: '/components/buttons', title: 'Buttons', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/ng-buttons', title: 'NG Buttons', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/alerts', title: 'Alerts', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/badges', title: 'Badges', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/dropdowns', title: 'Dropdowns', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/media', title: 'Media Objects', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/pagination', title: 'Pagination', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/progress', title: 'Progress Bars', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/models', title: 'Modals', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/collapse', title: 'Collapse', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/lists', title: 'List', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/accordion', title: 'Accordion', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/carousel', title: 'Carousel', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/popover', title: 'Popover', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/rating', title: 'Rating', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/navs', title: 'Navs', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/tooltip', title: 'Tooltip', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/typeahead', title: 'Typeahead', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] }
        ]
      },
      {
        path: '', title: 'Extra', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', isExternalLink: false,
        submenu: [
          { path: '/components/sweetalerts', title: 'Sweet Alert', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/toastr', title: 'Toastr', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/nouislider', title: 'NoUI Slider', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/upload', title: 'Upload', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/dragndrop', title: 'Drag and Drop', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/tour', title: 'Tour', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/cropper', title: 'Image Cropper', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/avatar', title: 'Avatar', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/components/swiper', title: 'Swiper', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] }
        ]
      }
    ]
  },
  {
    path: '', title: 'Forms', icon: 'ft-edit', class: 'dropdown nav-item has-sub', isExternalLink: false,
    submenu: [
      {
        path: '', title: 'Elements', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', isExternalLink: false,
        submenu: [
          { path: '/forms/inputs', title: 'Inputs', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/input-groups', title: 'Input Groups', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/radio', title: 'Radio', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/checkbox', title: 'Checkbox', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/switch', title: 'Switch', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/select', title: 'Select', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/editor', title: 'Editor', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/tags', title: 'Input Tags', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/datepicker', title: 'Datepicker', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/forms/timepicker', title: 'Timepicker', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
        ]
      },
      { path: '/forms/layout', title: 'Layouts', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/forms/validation', title: 'Validation', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/forms/archwizard', title: 'Wizard', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
    ]
  },
  {
    path: '', title: 'Tables', icon: 'ft-grid', class: 'dropdown nav-item has-sub', isExternalLink: false,
    submenu: [
      {
        path: '', title: 'Bootstrap Tables', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', isExternalLink: false,
        submenu: [
          { path: '/tables/basic', title: 'Basic', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/tables/extended', title: 'Extended', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/tables/angular', title: 'Angular', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] }
        ]
      },
      {
        path: '/datatables', title: 'DataTables', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: []
      }
    ]
  },
  {
    path: '', title: 'Charts & Maps', icon: 'ft-bar-chart-2', class: 'dropdown nav-item has-sub', isExternalLink: false,
    submenu: [
      {
        path: '', title: 'Charts', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', isExternalLink: false,
        submenu: [
          { path: '/charts/chartjs', title: 'ChartJs', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/charts/chartist', title: 'Chartist', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/charts/apex', title: 'Apex', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/charts/ngx', title: 'NGX', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
        ]
      },
      {
        path: '', title: 'Maps', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', isExternalLink: false,
        submenu: [
          { path: '/maps/google', title: 'Google Map', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/maps/fullscreen', title: 'Full Screen Map', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] }
        ]
      }
    ]
  },
  {
    path: '', title: 'Pages', icon: 'ft-file-text', class: 'dropdown nav-item has-sub', isExternalLink: false,
    submenu: [
      {
        path: '', title: 'Authentication', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', isExternalLink: false,
        submenu: [
          { path: '/pages/forgotpassword', title: 'Forgot Password', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/pages/login', title: 'Login', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/pages/register', title: 'Register', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/pages/lockscreen', title: 'Lock Screen', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] }
        ]
      },
      { path: '/pages/horizontaltimeline', title: 'Horizontal Timeline', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      {
        path: '', title: 'Vertical Timeline', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', isExternalLink: false,
        submenu: [
          { path: '/pages/timeline-vertical-center', title: 'Center', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/pages/timeline-vertical-left', title: 'Left', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
          { path: '/pages/timeline-vertical-right', title: 'Right', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] }
        ]
      },
      {
        path: '', title: 'Users', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
        submenu: [
          { path: '/pages/users-list', title: 'List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
          { path: '/pages/users-view', title: 'View', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
          { path: '/pages/users-edit', title: 'Edit', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
        ]
      },
      { path: '/pages/account-settings', title: 'Account Settings', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/pages/profile', title: 'User Profile', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/pages/invoice', title: 'Invoice', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/pages/error', title: 'Error', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/pages/comingsoon', title: 'Coming Soon', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/pages/maintenance', title: 'Maintenance', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/pages/gallery', title: 'Gallery', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/pages/search', title: 'Search', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/pages/faq', title: 'FAQ', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] },
      { path: '/pages/kb', title: 'Knowledge Base', icon: 'ft-arrow-right submenu-icon', class: 'dropdown-item', isExternalLink: false, submenu: [] }
    ]
  }
];
