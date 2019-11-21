export interface  Book {
  idbook: number;
  title: string;
  author: string;
  genre: string;
  like: number;
  imagePath: string;
  release_date: string;
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

export interface Genre {
  genreId: number;
  genreName: string;
}
