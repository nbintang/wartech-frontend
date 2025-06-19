// CardUserComment.jsx

import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import {CommentItem} from "./CommentItem";

const CommentsItems = ({ comments }: { comments: CommentApiResponse[] }) =>
  comments.map((comment) => <CommentItem key={comment.id} comment={comment} />);
export default CommentsItems;
