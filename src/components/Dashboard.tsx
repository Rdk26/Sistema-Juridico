import { Header } from './Header';
import { ProcessTable } from './ProcessTable';
import { FinanceChart } from './FinanceChart';
import { ReportsSection } from './ReportsSection';

export default function Dashboard() {
  return (
    <main className="flex-1 overflow-auto">
      <Header />
      <div className="p-6 space-y-6">
        <ProcessTable />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FinanceChart />
          <ReportsSection />
        </div>
      </div>
    </main>
  );
}