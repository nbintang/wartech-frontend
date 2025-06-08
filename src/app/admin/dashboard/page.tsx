
import GridPages from "@/features/admin/components/GridPages";

export default function Page() {
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
          <div className="border-muted relative flex w-full space-y-3 py-3  flex-col mx-auto ">
            <GridPages />
          </div>
        </div>
      </div>
    </section>
  );
}
