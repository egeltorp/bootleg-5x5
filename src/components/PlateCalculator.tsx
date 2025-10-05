import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const STANDARD_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25]; // kg
const BAR_WEIGHT = 20; // kg

export const PlateCalculator = () => {
  const [totalWeight, setTotalWeight] = useState<number>(60);

  const calculatePlates = (total: number): { weight: number; count: number }[] => {
    if (total < BAR_WEIGHT) return [];
    
    let remainingWeight = (total - BAR_WEIGHT) / 2; // weight per side
    const plates: { weight: number; count: number }[] = [];

    for (const plate of STANDARD_PLATES) {
      if (remainingWeight >= plate) {
        const count = Math.floor(remainingWeight / plate);
        plates.push({ weight: plate, count });
        remainingWeight = Math.round((remainingWeight - count * plate) * 100) / 100;
      }
    }

    return plates;
  };

  const plates = calculatePlates(totalWeight);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plate Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="weight">Total Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            value={totalWeight}
            onChange={(e) => setTotalWeight(Number(e.target.value))}
            step="2.5"
            min={BAR_WEIGHT}
          />
        </div>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Bar: {BAR_WEIGHT} kg | Per side: {((totalWeight - BAR_WEIGHT) / 2).toFixed(1)} kg
          </p>

          {plates.length > 0 ? (
            <div className="space-y-2">
              <p className="font-medium text-sm">Plates per side:</p>
              <div className="space-y-2">
                {plates.map((plate, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted"
                  >
                    <span className="font-semibold">{plate.weight} kg</span>
                    <span className="text-muted-foreground">× {plate.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Just the bar ({BAR_WEIGHT} kg)
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
