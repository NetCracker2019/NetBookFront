export interface  Book {
     idbook: number;
     title: string;
     like: number;
     imagePath: string;
     release_date: string;
     language: string;
     pages: number;
     approved: boolean;
   /* public img: string;
    public author: string;
    public genre: string;
    public date: string;
    public language: string;*/
}

export interface Announcement {
  title: string;
  description: string;
  image_path: string;
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
  likes: number;
  title: string;
  authors: string[];
  image_path: string;
}

