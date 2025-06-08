export interface CommentApiResponse {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
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
