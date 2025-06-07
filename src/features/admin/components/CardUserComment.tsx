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

const users = [
  {
    name: "Pedro Duarte",
    email: "Q2NtT@example.com",
    avatar: "https://github.com/pedro-duarte.png",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores eum ex incidunt.",
  },
  {
    name: "Pedro Duarte",
    email: "Q2NtT@example.com",
    avatar: "https://github.com/pedro-duarte.png",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam, odit molestias, eligendi, recusandae consequatur veritatis ipsa voluptatem minima corrupti nam! Necessitatibus, corrupti quae.",
  },
  {
    name: "Pedro Duarte",
    email: "Q2NtT@example.com",
    avatar: "https://github.com/pedro-duarte.png",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores eum ex incidunt.",
  },
  {
    name: "Pedro Duarte",
    email: "Q2NtT@example.com",
    avatar: "https://github.com/pedro-duarte.png",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam, odit molestias, eligendi, recusandae consequatur veritatis ipsa voluptatem minima corrupti nam! Necessitatibus, corrupti quae.",
  },
  {
    name: "Pedro Duarte",
    email: "Q2NtT@example.com",
    avatar: "https://github.com/pedro-duarte.png",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam, odit molestias, eligendi, recusandae consequatur veritatis ipsa voluptatem minima corrupti nam! Necessitatibus, corrupti quae.",
  },
  {
    name: "Pedro Duarte",
    email: "Q2NtT@example.com",
    avatar: "https://github.com/pedro-duarte.png",
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita laboriosam, odit molestias, eligendi, recusandae consequatur veritatis ipsa voluptatem minima corrupti nam! Necessitatibus, corrupti quae.",
  },
];

function CardUserComment() {
  return (
    <Card className={cn("rounded-none border-none h-[500px] md:h-[480px] pb-0 flex flex-col")}>
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle className="text-2xl font-bold">Articles Comments</CardTitle>
        <CardDescription>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores eum
          ex incidunt.
        </CardDescription>
      </CardHeader>
      
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <CardContent className="grid gap-6 py-2">
            {users.map((user, index) => (
              <div key={`${user.name}-${index}`} className="">
                <div className="flex items-start gap-4">
                  <Avatar className="border">
                    <AvatarImage src={user.avatar} alt="Image" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm leading-none font-medium">
                      {user.name}
                    </p>
                    <p className="text-muted-foreground text-xs">{user.email}</p>
                    <div className="mt-2">
                      <p className="text-muted-foreground text-balance text-xs">
                        {user.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <ScrollBar />
        </ScrollArea>
      </div>
    </Card>
  );
}

export default CardUserComment;
