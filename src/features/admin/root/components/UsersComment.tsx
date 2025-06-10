// CardUserComment.jsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import Link from "next/link";

const CommentsUsers = ({ comments }: { comments: CommentApiResponse[] }) =>
  comments.map((comment) => (
    <div key={comment.id} className="py-4 border-border border-t ">
      <div className="flex items-start gap-4">
        <Avatar className="border">
          <AvatarImage src={comment.user.image || ""} alt="Image" />
          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5 w-full">
          <div className="flex justify-between w-auto">
            <div className="flex items-center gap-2">
              <p className="text-sm leading-none font-medium">
                {comment.user.name}
              </p>
              <Separator orientation="vertical" className="min-h-[10px]  " />
              <p className="text-muted-foreground text-sm">
                {comment.user.email}
              </p>
            </div>
            <div className="">
              <p className="text-xs text-muted-foreground">
                {format(new Date(comment.createdAt), "hh:mm dd MMM yyyy")}
              </p>
            </div>
          </div>
          <div className="flex">
            <p className="text-muted-foreground text-xs">
              Commented on <Link className="underline text-blue-400" href={`/admin/dashboard/articles/${comment.article.id}`}>{comment.article.title}</Link>
            </p>
          </div>
          <div className="mt-1">
            <p className="text-muted-foreground text-balance text-xs">
              {comment.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  ));
export default CommentsUsers;
