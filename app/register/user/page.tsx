import { RazorKeyForm } from "@/app/razorKey";

const Register = () => {
  return (
    <div className="flex flex-col gap-12">
      <h1 className="text-4xl font-bold text-foreground/80">
        User Registration
      </h1>

      <RazorKeyForm label="User Name" />
    </div>
  );
};

export default Register;
