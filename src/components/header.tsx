import { BrainCircuit } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4 max-w-7xl">
        <div className="flex items-center gap-3">
          <BrainCircuit className="h-7 w-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground font-headline">
            Alert Insights
          </h1>
        </div>
      </div>
    </header>
  );
}
