export default function Layout({children}: {children: React.ReactNode}) {
    return (
        <section className=" mt-10 flex items-center justify-center">
            {children}
        </section>
    );
}