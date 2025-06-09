// CardUserComment.jsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import DashboardRootCardLayout from "./DashboardRootCardLayout";
import { CommentApiResponse } from "@/types/api/CommentApiResponse";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

function CommentsUsers({
  redirectUrl,
  comments,
}: {
  redirectUrl?: string;
  comments: CommentApiResponse[];
}) {
  return (
    <DashboardRootCardLayout
      redirectUrl={redirectUrl}
      title="Comments"
      description={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam, 
        odit molestias, eligendi, recusanda`}
    >
      {comments.map((comment) => (
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
                  <Separator
                    orientation="vertical"
                    className="min-h-[10px]  "
                  />
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
                  Commented on {comment.article.title}
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
      ))}
    </DashboardRootCardLayout>
  );
}

export default CommentsUsers;
