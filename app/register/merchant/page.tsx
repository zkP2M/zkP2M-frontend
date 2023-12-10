import { RazorKeyForm } from "@/app/razorKey";

const Register = () => {
  return (
    <div className="flex flex-col gap-12 w-full">
      <h1 className="text-4xl font-black text-foreground px-2 py-3 bg-foreground/5 rounded-sm w-fit">
        Merchant Registration
      </h1>

      <RazorKeyForm placeholder={`starts with "rzp_test_"`} />
    </div>
  );
};

export default Register;
