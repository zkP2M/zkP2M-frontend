import { Loader } from "lucide-react";

const Page = () => {
  const isLoading = true;

  if (isLoading) {
    return (
      <div className="w-full h-screen flex gap-2 justify-center items-center">
        <Loader className="animate-spin" />
        <h6 className="text-lg font-bold text-slate-200">Generating Proof..</h6>
      </div>
    );
  }

  return (
    <div>
      <h6 className="text-4xl font-bold text-slate-200">Hello</h6>
    </div>
  );
};

export default Page;
