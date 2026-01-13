import API_BASE from "./api";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

import MonthSidebar from "./components/MonthSidebar";
import AddExpenseModal from "./components/AddExpenseModal";
import CategoryPie from "./components/CategoryPie";

import "./App.css";

/* ---------------- HELPERS ---------------- */
const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const quotes = [
  "Track it or lose it 💀",
  "Money leaks silently.",
  "Your future self is watching 👀",
  "Small spends add up fast.",
  "Discipline beats motivation.",
];

const getRandomQuote = () =>
  quotes[Math.floor(Math.random() * quotes.length)];

/* ---------------- APP ---------------- */
function App() {
  /* ---------- STATE ---------- */
  const [allExpenses, setAllExpenses] = useState([]);
  const [dateAsc, setDateAsc] = useState(false); // false = newest first

  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const [total, setTotal] = useState(0);
  const [summary, setSummary] = useState({});

  const [categories, setCategories] = useState(["All"]);
  const [category, setCategory] = useState("All");

  const [sortType, setSortType] = useState("order_desc"); // default newest

  const [openAdd, setOpenAdd] = useState(false);

    /* ---------- REFRESH EXPENSES (USED AFTER ADD) ---------- */
  const refreshExpenses = async () => {
    if (!selectedMonth) return;

    let url = `${API_BASE}/expenses/?month=${selectedMonth}`;
    if (sortType.includes("amount")) {
      url += `&sort=${sortType}`;
    }


    try {
      const res = await fetch(url);
      const data = await res.json();

      setAllExpenses(data.expenses || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Refresh expenses failed:", err);
    }
  };


  /* ---------- ANIMATED TOTAL ---------- */
  const animatedTotal = useMotionValue(0);
  const [displayTotal, setDisplayTotal] = useState(0);

  useEffect(() => {
    const unsub = animatedTotal.on("change", (v) =>
      setDisplayTotal(Math.round(v))
    );
    return unsub;
  }, [animatedTotal]);

  useEffect(() => {
    animatedTotal.set(total);
  }, [total, animatedTotal]);

  /* ---------- FETCH MONTHS ---------- */
  useEffect(() => {
    fetch(`${API_BASE}/expenses/months/`)
      .then((res) => res.json())
      .then((data) => setMonths(Array.isArray(data) ? data : []))
      .catch(() => setMonths([]));
  }, []);

  /* ---------- FETCH EXPENSES ---------- */
  useEffect(() => {
    if (!selectedMonth) return;

  let url = `${API_BASE}/expenses/?month=${selectedMonth}`;
  if (sortType.includes("amount")) {
    url += `&sort=${sortType}`;
}


    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAllExpenses(data.expenses || []);
        setTotal(data.total || 0);
      })
      .catch(() => {
        setAllExpenses([]);
        setTotal(0);
      });
  }, [selectedMonth, sortType]);


  /* ---------- DERIVE CATEGORIES ---------- */
  useEffect(() => {
    const unique = new Set(allExpenses.map((e) => e.category));
    unique.add("General");
    setCategories(["All", ...Array.from(unique)]);
  }, [allExpenses]);

  /* ---------- FILTERED EXPENSES ---------- */
  const filteredExpenses =
    category === "All"
      ? allExpenses
      : allExpenses.filter((e) => e.category === category);

  /* ---------- FETCH PIE SUMMARY ---------- */
  useEffect(() => {
    if (!selectedMonth) return;

    fetch(`${API_BASE}/expenses/summary/?month=${selectedMonth}`)
      .then((res) => res.json())
      .then(setSummary)
      .catch(() => setSummary({}));
  }, [selectedMonth]);

  /* ---------- DELETE ---------- */
  const deleteExpense = async (id) => {
    try {
      const exp = allExpenses.find((e) => e.id === id);
      if (!exp) return;

      const res = await fetch(`${API_BASE}/expenses/${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Delete failed");

      setAllExpenses((prev) => prev.filter((e) => e.id !== id));
      setTotal((prev) => prev - Number(exp.amount));
    } catch (err) {
      console.error(err);
    }
  };

// ---- SORT EXPENSES BY DATE ----
const sortedExpenses = [...filteredExpenses].sort((a, b) => {
  if (dateAsc) {
    return new Date(a.date) - new Date(b.date);
  }
  return new Date(b.date) - new Date(a.date);
});

// ---- GROUP AFTER SORTING ----
const grouped = {};
sortedExpenses.forEach((e) => {
  if (!grouped[e.date]) grouped[e.date] = [];
  grouped[e.date].push(e);
});


  /* ---------- UI ---------- */
  return (
    <div className="app">
      <div className="ambient">
        <div className="orb left" />
        <div className="orb right" />
      </div>

      <div className="ghost-panel">
        <div className="ghost-card" />
        <div className="ghost-card tall" />
        <div className="ghost-card" />
      </div>

      {/* ADD BUTTON */}
      {selectedMonth && allExpenses.length > 0 && (
        <motion.button
          className="add-expense-btn"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setOpenAdd(true)}
        >
          <span className="plus">＋</span>
          Add expense
        </motion.button>
      )}


      <h1>
        <span className="ll-mark">LL</span> LedgerLoop
      </h1>

      <p className="subtitle">Smart expense tracking & insights</p>

      {/* QUICK STATS */}
      {selectedMonth && (
        <motion.div className="quick-stats">
          <div>📅 {selectedMonth}</div>
          <div>🧾 {allExpenses.length} expenses</div>
          <div>
            💰 Avg: ₹{" "}
            {allExpenses.length
              ? Math.round(total / allExpenses.length)
              : 0}
          </div>
        </motion.div>
      )}

      <motion.div className="layout">
        <MonthSidebar
          data={months}
          selected={selectedMonth}
          onSelect={setSelectedMonth}
        />

        <div className="content">
          <AnimatePresence mode="wait">
            {!selectedMonth && (
              <motion.div
                className="empty-hero"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="empty-icon">💸</div>
                <h2>Welcome to LedgerLoop</h2>
                <p>{getRandomQuote()}</p>
                <p className="muted">
                  Start tracking your expenses to save the future you.
                </p>

                <motion.button
                  className="empty-cta"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setOpenAdd(true)}
                >
                  + Add your expense
                </motion.button>
              </motion.div>
            )}


            {selectedMonth && (
              <motion.div key={selectedMonth}>
                {/* EMPTY MONTH */}
                {allExpenses.length === 0 && (
                  <motion.div
                    className="empty-hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="empty-icon">💸</div>
                    <h2>No expenses yet</h2>
                    <p>Start tracking your money like a grown adult 😤</p>

                    <motion.button
                      className="empty-cta"
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setOpenAdd(true)}
                    >
                      + Add your first expense
                    </motion.button>
                  </motion.div>
                )}


                {/* CONTROLS + FILTERS ALWAYS VISIBLE IF MONTH HAS DATA */}
                {allExpenses.length > 0 && (
                  <>
                    <div className="controls">
                      <motion.div className="total">
                        ₹ <motion.span>{displayTotal}</motion.span>
                      </motion.div>

                      <div style={{ display: "flex", gap: "10px" }}>
                       {/* DATE SORT */}
                      <motion.button
                        className="sort-pill"
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ y: -1 }}
                        onClick={() => setDateAsc((p) => !p)}
                      >
                        {dateAsc ? "📅 Oldest" : "📅 Newest"}
                      </motion.button>

                        {/* AMOUNT TOGGLE */}
                        <button
                          className={
                            sortType.includes("amount")
                              ? "filter active"
                              : "filter"
                          }
                          onClick={() =>
                            setSortType((prev) =>
                              prev === "amount_desc" ? "amount_asc" : "amount_desc"
                            )
                          }
                        >
                          {sortType === "amount_desc" ? "💸 High → Low" : "💰 Low → High"}
                        </button>
                      </div>
                    </div>


                    <div className="filters">
                      {categories.map((c) => (
                        <button
                          key={c}
                          className={
                            category === c ? "filter active" : "filter"
                          }
                          onClick={() => setCategory(c)}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {/* EMPTY CATEGORY */}
                {allExpenses.length > 0 && filteredExpenses.length === 0 && (
                  <motion.div className="empty-hero">
                    <div className="empty-icon">📭</div>
                    <h2>No expenses here</h2>
                    <p>
                      Nothing under <strong>{category}</strong> this month.
                    </p>
                    <p className="muted">
                      Try another category or clear the filter.
                    </p>
                  </motion.div>
                )}

                {/* LIST */}
                {filteredExpenses.length > 0 && (
                  <div className="split">
                    <div className="list">
                      {Object.entries(grouped).map(([date, items]) => (
                        <div key={date}>
                          <h4 className="date-header">
                            {formatDate(date)}
                          </h4>

                          {items.map((e) => (
                            <div key={e.id} className="card">
                              <div>
                                <h4>{e.description}</h4>
                                <span>{e.category}</span>
                              </div>

                              <div className="card-actions">
                                <strong>₹ {e.amount}</strong>
                                <button
                                  onClick={() => deleteExpense(e.id)}
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    <div className="pie-wrapper">
                      <CategoryPie
                        data={summary}
                        onSelectCategory={(cat) =>
                          setCategory(cat)
                        }
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AddExpenseModal
        open={openAdd}
        categories={["General", ...categories.filter(c => c !== "General")]}
        onClose={() => setOpenAdd(false)}
        onAdded={(expense) => {
          if (!expense) {
            refreshExpenses();
            return;
          }

          setAllExpenses((prev) => [expense, ...prev]);
          setTotal((prev) => prev + Number(expense.amount));
        }}


      />

    </div>
  );
}

export default App;
