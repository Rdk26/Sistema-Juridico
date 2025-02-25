
import { Header } from './Header';
import { ProcessTable } from './ProcessTable';
import { FinanceChart } from './FinanceChart';
import { ReportsSection } from './ReportsSection';

type DashboardProps = {
  onThemeToggle: () => void; // Mantenha a definição
};


export default function Dashboard({ onThemeToggle }: DashboardProps) {
  return (
    <main className="flex-1 overflow-auto">
      <Header onThemeToggle={onThemeToggle} />
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