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
  totalCount: number;

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
  role: string;
  token?: string;
}

export interface Menu {
  name: string;
  url: string;
}




