import { Card, CardContent } from "@/components/ui/card";
import UpdateArticleForm from "@/features/admin/articles/components/UpdateArticleForm";
import { use } from "react";

export default function ArticleByIdPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  return (
    <Card>
      <CardContent>
        <UpdateArticleForm slug={slug} />
      </CardContent>
    </Card>
  );
}
