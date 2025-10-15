import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ConsolidatedProduct } from '../../data/consolidated-products';

interface OpportunityMatrixProps {
  data: ConsolidatedProduct[];
}

export function OpportunityMatrix({ data }: OpportunityMatrixProps) {
  const processedData = data.map(item => ({
    x: item.price,
    y: item.estSales,
    z: item.rating * 10, // Size multiplier
    brand: item.brand,
    name: item.productName.substring(0, 50) + '...',
    category: item.category,
    revenue: item.estRevenue,
    margin: item.netMargin,
    pricePerKg: item.pricePerKg
  }));

  const categoryPalette = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))'
  ];

  const categories = Array.from(new Set(processedData.map(item => item.category))).filter(Boolean);

  const categorySeries = categories.map((category, index) => ({
    category,
    color: categoryPalette[index % categoryPalette.length],
    points: processedData.filter(item => item.category === category)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border rounded-lg shadow-lg max-w-xs">
          <p className="font-semibold text-sm">{data.brand}</p>
          <p className="text-xs text-gray-600 mb-2">{data.name}</p>
          <div className="space-y-1 text-xs">
            <p>Precio: <span className="font-medium">${data.x.toLocaleString()}</span></p>
            <p>Ventas Est.: <span className="font-medium">{data.y.toLocaleString()}</span></p>
            <p>Revenue: <span className="font-medium">${data.revenue.toLocaleString()}</span></p>
            <p>Rating: <span className="font-medium">{(data.z / 10).toFixed(1)}/5</span></p>
            <p>Margen: <span className="font-medium">{data.margin}%</span></p>
            {data.pricePerKg ? (
              <p>Precio/kg: <span className="font-medium">${data.pricePerKg.toFixed(0)}</span></p>
            ) : null}
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
          Matriz de Oportunidades - Precio vs Ventas
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tamaño de burbuja = Rating • Color = Categoría
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="x"
                type="number"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                stroke="#6B7280"
                fontSize={12}
                name="Precio"
              />
              <YAxis
                dataKey="y"
                type="number"
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                stroke="#6B7280"
                fontSize={12}
                name="Ventas"
              />
            <Tooltip content={<CustomTooltip />} />
              {categorySeries.map(series => (
                <Scatter
                  key={series.category}
                  name={series.category}
                  data={series.points}
                  fill={series.color}
                  fillOpacity={0.7}
                />
              ))}
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          {categorySeries.map(series => (
            <div key={series.category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: series.color }}
              ></div>
              <span>
                {series.category} ({series.points.length})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
