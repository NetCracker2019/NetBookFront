import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BookService} from '../_services/book.service';
import {AuthorService} from '../_services/author.service';
import {AchievementService} from '../_services/achievement.service';
import {Achievement, Author, Genre, User} from '../_models/interface';
import {Observable} from 'rxjs';
import {v4 as uuid} from 'uuid';
import {map, startWith} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-content-achievements',
  templateUrl: './content-achievements.component.html',
  styleUrls: ['./content-achievements.component.css']
})
export class ContentAchievementsComponent implements OnInit {
  control = new FormControl('');
  authors: Author[] = [];
  filteredAuthors: Observable<Author[]>;
  public achievement: Achievement = {} as Achievement;
  favOrRead: string;
  favOrReadGenre: string;
  fileToUpload: File = null;
  fileName: string;
  genres: Genre[];
  selectedGenre: string;
  allAchievements: Achievement[];


  form: FormGroup;
  validationMessages = {
    title: [
      {type: 'pattern', message: 'Title can not be empty or contain forbidden symbol!'},
      {type: 'minLength', message: 'Title can not be empty or less then 2 symbols!'}
    ],
    description: [
      {type: 'pattern', message: 'Description can not be empty or contain forbidden symbol!'},
      {type: 'minLength', message: 'Description can not be empty or less then 5 symbols!'}
    ],
    numberBook: [
      {type: 'pattern', message: 'Is not a number!'},
      {type: 'min', message: 'The number must be more then 0!'}
    ]
  };

  constructor(private bookService: BookService,
              private authorService: AuthorService,
              private achievementService: AchievementService,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.authorService.getAuthors()
      .subscribe(authors => this.authors = authors);

    this.filteredAuthors = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this.filterString(value))
    );
    this.bookService.getGenres()
      .subscribe(genres => this.genres = genres);
    this.getAllAchievements();
    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.pattern('[a-zA-Z0-9_.!(), ]+'),
        Validators.minLength(2)
      ]),
      description: new FormControl('', [
        Validators.pattern('[a-zA-Z0-9_.!(), ]+'),
        Validators.minLength(5),
      ]),
      numberBook: new FormControl('', [
        Validators.pattern('^[0-9]+$'),
        Validators.min(0)
      ]),
      // author: new FormControl(),
      achievementFilePath: new FormControl()
    });
  }

  filterString(value: string): Author[] {
    const filterValue = value.trim().toLowerCase();
    return this.authors.filter(author => author.fullName.toLowerCase().includes(filterValue));
  }
  getAllAchievements() {
    this.achievementService.getAllAchievement().subscribe(data=>{
      this.allAchievements = data;
    });
  }

  addAchievement(type: string) {
    this.achievement.title = this.form.controls.title.value;
    this.achievement.description = this.form.controls.description.value;
    this.achievement.amount = this.form.controls.numberBook.value;
    this.achievement.authorName = this.control.value;
    this.achievement.genreName = this.selectedGenre;
    if (type == 'author') {
      if (this.favOrRead == 'fav') {
        this.achievement.favourite = true;
        this.achievement.readBook = null;
      } else {
        this.achievement.favourite = null;
        this.achievement.readBook = true;
      }
    } else if (type == 'genre') {
      if (this.favOrReadGenre == 'favGenre') {
        this.achievement.favourite = true;
        this.achievement.readBook = null;
      } else {
        this.achievement.favourite = null;
        this.achievement.readBook = true;
      }
    }
    if (this.fileToUpload != null) {
      this.fileName = uuid();
      this.achievement.image_path = this.fileName;

      this.achievementService.postFile(this.fileToUpload, this.fileName).subscribe(data => {
        },
        error => {
          this.toastr.error(`${environment.errorMessage}`);
        });
    }
    this.achievementService.addAchievement(this.achievement).subscribe(data => {
      if (data) {
        this.toastr.success('Achievement is added!');
      } else {
        this.toastr.error('The achievement is exists!');
      }
    });
    this.getAllAchievements();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
  }
  getPhoto(imageName: string) {
    return `${environment.apiUrl}/files/download?filename=${imageName}`;
  }
}
