// ...existing code...
import { motion } from "framer-motion";

const formatMonth = (yyyyMm) => {
  const [y, m] = (yyyyMm || "").split("-");
  if (!y || !m) return yyyyMm;
  return new Date(y, m - 1).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });
};

export default function MonthSidebar({ data = [], selected, onSelect = () => {} }) {
  return (
    <div className="sidebar">
      {Array.isArray(data) &&
        data.map((m) => (
          <motion.button
            key={m}
            whileTap={{ scale: 0.95 }}
            whileHover={{ x: 4 }}
            className={m === selected ? "month active" : "month"}
            onClick={() => onSelect(m)}
          >
            {formatMonth(m)}
          </motion.button>
        ))}
    </div>
  );
}
// ...existing code...