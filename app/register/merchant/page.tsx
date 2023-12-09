import { RazorKeyForm } from "@/app/razorKey";

const Register = () => {
  return (
    <div className="flex flex-col gap-12">
      <h1 className="text-4xl font-black text-foreground/80">
        Merchant Registration
      </h1>

      <RazorKeyForm placeholder={`starts with "rzp_test_"`} />
    </div>
  );
};

export default Register;
