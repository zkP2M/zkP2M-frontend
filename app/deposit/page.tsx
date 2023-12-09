import { DepositForm } from "./form";

const DepositPage = () => {
  return (
    <div className="flex flex-col gap-12">
      <h1 className="text-4xl font-black text-foreground/80">Deposit</h1>

      <DepositForm />
    </div>
  );
};

export default DepositPage;
