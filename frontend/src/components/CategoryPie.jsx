import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = [
  "#6366f1", // indigo
  "#22c55e", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#64748b", // slate
];

export default function CategoryPie({ data, onSelectCategory }) {
  if (!data || Object.keys(data).length === 0) return null;

  const entries = Object.entries(data);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  if (!total) return null;

  const chartData = entries.map(([name, value]) => ({
    name,
    value,
    percent: ((value / total) * 100).toFixed(1),
  }));

  return (
    <motion.div
      className="chart"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h3>Category Split</h3>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={115}
            paddingAngle={3}          // small gap, still sharp
            isAnimationActive
            animationBegin={0}
            animationDuration={700}
            animationEasing="ease-out"
            onClick={(slice) => onSelectCategory?.(slice.name)}
          >
            {chartData.map((_, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </Pie>


          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            }}
            formatter={(value, _, { payload }) => [
              `₹ ${value} (${payload.percent}%)`,
              payload.name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* LEGEND */}
      <div className="legend">
        {chartData.map((c, i) => (
          <div key={c.name} className="legend-item">
            <span
              className="dot"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            <span>
              {c.name} — {c.percent}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
