import { userColumns } from "@/features/admin/components/userColumns";
import { DataTable } from "@/features/admin/components/DataTable";
import { UsersApiResponse } from "@/types/api/userApiResponse";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/lib/utils";
import { ArticleApiResponse } from "@/types/api/articleApiResponse";
import { articleColumns } from "@/features/admin/components/articleColumns";
import CardUserComment from "@/features/admin/components/CardUserComment";
import CardChart from "@/features/admin/components/CardChart";

interface Feature {
  title: string;
  description: string;
  image: string;
}

interface Feature166Props {
  feature1: Feature;
  feature2: Feature;
  feature3: Feature;
  feature4: Feature;
}

const dummyUsers: UsersApiResponse[] = Array.from(
  { length: 15 },
  (_, index) => ({
    id: `${index + 1}`,
    name: `User ${index + 1}`,
    email: `user${index + 1}@example.com`,
    createdAt: new Date().toISOString(),
    image: `https://dummyimage.com/600x400/000/fff&text=User+${index + 1}`,
    updatedAt: new Date().toISOString(),
    verified: index % 2 === 0,
    role: index % 2 === 0 ? "ADMIN" : "USER",
  })
);

export const dummyArticles: ArticleApiResponse[] = Array.from(
  { length: 15 },
  (_, i) => ({
    id: `article-${i + 1}`,
    title: `Article ${i + 1}`,
    slug: `article-${i + 1}`,
    image: `https://dummyimage.com/600x400/000/fff&text=Article+${i + 1}`,
    status: i % 2 === 0 ? "PUBLISHED" : "DRAFT",
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: {
      id: `category-${i + 1}`,
      name: i % 2 === 0 ? "Technology" : "Health",
      slug: i % 2 === 0 ? "technology" : "health",
    },
    author: {
      id: "admin-id",
      name: "Admin",
    },
    commentsCount: Math.floor(Math.random() * 10),
    likesCount: Math.floor(Math.random() * 20),
    tagsCount: 2,
    tags: [
      {
        id: `tag-js-${i + 1}`,
        name: "JavaScript",
        slug: "javascript",
      },
      {
        id: `tag-startup-${i + 1}`,
        name: "Startup",
        slug: "startup",
      },
    ],
  })
);

const GridPages = () => {
  return (
    <section className="py-5 px-3">
      <div className=" container">
        <div className="mb-3 ml-4 max-w-lg">
          <h1 className="text-4xl font-semibold">Recent Activities</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut
            suscipit explicabo ipsum asperiores animi accusantium harum hic amet
            et non do
          </p>
        </div>
        <div className="relative flex justify-center">
          <div className="border-muted relative flex rounded-lg  flex-col border w-full overflow-hidden">
            <div className="relative flex flex-col lg:flex-row">
              <div className="border-muted flex flex-col justify-between border-b border-solid lg:w-3/5 lg:border-r lg:border-b-0 overflow-hidden">
                <DataTable columns={articleColumns} data={dummyArticles} />
              </div>
              <div className="flex flex-col justify-between  lg:w-2/5">
                <CardUserComment />
              </div>
            </div>
            <div className="border-muted relative flex flex-col border-t border-solid lg:flex-row">
              <div className="border-muted2 flex flex-col justify-between border-b border-solid lg:w-2/5 lg:border-r lg:border-b-0">
                <CardChart />
              </div>
              <div className="flex flex-col justify-between lg:w-3/5 overflow-hidden">
                <DataTable columns={userColumns} data={dummyUsers} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GridPages;
