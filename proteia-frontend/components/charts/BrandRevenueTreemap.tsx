import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ConsolidatedProduct } from '../../data/consolidated-products';

interface BrandRevenueTreemapProps {
  data: ConsolidatedProduct[];
}

export function BrandRevenueTreemap({ data }: BrandRevenueTreemapProps) {
  const processTreemapData = () => {
    const brandRevenue = data.reduce((acc, item) => {
      const brand = item.brand;
      const revenue = item.estRevenue || 0;

      if (!acc[brand]) {
        acc[brand] = {
          name: brand,
          size: 0,
          rating: 0,
          count: 0,
          avgPrice: 0,
          totalSales: 0
        };
      }

      acc[brand].size += revenue;
      acc[brand].rating += item.rating;
      acc[brand].avgPrice += item.price;
      acc[brand].totalSales += item.estSales;
      acc[brand].count += 1;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(brandRevenue)
      .map((brand: any) => ({
        ...brand,
        rating: brand.rating / brand.count,
        avgPrice: brand.avgPrice / brand.count,
        name: brand.name.length > 15 ? brand.name.substring(0, 15) + '...' : brand.name
      }))
      .sort((a: any, b: any) => b.size - a.size)
      .slice(0, 12); // Top 12 brands
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <div className="space-y-1 text-sm">
            <p>Revenue: <span className="font-medium">${data.size.toLocaleString()}</span></p>
            <p>Rating: <span className="font-medium">{data.rating.toFixed(1)}/5</span></p>
            <p>Productos: <span className="font-medium">{data.count}</span></p>
            <p>Precio Prom: <span className="font-medium">${data.avgPrice.toFixed(0)}</span></p>
            <p>Ventas Tot: <span className="font-medium">{data.totalSales.toLocaleString()}</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomContent = ({ x, y, width, height, name, rating, size }: any) => {
    if (width < 60 || height < 40) return null;

    const intensity = Math.min(rating / 5, 1);
    const sizeIntensity = Math.log(size + 1) / Math.log(10000000); // Normalizar tamaño
    const bgOpacity = 0.3 + intensity * 0.4 + sizeIntensity * 0.3;

    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill={`hsl(var(--chart-1))`}
          fillOpacity={bgOpacity}
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          rx={4}
        />
        <text
          x={x + width / 2}
          y={y + height / 2 - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={Math.min(width / 8, height / 6, 14)}
          fill="#111827"
          fontWeight="600"
        >
          {name}
        </text>
        <text
          x={x + width / 2}
          y={y + height / 2 + 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={Math.min(width / 10, height / 8, 11)}
          fill="#6B7280"
          fontWeight="500"
        >
          ★ {rating.toFixed(1)}
        </text>
      </g>
    );
  };

  const treemapData = processTreemapData();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Análisis de Revenue por Marca
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Tamaño = Revenue • Intensidad = Rating • Top 12 marcas
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-96">
          <ResponsiveContainer>
            <Treemap
              data={treemapData}
              dataKey="size"
              content={<CustomContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Top 3 por Revenue:</p>
            <ul className="text-xs space-y-1">
              {treemapData.slice(0, 3).map((brand: any, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{brand.name}</span>
                  <span>${(brand.size / 1000000).toFixed(1)}M</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium">Mejor Rating:</p>
            <ul className="text-xs space-y-1">
              {treemapData
                .sort((a: any, b: any) => b.rating - a.rating)
                .slice(0, 3)
                .map((brand: any, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{brand.name}</span>
                    <span>★ {brand.rating.toFixed(1)}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}