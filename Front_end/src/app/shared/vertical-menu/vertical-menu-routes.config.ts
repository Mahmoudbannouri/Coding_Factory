import { RouteInfo } from './vertical-menu.metadata';

import { StorageService } from 'app/shared/auth/storage.service';

// Function to get the user's role
function getUserRole(): string {
  const user = StorageService.getUser();
  if (!user || !user.roles) return '';

  // Handle both string and array roles
  if (Array.isArray(user.roles)) {
    return user.roles[0]; // Return first role
  }
  return user.roles;
}



// Function to check if the user is an admin
function isAdmin(): boolean {
  const role = getUserRole();
  return role === 'ADMIN' || role === '[ADMIN]';
}

// Function to check if the user is a partner
function isPartner(): boolean {
  const role = getUserRole();
  return role === 'PARTNER' || role === '[PARTNER]';
}


//Sidebar menu Routes and data
export const ROUTES: RouteInfo[] = [

  {
    path: '', title: 'Home', icon: 'ft-home', class: 'has-sub', badge: '2', badgeClass: 'badge badge-pill badge-danger float-right mr-1 mt-1', isExternalLink: false, submenu: [
      { path: '/dashboard/dashboard1', title: 'Dashboard', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/dashboard/dashboard2', title: 'Users', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
  { path: '/courses', title: 'Courses', icon: 'ft-book', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

  { path: '/events', title: 'Events', icon: 'ft-calendar', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

  ...(isAdmin() || isPartner() ? [{
    path: '/proposal',
    title: 'Proposals',
    icon: 'ft-file-text',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    submenu: []
  }] : []),
  ...(isAdmin() || isPartner() ? [{
    path: '/partnerships',
    title: 'Partnerships',
    icon: 'ft-layout',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    submenu: []
  }] : []),
  ...(isAdmin() ? [{
    path: '/entreprise',
    title: 'Entreprises',
    icon: 'ft-briefcase',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    submenu: []
  }] : []),
  ...(isAdmin() ? [{
    path: '/scraping',
    title: 'Scraping',
    icon: 'ft-search',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    submenu: []
  }] : []),
  ...(isAdmin() ? [{
    path: '/potentialpartners',
    title: 'Potential',
    icon: 'ft-user-plus',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    submenu: []
  }] : []),
  ...(isAdmin() ? [{
    path: '/chat',
    title: 'PartnerGenie',
    icon: 'fas fa-robot',
    class: '',
    badge: '',
    badgeClass: '',
    isExternalLink: false,
    submenu: []
  }] : []),

  {
    path: '', title: 'Charts', icon: 'ft-bar-chart-2', class: 'has-sub', badge: '2', badgeClass: 'badge badge-pill badge-success float-right mr-1 mt-1', isExternalLink: false,
    submenu: [
      { path: '/charts/chartjs', title: 'ChartJs', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/charts/chartist', title: 'Chartist', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/charts/apex', title: 'Apex', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
      { path: '/charts/ngx', title: 'NGX', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
  {
    path: '', title: 'Pages', icon: 'ft-copy', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
    submenu: [
      {
        path: '', title: 'Authentication', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
        submenu: [
          { path: '/pages/forgotpassword', title: 'Forgot Password', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
          { path: '/pages/login', title: 'Login', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
          { path: '/pages/register', title: 'Register', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
          { path: '/pages/lockscreen', title: 'Lock Screen', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
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
       {
        path: '', title: 'Pfe', icon: 'ft-arrow-right submenu-icon', class: 'has-sub', badge: '', badgeClass: '', isExternalLink: false,
        submenu: [
          { path: '/pages/pfe-list', title: 'List', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
          { path: '/pages/pfe-view', title: 'View', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
          { path: '/pages/pfe-edit', title: 'Edit', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] }
        ]
      },
             

      { path: '/pages/kb', title: 'ChatPFE', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
    ]
  },
  
          { path: '/components/upload', title: 'Upload', icon: 'ft-arrow-right submenu-icon', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },
        
      
    
  
  
  { path: 'https://pixinvent.com/apex-angular-4-bootstrap-admin-template/documentation', title: 'Documentation', icon: 'ft-book', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },
  { path: 'https://pixinvent.ticksy.com/', title: 'Support', icon: 'ft-life-buoy', class: '', badge: '', badgeClass: '', isExternalLink: true, submenu: [] },


  { path: '/calendar', title: 'Calendar', icon: 'ft-calendar', class: '', badge: '', badgeClass: '', isExternalLink: false, submenu: [] },

  { 
    path: '/modules/exman-quiz', 
    title: 'Exman Quiz', 
    icon: 'ft-edit', 
    class: '', 
    badge: '', 
    badgeClass: '', 
    isExternalLink: false,
    submenu: [] 
  },
    { 
    path: '/modules/exams', 
    title: 'Exman ', 
    icon: 'ft-edit', 
    class: '', 
    badge: '', 
    badgeClass: '', 
    isExternalLink: false,
    submenu: [] 
  },
];


   


 

 


