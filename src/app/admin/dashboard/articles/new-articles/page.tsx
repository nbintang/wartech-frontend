import { Card, CardContent } from "@/components/ui/card";
import NewArticleForm from "@/features/admin/articles/components/NewArticleForm";

export default function NewArticle() {
    return (
      <Card>
        <CardContent>
              <NewArticleForm/>
        </CardContent>
      </Card>
    );
}