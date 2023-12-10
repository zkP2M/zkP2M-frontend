import { RazorKeyForm } from "@/app/razorKey";
import Image from "next/image";

const Register = () => {
  return (
    <div className="flex flex-col gap-12 w-full">
      <div className="flex items-center gap-3 ">
        <h1 className="text-4xl font-black text-foreground px-2 py-3 bg-foreground/5 rounded-sm w-fit">
          User Registration
        </h1>
      </div>

      <RazorKeyForm
        label="User Name"
        description="This is your user name"
        placeholder="Rohit Singh"
      />
    </div>
  );
};

export default Register;
