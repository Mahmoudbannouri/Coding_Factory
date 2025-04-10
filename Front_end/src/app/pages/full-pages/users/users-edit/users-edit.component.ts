import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss',
    '../../../../../assets/sass/pages/page-users.scss',
    '../../../../../assets/sass/libs/select.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersEditComponent implements OnInit {


  selectedLanguages = ["English"];
  languages = [
    { value: "English", name: 'English' },
    { value: "Spanish", name: 'Spanish' },
    { value: "French", name: 'French' },
    { value: "Russian", name: 'Russian' },
    { value: "German", name: 'German' },
    { value: "Hindi", name: 'Hindi' },
    { value: "Arabic", name: 'Arabic' },
    { value: "Sanskrit", name: 'Sanskrit' },
  ];

  selectedMusic = ["Jazz", "Hip Hop"];
  music = [
    { value: "Rock", name: 'Rock' },
    { value: "Jazz", name: 'Jazz' },
    { value: "Disco", name: 'Disco' },
    { value: "Pop", name: 'Pop' },
    { value: "Techno", name: 'Techno' },
    { value: "Folk", name: 'Folk' },
    { value: "Hip Hop", name: 'Hip Hop' },
  ];

  selectedMovies = ["The Dark Knight", "Perl Harbour"];
  movies = [
    { value: "Avatar", name: 'Avatar' },
    { value: "The Dark Knight", name: 'The Dark Knight' },
    { value: "Harry Potter", name: 'Harry Potter' },
    { value: "Iron Man", name: 'Iron Man' },
    { value: "Spider Man", name: 'Spider Man' },
    { value: "Perl Harbour", name: 'Perl Harbour' },
    { value: "Airplane!", name: 'Airplane!' },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
