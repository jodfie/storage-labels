import { createContext, useContext, useState, ReactNode } from 'react';
import { Container, Item } from '../types';

interface AppState {
  containers: Container[];
  setContainers: (containers: Container[]) => void;
  selectedContainer: Container | null;
  setSelectedContainer: (container: Container | null) => void;
  items: Item[];
  setItems: (items: Item[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        containers,
        setContainers,
        selectedContainer,
        setSelectedContainer,
        items,
        setItems,
        isLoading,
        setIsLoading,
        error,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
