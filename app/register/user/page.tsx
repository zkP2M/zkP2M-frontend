import { RazorKeyForm } from "@/app/razorKey";

const Register = () => {
  return (
    <div className="flex flex-col gap-12 min-w-[500px]">
      <h1 className="text-4xl font-black text-foreground/80">
        User Registration
      </h1>

      <RazorKeyForm
        label="User Name"
        description="This is your user name"
        placeholder="Rohit Singh"
      />
    </div>
  );
};

export default Register;
