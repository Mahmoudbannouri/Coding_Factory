import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseService } from '../services/course.service';
import { CourseResourceService } from '../services/course-resource.service';
import { Course } from '../models/courses';
import { User } from '../models/User';
import { CategoryEnum } from '../models/CategoryEnum';
import Swal from 'sweetalert2';
import { CourseResource } from '../models/CourseResource';
import { Page } from '../models/page';

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
  showModal = false;
  showAddResourceModal = false;
  showResourcesModal = false;
  showEditModal = false;
  showEnrollModal = false;
  showStudentsModal = false;
  showReviewModal = false;
  searchQuery = '';
  selectedCategory = '';
  enrolledStudents: User[] = [];
  showAIImprovementsModal = false;
  loading = false;

  constructor(
    private courseService: CourseService, 
    private courseResourceService: CourseResourceService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.searchCourses();
    this.assignRandomColorsToCategories();
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

  searchCourses(): void {
    this.loading = true;
    this.courseService.searchCourses(
      this.searchQuery,
      this.selectedCategory as CategoryEnum,
      this.page.number,
      this.page.size
    ).subscribe(
      (page) => {
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
      (error) => {
        console.error('Error searching courses:', error);
        this.loading = false;
      }
    );
  }

  onSearchChange(): void {
    this.page.number = 0; // Reset to first page when search/filter changes
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
    this.showModal = true;
    this.cdr.detectChanges();
  }

  onCourseAdded(course: Course): void {
    this.searchCourses(); // Refresh the list
    this.cdr.detectChanges();
  }

  openReviewModal(course: Course): void {
    this.selectedCourse = course;
    this.showReviewModal = true;
    this.cdr.detectChanges();
  }

  onReviewAdded(): void {
    this.searchCourses(); // Refresh the course list to show updated ratings
    this.cdr.detectChanges();
  }

  onResourceAdded(resource: CourseResource): void {
    if (this.selectedCourse && this.selectedCourse.resources) {
      this.selectedCourse.resources.push(resource);
      this.cdr.detectChanges();
    }
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
        this.courseService.deleteCourse(courseId).subscribe(() => {
          this.searchCourses();
          Swal.fire('Deleted!', 'The course has been deleted.', 'success');
        }, (error) => {
          console.error('Error deleting course:', error);
          Swal.fire('Error!', 'Error deleting course.', 'error');
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
    this.searchCourses(); // Refresh the list
    this.cdr.detectChanges();
  }

  openEnrollModal(course: Course): void {
    this.selectedCourse = course;
    this.showEnrollModal = true;
    this.cdr.detectChanges();
  }

  onStudentsEnrolled(): void {
    this.searchCourses(); // Refresh the list
    this.cdr.detectChanges();
  }

  openStudentsModal(course: Course): void {
    this.selectedCourse = course;
    this.courseService.getEnrolledStudents(course.id).subscribe(
      (students) => {
        this.enrolledStudents = students;
        this.showStudentsModal = true;
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching enrolled students:', error);
      }
    );
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.page.number = 0;
    this.searchCourses();
  }
}