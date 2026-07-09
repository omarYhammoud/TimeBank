import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import RecentExchanges from "../../components/ecommerce/RecentOrders"; 
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="TimeBank Dashboard | Community Time Exchange Platform"
        description="Overview space for member balances and live community time exchanges."
      />
      <div className="flex flex-col gap-6">
        {/* 1. Your customized metric cards for Available Hours & Tasks (Top) */}
        <div>
          <EcommerceMetrics />
        </div>

        {/* 2. Your newly cleaned-up TimeBank Exchange Ledger (Bottom) */}
        <div className="col-span-12">
          <RecentExchanges />
        </div>
      </div>
    </>
  );
}