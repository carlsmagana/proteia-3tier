import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ConsolidatedProduct } from '../../data/consolidated-products';

interface PriceDistributionChartProps {
  data: ConsolidatedProduct[];
}

export function PriceDistributionChart({ data }: PriceDistributionChartProps) {
  const processDistributionData = () => {
    const priceRanges = [
      { label: '$0-500', min: 0, max: 500, color: 'hsl(var(--chart-1))' },
      { label: '$500-1000', min: 500, max: 1000, color: 'hsl(var(--chart-2))' },
      { label: '$1000-1500', min: 1000, max: 1500, color: 'hsl(var(--chart-3))' },
      { label: '$1500-2000', min: 1500, max: 2000, color: 'hsl(var(--chart-4))' },
      { label: '$2000+', min: 2000, max: Infinity, color: 'hsl(var(--chart-5))' }
    ];

    const categories = Array.from(new Set(data.map(item => item.category))).filter(Boolean);

    const categoryPalette = [
      'hsl(var(--chart-1))',
      'hsl(var(--chart-2))',
      'hsl(var(--chart-3))',
      'hsl(var(--chart-4))',
      'hsl(var(--chart-5))'
    ];

    const categoryColors = categories.reduce<Record<string, string>>((acc, category, idx) => {
      acc[category] = categoryPalette[idx % categoryPalette.length];
      return acc;
    }, {});

    const distribution = priceRanges.map(range => {
      const rangeData: Record<string, number | string> = {
        range: range.label,
        total: 0
      };

      categories.forEach(category => {
        const count = data.filter(item =>
          item.category === category &&
          item.price >= range.min &&
          item.price < range.max
        ).length;

        rangeData[category] = count;
        rangeData.total += count;
      });

      return rangeData;
    });

    return { distribution, categories, categoryColors };
  };

  const { distribution: distributionData, categories, categoryColors } = processDistributionData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          <div className="space-y-1 text-sm">
            {categories.map(category => (
              <p key={category}>
                {category}: <span className="font-medium">{(data[category as keyof typeof data] as number) || 0} productos</span>
              </p>
            ))}
            <p>Total: <span className="font-medium">{data.total} productos</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Distribución de Precios por Categoría
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Análisis de rangos de precio en el mercado mexicano
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="range"
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              {categories.map(category => (
                <Bar
                  key={category}
                  dataKey={category}
                  stackId="stack"
                  fill={categoryColors[category]}
                  name={category}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {categories.map(category => (
              <div key={category} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: categoryColors[category] }}
                ></div>
                <span>{category}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            <p>• Rango más popular: {distributionData.sort((a, b) => b.total - a.total)[0]?.range}</p>
            <p>• Total de productos analizados: {data.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
