import { RazorKeyForm } from "@/app/razorKey";

const Register = () => {
  return (
    <div className="flex flex-col gap-12">
      <h1 className="text-4xl font-bold text-foreground/80">
        Merchant Registration
      </h1>

      <RazorKeyForm />
    </div>
  );
};

export default Register;
