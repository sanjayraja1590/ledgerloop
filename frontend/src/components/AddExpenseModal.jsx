import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import API_BASE from "../api";

export default function AddExpenseModal({
  open,
  onClose,
  onAdded,
  categories = [],
}) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "",
    date: new Date(),
  });

  /* ---------- RESET FORM WHEN MODAL OPENS ---------- */
  useEffect(() => {
    if (open) {
      setForm({
        description: "",
        amount: "",
        category: "",      // 🔥 EMPTY
        date: new Date(),  // current date (good UX)
      });
    }
  }, [open]);


  /* ---------- SUBMIT ---------- */
const submit = async (e) => {
  e.preventDefault();

  const payload = {
    description: form.description,
    amount: Number(form.amount),
    category: form.category || "General",
    date: form.date
      ? form.date.toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  };

  try {
    const res = await fetch(`${API_BASE}/expenses/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Add failed");

    const newExpense = await res.json(); // 🔥 IMPORTANT

    onAdded(newExpense); // pass data UP
    onClose();
  } catch (err) {
    console.error(err);
  }
};



  return (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* MODAL */}
          <motion.div
            className="modal"
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
          >
            <h2>Add Expense</h2>

            <form onSubmit={submit}>
              <input
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                required
              />

              {/* CATEGORY INPUT */}
              <input
                placeholder="Category (default: General)"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              />

              {/* CATEGORY CHIPS */}
              {categories.length > 0 && (
                <div className="category-chips">
                  {categories.map((c) => (
                    <motion.button
                      key={c}
                      type="button"
                      className="chip"
                      whileTap={{ scale: 0.9 }}
                      whileHover={{ y: -1 }}
                      onClick={() =>
                        setForm({ ...form, category: c })
                      }
                    >
                      {c}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* DATE */}
              <div className="date-field">
                <DatePicker
                  selected={form.date}
                  onChange={(date) =>
                    setForm({ ...form, date })
                  }
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  className="date-input"
                />
                <span className="hint">Type or pick a date</span>
              </div>

              <div className="actions">
                <button type="button" onClick={onClose}>
                  Cancel
                </button>
                <button className="primary" type="submit">
                  Add
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
