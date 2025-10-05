import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlateCalculator } from '@/components/PlateCalculator';
import { ArrowLeft } from 'lucide-react';

export default function PlateCalculatorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Plate Calculator</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <PlateCalculator />
      </main>
    </div>
  );
}
