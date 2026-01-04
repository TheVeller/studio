import { BrainCircuit } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">Alert Insights</h1>
        </div>
      </div>
    </header>
  );
}
