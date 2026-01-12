'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaArrowLeft, FaLeaf, FaDrumstickBite } from 'react-icons/fa'

type DietType = 'veg' | 'nonveg'

const dietPlans = {
  veg: {
    breakfast: {
      name: 'Idli with Sambar & Chutney',
      items: ['3 Idlis', '1 bowl Sambar', '2 tbsp Coconut Chutney'],
      protein: 12,
      carbs: 45,
      fats: 8,
      calories: 290
    },
    midMorning: {
      name: 'Fruit & Nuts',
      items: ['1 Banana', '10 Almonds', '1 glass Buttermilk'],
      protein: 6,
      carbs: 28,
      fats: 8,
      calories: 190
    },
    lunch: {
      name: 'Complete Thali',
      items: ['1 cup Brown Rice', '1 bowl Dal Tadka', '1 bowl Mixed Veg', '2 Chapati', '1 bowl Curd', 'Salad'],
      protein: 18,
      carbs: 65,
      fats: 12,
      calories: 425
    },
    evening: {
      name: 'Healthy Snack',
      items: ['Sprouts Chaat', 'Green Tea'],
      protein: 8,
      carbs: 22,
      fats: 3,
      calories: 140
    },
    dinner: {
      name: 'Light Dinner',
      items: ['2 Chapati', '1 bowl Paneer Bhurji', '1 bowl Dal', 'Salad'],
      protein: 22,
      carbs: 50,
      fats: 15,
      calories: 410
    }
  },
  nonveg: {
    breakfast: {
      name: 'Egg Bhurji with Bread',
      items: ['2 Egg Bhurji', '2 Brown Bread slices', '1 glass Milk'],
      protein: 18,
      carbs: 35,
      fats: 12,
      calories: 320
    },
    midMorning: {
      name: 'Protein Shake',
      items: ['1 Banana', '1 scoop Whey Protein', '10 Almonds'],
      protein: 28,
      carbs: 32,
      fats: 10,
      calories: 320
    },
    lunch: {
      name: 'Chicken Rice Bowl',
      items: ['1 cup Brown Rice', 'Chicken Curry (150g)', 'Mixed Veg', 'Salad', '1 bowl Curd'],
      protein: 35,
      carbs: 55,
      fats: 14,
      calories: 480
    },
    evening: {
      name: 'Boiled Eggs',
      items: ['2 Boiled Eggs', 'Green Tea', 'Roasted Chana'],
      protein: 15,
      carbs: 12,
      fats: 8,
      calories: 170
    },
    dinner: {
      name: 'Fish Tikka Meal',
      items: ['Fish Tikka (150g)', '2 Roti', '1 bowl Dal', 'Salad'],
      protein: 32,
      carbs: 48,
      fats: 10,
      calories: 410
    }
  }
}

export default function DietPage() {
  const [selectedDiet, setSelectedDiet] = useState<DietType>('veg')

  const plan = dietPlans[selectedDiet]
  const totalMacros = {
    protein: Object.values(plan).reduce((sum, meal) => sum + meal.protein, 0),
    carbs: Object.values(plan).reduce((sum, meal) => sum + meal.carbs, 0),
    fats: Object.values(plan).reduce((sum, meal) => sum + meal.fats, 0),
    calories: Object.values(plan).reduce((sum, meal) => sum + meal.calories, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/dashboard">
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
              <FaArrowLeft /> Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold dark:text-white">Indian Diet Plans</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDiet('veg')}
            className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-xl font-semibold text-lg transition-all ${
              selectedDiet === 'veg'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FaLeaf size={24} />
            Vegetarian Plan
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDiet('nonveg')}
            className={`flex-1 flex items-center justify-center gap-3 p-6 rounded-xl font-semibold text-lg transition-all ${
              selectedDiet === 'nonveg'
                ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FaDrumstickBite size={24} />
            Non-Vegetarian Plan
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Protein</p>
            <p className="text-3xl font-bold text-blue-500">{totalMacros.protein}g</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Carbs</p>
            <p className="text-3xl font-bold text-orange-500">{totalMacros.carbs}g</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Fats</p>
            <p className="text-3xl font-bold text-purple-500">{totalMacros.fats}g</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Calories</p>
            <p className="text-3xl font-bold text-green-500">{totalMacros.calories}</p>
          </div>
        </div>

        <div className="space-y-6">
          {Object.entries(plan).map(([mealTime, meal], idx) => (
            <motion.div
              key={mealTime}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold dark:text-white mb-1">
                    {mealTime.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">{meal.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-500">{meal.calories}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">calories</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold mb-2 dark:text-white">Items:</h4>
                <ul className="space-y-1">
                  {meal.items.map((item, i) => (
                    <li key={i} className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Protein</p>
                  <p className="text-lg font-bold text-blue-500">{meal.protein}g</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Carbs</p>
                  <p className="text-lg font-bold text-orange-500">{meal.carbs}g</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Fats</p>
                  <p className="text-lg font-bold text-purple-500">{meal.fats}g</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4 dark:text-white">💡 Diet Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 dark:text-gray-300">
              <span className="text-blue-500">•</span>
              <span>Drink 3-4 liters of water daily for optimal hydration</span>
            </li>
            <li className="flex items-start gap-2 dark:text-gray-300">
              <span className="text-blue-500">•</span>
              <span>Adjust portions based on your activity level and fitness goals</span>
            </li>
            <li className="flex items-start gap-2 dark:text-gray-300">
              <span className="text-blue-500">•</span>
              <span>Include seasonal fruits and vegetables for variety</span>
            </li>
            <li className="flex items-start gap-2 dark:text-gray-300">
              <span className="text-blue-500">•</span>
              <span>Maintain consistent meal timings for better metabolism</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  )
}
