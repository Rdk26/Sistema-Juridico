import {
    createContext,
    useContext,
    ReactNode,
    Children,
    isValidElement,
  } from 'react';
  
  interface TabsContextType {
    value: string;
    onValueChange: (value: string) => void;
  }
  
  const TabsContext = createContext<TabsContextType | null>(null);
  
  export function Tabs({
    children,
    value,
    onValueChange,
  }: {
    children: ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }) {
    return (
      <TabsContext.Provider value={{ value, onValueChange }}>
        <div className="flex flex-col gap-2">{children}</div>
      </TabsContext.Provider>
    );
  }
  
  export function TabsList({ 
    children,
    className,
  }: { 
    children: ReactNode;
    className?: string;
  }) {
    return (
      <div 
        role="tablist" 
        className={`flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg ${className || ''}`}
      >
        {Children.map(children, (child) => {
          if (isValidElement(child) && child.type === TabsTrigger) {
            return child;
          }
          return null;
        })}
      </div>
    );
  }
  
  export function TabsTrigger({
    children,
    value,
    className,
  }: {
    children: ReactNode;
    value: string;
    className?: string;
  }) {
    const context = useContext(TabsContext);
    
    if (!context) {
      throw new Error('TabsTrigger must be used within a Tabs component');
    }
  
    return (
      <button
        role="tab"
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
          hover:bg-gray-200 dark:hover:bg-gray-700
          ${context.value === value ? 'bg-white dark:bg-gray-600 shadow-sm' : ''}
          ${className || ''}`}
        onClick={() => context.onValueChange(value)}
      >
        {children}
      </button>
    );
  }
  
  export function TabsContent({
    children,
    value,
  }: {
    children: ReactNode;
    value: string;
  }) {
    const context = useContext(TabsContext);
  
    if (!context) {
      throw new Error('TabsContent must be used within a Tabs component');
    }
  
    return context.value === value ? (
      <div role="tabpanel" className="pt-4">
        {children}
      </div>
    ) : null;
  }