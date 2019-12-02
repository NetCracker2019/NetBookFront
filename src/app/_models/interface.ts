export interface  Book {
  bookId: number;
  title: string;
  authors: Array<string>;
  genres: Array<string>;
  likes: number;
  imagePath: string;
  releaseDate: string;
  language: string;
  pages: number;
  description: string;
  approved: boolean;
   /* public img: string;
    public author: string;
    public genre: string;
    public date: string;
    public language: string;*/
}

export interface Event {
  title: string;
  date: string;
  url: string;
}

export interface Announcement {
  announcmentId: number;
  title: string;
  description: string;
  image_path: string;
  releaseDate: string;
  totalCount: number;
}
export interface ViewAnnouncement {
  announcmentId: number;
  releaseDate: string;
  title: string;
  description: string;
  imagePath: string;
  authors: Array<string>;
  genres: Array<string>;
}

// export class Author {
//   id: number;
//   name: string;
// }

export interface Data {
  fullName: string;
}

export interface Genre {
  genreId: number;
  genreName: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  sex: string;
  country: string;
  city: string;
  status: string;
  regDate: Date;
  avatarFilePath: string;
  role: string;
  token?: string;
}

export interface Achievement {
  cntBook: number;
  title: string;
  description: string;
  image_path: string;
}

export interface ShortBookDescription {
  bookId: number;
  title: string;
  authors: string[];
  image_path: string;
  favourite: boolean;
  reading: boolean;
  remove: boolean;
}

export interface Menu {
  name: string;
  url: string;
}

export interface NewModelBook {
  bookId: number;
  title: string;
  authors: string[];
  likes: number;
  imagePath: string;
  releaseDate: string;
  pages: number;
  genres: string[];
  description: string;
}


export interface Review {
  reviewId: number;
  userId: number;
  bookId: number;
  userName: string;
  userAvatarPath: string;
  reviewText: string;
  rating: number;
  approved: boolean;
}
export interface Message {
  message: string;
  fromName: string;
  toName: string;
  dateTimeSend: Date;
}

export interface Genre {
  genreId: number;
  genreName: string;
}

export interface Author {
  authorId: number;
  fullName: string;
}

