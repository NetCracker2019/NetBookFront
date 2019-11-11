export interface  Kniga {
     idbook: number;
     title: string;
     like: number;
     imagePath: string;
     release_date: string;
     language: string;
     pagess: number;
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


