import { DepositForm } from "./form";

const DepositPage = () => {
  return (
    <div className="flex flex-col gap-12 min-w-[700px]">
      <h1 className="text-4xl font-black text-foreground px-2 py-3 bg-foreground/5 rounded-sm w-fit">
        Deposit
      </h1>

      <DepositForm />
    </div>
  );
};

export default DepositPage;
