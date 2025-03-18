// pages/DashboardPage.tsx
import { ProcessTable } from '../components/ProcessTable';
import { FinanceChart } from '../components/FinanceChart';
import { ReportsSection } from '../components/ReportsSection';
import { Header } from '../components/Header';

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