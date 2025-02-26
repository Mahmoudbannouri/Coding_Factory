import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CourseService } from '../services/course.service';
import { CourseResourceService } from '../services/course-resource.service';
import { Course } from '../models/courses';
import { User } from '../models/User';
import { CategoryEnum } from '../models/CategoryEnum';
import Swal from 'sweetalert2';
import { CourseResource } from 'app/models/CourseResource';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit {
  categoryEnum = CategoryEnum;
  categoryColors: { [key: string]: string } = {};
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  selectedCourse: Course | null = null;
  trainers: User[] = [];
  showModal = false;
  showAddResourceModal = false;
  showResourcesModal = false;
  showEditModal = false;
  showEnrollModal = false;
  showStudentsModal = false;
  searchQuery = '';
  selectedCategory = '';
  currentPage = 1;
  itemsPerPage = 6;
  enrolledStudents: User[] = [];

  constructor(private courseService: CourseService, private courseResourceService: CourseResourceService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.getAllCourses();
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

  getAllCourses(): void {
    this.courseService.getAllCourses().subscribe(
      (data) => {
        this.courses = data.map(course => ({
          ...course,
          image: this.getFile(course.image)
        }));
        this.filterCourses();
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Erreur lors de la récupération des cours:', error);
      }
    );
  }

  getFile(fileName: string): string {
    if (fileName.startsWith('https://')) {
      return fileName;
    }
    return `https://wbptqnvcpiorvwjotqwx.supabase.co/storage/v1/object/public/course-images/${fileName}`;
  }

  filterCourses(): void {
    this.filteredCourses = this.courses.filter(course =>
      (this.searchQuery === '' || course.title.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (this.selectedCategory === '' || course.categoryCourse.toLowerCase() === this.selectedCategory.toLowerCase())
    );
    this.currentPage = 1;
    this.cdr.detectChanges();
  }

  getPaginatedCourses(): Course[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredCourses.slice(startIndex, startIndex + this.itemsPerPage);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredCourses.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
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
    this.courses.push(course);
    this.filterCourses();
    this.cdr.detectChanges();
  }

  onResourceAdded(resource: CourseResource): void {
    if (this.selectedCourse && this.selectedCourse.resources) {
      this.selectedCourse.resources.push(resource);
      this.cdr.detectChanges();
    }
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
        console.error('Erreur lors de la récupération des ressources:', error);
      }
    );
  }

  deleteCourse(courseId: number): void {
    Swal.fire({
      title: 'are you sure?',
      text: 'you cant have this course again !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'yes, delete!',
      cancelButtonText: 'Non, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courseService.deleteCourse(courseId).subscribe(() => {
          this.getAllCourses();
          Swal.fire('Deleted!', 'The course is deleted.', 'success');
        }, (error) => {
          console.error('Error while deleting the course :', error);
          Swal.fire('Error!', 'Error while deleting the course.', 'error');
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
    const index = this.courses.findIndex(course => course.id === updatedCourse.id);
    if (index !== -1) {
      this.courses[index] = updatedCourse;
      this.filterCourses();
      this.cdr.detectChanges();
    }
  }

  openEnrollModal(course: Course): void {
    console.log('Ouverture du modal d\'inscription pour le cours:', course);
    this.selectedCourse = course;
    this.showEnrollModal = true;
    this.cdr.detectChanges();
  }

  onStudentsEnrolled(): void {
    this.getAllCourses();
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
        console.error('Erreur lors de la récupération des étudiants inscrits:', error);
      }
    );
  }
}
