export default function NewsPage({ params }: { params: { category: string } }) {
    return (
        <div>{params.category}</div>
    );
}