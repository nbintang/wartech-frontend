import { Card, CardContent } from "@/components/ui/card";
import NewArticleForm from "@/features/admin/articles/components/NewArticleForm";

export default function NewArticle() {
  return (
    <Card className=" w-full px-5 my-5">
      <NewArticleForm />
    </Card>
  );
}
