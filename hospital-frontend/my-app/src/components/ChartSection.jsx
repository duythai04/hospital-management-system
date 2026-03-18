import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "Jan", uv: 60, color: "#3b82f6" },
  { name: "Feb", uv: 75, color: "#10b981" },
  { name: "Mar", uv: 62, color: "#ef4444" },
  { name: "Apr", uv: 85, color: "#f59e0b" },
  { name: "May", uv: 70, color: "#6366f1" },
  { name: "Jun", uv: 90, color: "#14b8a6" },
];

const ChartSection = () => {
  return (
    <div className="card shadow-sm p-4 border-0">
      <h5 className="text-center mb-4 text-muted">
        Monthly Registered Users
      </h5>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
            />

            <Bar dataKey="uv" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>

          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;