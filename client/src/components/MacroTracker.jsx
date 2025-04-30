import React, { useState, useEffect } from 'react';
import '../MacroTracker.css';
import { supabase } from '../supabase';
import Sidebar from './Sidebar';
import MacroRingChart from './MacroRingChart';

const mealTabs = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Water'];

function MacroTracker() {
  const [activeTab, setActiveTab] = useState('Breakfast');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [log, setLog] = useState({
    Breakfast: [],
    Lunch: [],
    Dinner: [],
    Snacks: [],
    Water: [],
  });
  const [totals, setTotals] = useState({ calories: 0, protein: 0, fat: 0, carbs: 0 });
  const [waterIntake, setWaterIntake] = useState(0);

  // 🔁 Reusable fetch to get meals from Supabase
  const fetchDailyMeals = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;
    const todayStr = new Date().toISOString().split('T')[0];

    const { data } = await supabase
      .from('daily_meals')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', todayStr);

    if (data) {
      const newLog = { Breakfast: [], Lunch: [], Dinner: [], Snacks: [], Water: [] };
      let cal = 0, pro = 0, fat = 0, carb = 0, waterTotal = 0;
      data.forEach((item) => {
        newLog[item.meal_type].push(item);
        if (item.meal_type === 'Water') {
          waterTotal += Number(item.quantity);
        } else {
          cal += Number(item.calories);
          pro += Number(item.protein);
          fat += Number(item.fat);
          carb += Number(item.carbs);
        }
      });
      setLog(newLog);
      setTotals({ calories: cal, protein: pro, fat: fat, carbs: carb });
      setWaterIntake(waterTotal);
    }
  };

  // 🔄 Fetch on mount
  useEffect(() => {
    fetchDailyMeals();
  }, []);

  // 🕛 Reset everything at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);

    const timeout = setTimeout(() => {
      setTotals({ calories: 0, protein: 0, fat: 0, carbs: 0 });
      setLog({ Breakfast: [], Lunch: [], Dinner: [], Snacks: [], Water: [] });
      setWaterIntake(0);
    }, tomorrow - now);

    return () => clearTimeout(timeout);
  }, []);

  const searchFoods = async (term) => {
    const res = await fetch(
      `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${term}&search_simple=1&action=process&json=1`
    );
    const data = await res.json();
    setResults(
      data.products
        .filter((p) => p.product_name)
        .slice(0, 10)
        .map((p) => ({
          name: p.product_name,
          calories: p.nutriments?.['energy-kcal_100g'] || 0,
          protein: p.nutriments?.proteins_100g || 0,
          fat: p.nutriments?.fat_100g || 0,
          carbs: p.nutriments?.carbohydrates_100g || 0,
        }))
    );
  };

  const addToLog = async (food) => {
    const servingsStr = window.prompt("How many servings did you have?", "1");
    const servings = parseFloat(servingsStr) || 1;

    const adjustedFood = {
      name: food.name,
      calories: food.calories * servings,
      protein: food.protein * servings,
      fat: food.fat * servings,
      carbs: food.carbs * servings,
    };

    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;

    const todayStr = new Date().toISOString().split('T')[0];

    await supabase.from('daily_meals').insert({
      user_id: user.id,
      date: todayStr,
      meal_type: activeTab,
      name: adjustedFood.name,
      calories: adjustedFood.calories,
      protein: adjustedFood.protein,
      fat: adjustedFood.fat,
      carbs: adjustedFood.carbs
    });

    await fetchDailyMeals(); // Refresh data
    setResults([]);
    setSearch('');
  };

  const incrementWater = async () => {
    const { data: auth } = await supabase.auth.getUser();
    const user = auth?.user;
    if (!user) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const increment = 8;
    const newAmount = waterIntake + increment;

    await supabase.from('daily_meals').insert({
      user_id: user.id,
      date: todayStr,
      meal_type: 'Water',
      name: 'Water',
      quantity: increment,
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0,
    });

    setWaterIntake(newAmount);
  };

  return (
    <div className="macro-tracker-page" style={{ display: 'flex' }}>
      <Sidebar />

      <div style={{ marginLeft: '14rem', display: 'flex', width: '100%', padding: '2rem' }}>
        {/* Left Side */}
        <div style={{ flex: 2, marginRight: '2rem' }}>
          <h2 style={{ color: '#0ef' }}>Macro Tracker</h2>

          <div className="macro-tabs">
            {mealTabs.map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? 'active' : ''}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="macro-search">
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.length > 2) searchFoods(e.target.value);
              }}
              placeholder="Search for food..."
            />
            {results.length > 0 && (
              <ul className="search-results">
                {results.map((item, i) => (
                  <li key={i} onClick={() => addToLog(item)}>
                    {item.name} — {item.calories} kcal/100g
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Food log */}
          {activeTab !== 'Water' && (
            <div className="macro-log">
              <h4>{activeTab} Items</h4>
              <ul>
                {log[activeTab].map((f, i) => (
                  <li key={i}>
                    {f.name} – {f.calories.toFixed(0)} kcal
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Water intake UI */}
          {activeTab === 'Water' && (
            <div className="macro-log">
              <h4>Water Intake</h4>
              <p>You have consumed {waterIntake} oz of water today.</p>
              <div className="water-cup">
                <div
                  className="cup-fill"
                  style={{ height: `${Math.min((waterIntake / 64) * 100, 100)}%` }}
                ></div>
              </div>
              <button className="btn water-btn" onClick={incrementWater}>
                Add 8 oz
              </button>
            </div>
          )}

          <div className="macro-summary">
            <h4>Today's Macros</h4>
            <p>🔥 Calories: {totals.calories.toFixed(0)} kcal</p>
            <p>🍗 Protein: {totals.protein.toFixed(1)} g</p>
            <p>🥑 Fat: {totals.fat.toFixed(1)} g</p>
            <p>🍞 Carbs: {totals.carbs.toFixed(1)} g</p>
          </div>
        </div>

        {/* Right Side: Ring Chart */}
        <div style={{ flex: 1 }}>
          <MacroRingChart totals={totals} />
        </div>
      </div>
    </div>
  );
}

export default MacroTracker;
