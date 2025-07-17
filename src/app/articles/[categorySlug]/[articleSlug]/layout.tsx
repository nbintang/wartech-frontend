import { axiosInstance } from "@/lib/axiosInstance";
import { ArticlebySlugApiResponse } from "@/types/api/ArticleApiResponse";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const getArticleBySlug = async (slug: string) =>
  await axiosInstance.get<ApiResponse<ArticlebySlugApiResponse>>(
    `/protected/articles/${slug}`
  );
export async function generateMetadata({
  params,
}: {
  params: { articleSlug: string };
}): Promise<Metadata> {
  try {
    const res = await getArticleBySlug(params.articleSlug);
    const articleData = res.data?.data;
    return {
      title: articleData?.title,
      description: articleData?.description,
      authors: [{ name: articleData?.author.name }],
      openGraph: {
        title: articleData?.title,
        description: articleData?.description,
        images: [articleData!.image],
        type: "article",
        publishedTime: articleData?.publishedAt
          ? new Date(articleData.publishedAt).toISOString()
          : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title: articleData?.title,
        description: articleData?.description,
        images: [articleData!.image],
      },
    };
  } catch (error) {
    return notFound();
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
