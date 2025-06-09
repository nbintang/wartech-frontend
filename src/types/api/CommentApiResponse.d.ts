export interface CommentApiResponse {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isEdited: boolean;
  user: {
    id: string;
    name: string;
    email:string;
    image: string;
  };
  article: {
    id: string;
    title: string;
    slug: string;
    publishedAt: string;
  };
  children: any[];
}
