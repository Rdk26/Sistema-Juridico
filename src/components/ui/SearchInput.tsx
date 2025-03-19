import { Search } from 'lucide-react';

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
}

export function SearchInput({ placeholder = "Buscar...", className = "", ...props }: SearchInputProps) {
  return (
    <div className="relative flex-1 md:flex-none">
      <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="search"
        placeholder={placeholder}
        className={`pl-12 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${className}`}
        {...props}
      />
    </div>
  );
} 