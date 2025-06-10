export default async function ArticleByIdPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return <div>{id}</div>;
}
