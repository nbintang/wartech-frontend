import { Card, CardContent } from "@/components/ui/card";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { TooltipProvider } from "@/components/ui/tooltip";
import NewArticleForm from "@/features/admin/new-articles/components/NewArticleForm";

export default function NewArticle() {
    return (
      <Card>
        <CardContent>
              <NewArticleForm/>
        </CardContent>
      </Card>
    );
}