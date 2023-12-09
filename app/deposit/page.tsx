import { DepositForm } from "./form";

const DepositPage = () => {
  return (
    <div className="max-w-xl mx-auto mt-24 flex flex-col gap-12">
      <h1 className="text-4xl font-bold text-slate-200">Deposit</h1>

      <DepositForm />
    </div>
  );
};

export default DepositPage;
