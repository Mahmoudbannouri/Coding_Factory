import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseService } from '../services/course.service';
import { CourseResourceService } from '../services/course-resource.service';
import { Course } from '../models/courses';
import { User } from '../models/User';
import { CategoryEnum } from '../models/CategoryEnum';
import Swal from 'sweetalert2';
import { CourseResource } from '../models/CourseResource';
import { Page } from '../models/page';
import { StorageService } from 'app/shared/auth/storage.service';
import { ReviewService } from 'app/services/review';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  categoryEnum = CategoryEnum;
  categoryColors: { [key: string]: string } = {};
  page: Page<Course> = {
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 6,
    number: 0,
    numberOfElements: 0
  };
  selectedCourse: Course | null = null;
  trainers: User[] = [];
  enrolledStudents: User[] = []; // or any[] if you have a specific interface for enrolled students
  showModal = false;
  showAddResourceModal = false;
  showResourcesModal = false;
  showEditModal = false;
  showEnrollModal = false;
  showStudentsModal = false;
  showReviewModal = false;
  searchQuery = '';
  selectedCategory = '';
  showAIImprovementsModal = false;
  loading = false;
  public isTrainerLoggedIn = false;
  public isStudentLoggedIn = false;
  public StorageService = StorageService; // Make the service available in template

  constructor(
    private courseService: CourseService, 
    private courseResourceService: CourseResourceService, 
    private cdr: ChangeDetectorRef,
    private storageService: StorageService,
    private reviewService: ReviewService
  ) {}

  ngOnInit(): void {
    if (!this.storageService.isLoggedIn()) {
      return;
    }
  
    // First set the roles
    this.updateRoleFlags();
    
    console.log('Raw user data:', this.storageService.getUser());
    console.log('Processed role:', StorageService.getUserRole());
    console.log('Is trainer:', this.isTrainerLoggedIn); // Use the property
    console.log(`User is ${this.isTrainerLoggedIn ? 'Trainer' : this.isStudentLoggedIn ? 'Student' : 'Guest'}`);
    
    this.assignRandomColorsToCategories();
    this.loadInitialCourses();
  }
  

  private updateRoleFlags(): void {
    const role = StorageService.getUserRole()?.replace(/[\[\]]/g, '');
    this.isTrainerLoggedIn = role === 'TRAINER';
    this.isStudentLoggedIn = role === 'STUDENT';
    this.cdr.detectChanges(); // Add this to ensure UI updates
  }
  getCategoryValues(): string[] {
    return Object.keys(CategoryEnum).filter(key => isNaN(Number(key)));
  }
  getCategoryDisplayName(category: string): string {
    if (!category) return '';
    return category.toLowerCase().split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  // Fix the ngAfterViewInit debug code
ngAfterViewInit() {
  setTimeout(() => {
    const btn = document.querySelector('.floating-add-button') as HTMLElement;
    console.log('Button element:', btn);
    if (btn) {
      console.log('Computed styles:', window.getComputedStyle(btn));
      console.log('Parent visible:', (btn as any).offsetParent !== null);
    }
  }, 1000);
}


  
  
loadInitialCourses(): void {
  this.loading = true;
  this.cdr.detectChanges();
  
  const subscription = (this.isTrainerLoggedIn || this.isStudentLoggedIn)
    ? this.courseService.searchMyCourses(
        this.searchQuery,
        this.selectedCategory,
        this.page.number,  // Use current page number
        this.page.size     // Use current page size
      ).subscribe(
        (page: Page<Course>) => {
          this.handleCoursesResponse(page);
        },
        (err: any) => {
          this.handleCoursesError(err);
        }
      )
    : this.courseService.getAllCoursesWithPagination(
        this.searchQuery, 
        this.selectedCategory,
        this.page.number,  // Use current page number
        this.page.size     // Use current page size
      ).subscribe(
        (page: Page<Course>) => {
          this.handleCoursesResponse(page);
        },
        (err: any) => {
          this.handleCoursesError(err);
        }
      );
}

private handleCoursesResponse(courses: Course[] | Page<Course>): void {
  const courseList = Array.isArray(courses) ? courses : courses.content;
  const studentId = StorageService.getUserId();
  
  if (this.isStudentLoggedIn && studentId) {
    courseList.forEach(course => {
      this.reviewService.hasStudentReviewed(studentId, course.id)
        .subscribe(hasReviewed => {
          course.hasReviewed = hasReviewed;
          this.cdr.detectChanges();
        });
    });
  }

  this.page = {
    content: courseList,
    totalElements: Array.isArray(courses) ? courses.length : courses.totalElements,
    totalPages: Array.isArray(courses) ? Math.ceil(courses.length / this.page.size) : courses.totalPages,
    size: this.page.size,
    number: Array.isArray(courses) ? 0 : courses.number,
    numberOfElements: Array.isArray(courses) ? courses.length : courses.numberOfElements
  };
  this.loading = false;
  this.cdr.detectChanges();
}

private handleCoursesError(err: any): void {
  console.error('Error loading courses:', err);
  this.loading = false;
  this.cdr.detectChanges();
  Swal.fire('Error', 'Failed to load courses', 'error');
}

searchCourses(): void {
  this.loading = true;
  
  const observable = (this.isTrainerLoggedIn || this.isStudentLoggedIn)
    ? this.courseService.searchMyCourses(
        this.searchQuery,
        this.selectedCategory,
        this.page.number,
        this.page.size
      )
    : this.courseService.getAllCoursesWithPagination(
        this.searchQuery,
        this.selectedCategory,
        this.page.number,
        this.page.size
      );

  observable.subscribe({
    next: (page) => {
      this.page = {
        ...page,
        content: page.content.map(course => ({
          ...course,
          image: this.getFile(course.image)
        }))
      };
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (error) => {
      console.error('Error searching courses:', error);
      this.loading = false;
      Swal.fire('Error', 'Failed to load courses', 'error');
      this.cdr.detectChanges();
    }
  });
}

  enrollInCourse(course: Course): void {
    this.courseService.enrollCurrentUser(course.id).subscribe({
      next: () => {
        Swal.fire('Success', 'Enrolled successfully!', 'success');
        this.searchCourses(); // Refresh the list
      },
      error: (err) => {
        Swal.fire('Error', err.error.message || 'Enrollment failed', 'error');
      }
    });
  }
  private loadTrainerCourses(): void {
    this.loading = true;
    this.courseService.getMyCourses().subscribe({
      next: (courses) => {
        this.page = {
          ...this.page,
          content: courses.map(course => ({
            ...course,
            image: this.getFile(course.image)
          }))
        };
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error('Error loading trainer courses:', err);
        Swal.fire('Error', 'Failed to load your courses', 'error');
      }
    });
  }
  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  assignRandomColorsToCategories(): void {
    Object.keys(this.categoryEnum).forEach(category => {
      this.categoryColors[category] = this.generateRandomColor();
    });
  }

  onSearchChange(): void {
    this.page.number = 0;
    this.searchCourses();
  }

  getFile(fileName: string): string {
    if (fileName.startsWith('https://')) {
      return fileName;
    }
    return `https://wbptqnvcpiorvwjotqwx.supabase.co/storage/v1/object/public/course-images/${fileName}`;
  }

  nextPage(): void {
    if (this.page.number < this.page.totalPages - 1) {
      this.page.number++;
      this.searchCourses();
    }
  }

  prevPage(): void {
    if (this.page.number > 0) {
      this.page.number--;
      this.searchCourses();
    }
  }

  openAddResourceModal(course: Course): void {
    this.selectedCourse = course;
    this.showAddResourceModal = true;
    this.showResourcesModal = false;
    this.cdr.detectChanges();
  }

  openAddCourseModal(): void {
    console.log('Current user role:', StorageService.getUserRole());
    this.showModal = true;
    this.cdr.detectChanges();
  }

  onCourseAdded(course: Course): void {
    if (this.isTrainerLoggedIn) {
      // For trainers, reload their specific courses
      this.loadTrainerCourses();
    } else {
      // For others, refresh the general search
      this.searchCourses();
    }
    this.page.content = [course, ...this.page.content];
    this.page.totalElements++;
    this.cdr.detectChanges();
  }
  

  openReviewModal(course: Course): void {
    this.selectedCourse = course;
    this.showReviewModal = true;
    this.cdr.detectChanges();
  }

  onReviewAdded(): void {
    this.searchCourses();
    this.cdr.detectChanges();
  }

  onResourceAdded(resource: CourseResource): void {
    if (this.selectedCourse && this.selectedCourse.resources) {
      this.selectedCourse.resources.push(resource);
      this.cdr.detectChanges();
    }
  }
  downloadPdf(courseId: number): void {
    this.courseService.downloadCoursePdf(courseId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `course_${courseId}_summary.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        Swal.fire('Success', 'PDF downloaded successfully!', 'success');
      },
      error: (error) => {
        console.error('Error downloading PDF:', error);
        Swal.fire('Error', 'Failed to download PDF', 'error');
      }
    });
  }
  
  
  downloadResourcesZip(courseId: number): void {
    Swal.fire({
      title: 'Preparing Download',
      text: 'Please wait while we prepare your resources...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  
    this.courseService.downloadCourseResourcesZip(courseId).subscribe({
      next: (blob) => {
        Swal.close();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `course_${courseId}_resources.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        Swal.fire('Error', 'Failed to download resources', 'error');
        console.error('Error downloading ZIP:', error);
      }
    });
  }
  
  openAIImprovementsModal(course: Course): void {
    console.log('Opening AI Improvements Modal for Course ID:', course.id);
    this.selectedCourse = course;
    this.showAIImprovementsModal = true;
    this.cdr.detectChanges();
  }

  getFilledStars(rate: number): number[] {
    const filledStars = Math.floor(rate);
    return Array(filledStars).fill(0);
  }

  hasPartialStar(rate: number): boolean {
    return rate % 1 !== 0;
  }

  getEmptyStars(rate: number): number[] {
    const totalStars = 5;
    const filledStars = Math.floor(rate);
    const hasPartial = this.hasPartialStar(rate);
    const emptyStars = totalStars - filledStars - (hasPartial ? 1 : 0);
    return Array(emptyStars).fill(0);
  }

  openResourcesModal(course: Course): void {
    this.selectedCourse = course;
    this.showResourcesModal = true;
    this.showAddResourceModal = false;
    this.courseResourceService.getResourcesForCourse(course.id).subscribe(
      (resources) => {
        this.selectedCourse!.resources = resources;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching resources:', error);
      }
    );
  }

  deleteCourse(courseId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to recover this course!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCourse(courseId).subscribe({
          next: () => {
            // Remove the deleted course from the local array
            this.page.content = this.page.content.filter(course => course.id !== courseId);
            // Update the total elements count
            this.page.totalElements--;
            
            Swal.fire('Deleted!', 'The course has been deleted.', 'success');
            this.cdr.detectChanges(); // Trigger change detection
          },
          error: (error) => {
            console.error('Error deleting course:', error);
            Swal.fire('Error!', 'Error deleting course.', 'error');
          }
        });
      }
    });
  }

  closeAllModals(): void {
    this.showModal = false;
    this.showAddResourceModal = false;
    this.showResourcesModal = false;
    this.showEditModal = false;
    this.showEnrollModal = false;
    this.showStudentsModal = false;
    this.cdr.detectChanges();
  }

  openEditModal(course: Course): void {
    this.selectedCourse = course;
    this.showEditModal = true;
    this.cdr.detectChanges();
  }

  onCourseUpdated(updatedCourse: Course): void {
    const index = this.page.content.findIndex(c => c.id === updatedCourse.id);
    if (index !== -1) {
      this.page.content[index] = updatedCourse;
      this.cdr.detectChanges();
    }
    this.searchCourses();
    this.cdr.detectChanges();
  }

  openEnrollModal(course: Course): void {
    this.selectedCourse = course;
    this.showEnrollModal = true;
    this.cdr.detectChanges();
  }

  onStudentsEnrolled(): void {
    if (this.selectedCourse) {
      this.courseService.getEnrolledStudentsWithDetails(this.selectedCourse.id)
        .subscribe(students => {
          this.enrolledStudents = students;
          this.showStudentsModal = true; // Show students modal after enrollment
        });
    }
  }

  openStudentsModal(course: Course): void {
    this.selectedCourse = course;
    this.loading = true;
    
    this.courseService.getEnrolledStudentsWithDetails(course.id).subscribe({
      next: (students) => {
        this.enrolledStudents = students; // This should now be an array of student objects
        this.showStudentsModal = true;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching enrolled students:', error);
        this.loading = false;
        Swal.fire('Error', 'Failed to load enrolled students', 'error');
      }
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.page.number = 0;
    this.searchCourses();
  }
}