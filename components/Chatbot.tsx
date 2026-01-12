'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaComments, FaTimes, FaPaperPlane } from 'react-icons/fa'

interface Message {
  text: string
  isUser: boolean
  timestamp: Date
}

const knowledgeBase = {
  greetings: ['hi', 'hello', 'hey', 'good morning', 'good evening'],
  diet: {
    vegetarian: {
      breakfast: 'Idli (3) + Sambar + Coconut Chutney - Protein: 12g, Carbs: 45g, Fats: 8g, Calories: 290',
      lunch: 'Brown Rice (1 cup) + Dal Tadka + Mixed Veg Curry + Curd - Protein: 18g, Carbs: 65g, Fats: 12g, Calories: 425',
      dinner: 'Chapati (2) + Paneer Bhurji + Salad - Protein: 22g, Carbs: 50g, Fats: 15g, Calories: 410',
      snacks: 'Sprouts Chaat / Roasted Chana / Fruit - Protein: 8g, Carbs: 25g, Fats: 3g, Calories: 150'
    },
    nonVeg: {
      breakfast: 'Egg Bhurji (2 eggs) + Brown Bread (2 slices) - Protein: 18g, Carbs: 35g, Fats: 12g, Calories: 320',
      lunch: 'Chicken Curry + Brown Rice + Salad - Protein: 35g, Carbs: 55g, Fats: 14g, Calories: 480',
      dinner: 'Fish Tikka + Roti (2) + Dal - Protein: 32g, Carbs: 48g, Fats: 10g, Calories: 410',
      snacks: 'Boiled Eggs (2) / Grilled Chicken - Protein: 15g, Carbs: 5g, Fats: 8g, Calories: 150'
    }
  },
  exercises: {
    'hand raises': 'Keep arms straight, raise to shoulder height, hold for 1-2 seconds. Repeat 15-20 times.',
    'sit-ups': 'Lie on back, knees bent, hands behind head. Lift upper body using core muscles. Repeat 15-25 times.',
    warmup: 'Start with 5-10 minutes of light cardio and dynamic stretching before workout.',
    cooldown: 'End with 5-10 minutes of static stretching to improve flexibility.'
  },
  macros: {
    protein: 'Aim for 1.6-2.2g per kg bodyweight for muscle building, 1.2-1.6g for maintenance.',
    carbs: 'Complex carbs: 3-5g per kg bodyweight. Adjust based on activity level.',
    fats: 'Healthy fats: 0.8-1g per kg bodyweight. Focus on omega-3, nuts, and olive oil.',
    calories: 'Maintenance: bodyweight (kg) × 30-35. Deficit: -300-500 cal. Surplus: +300-500 cal.'
  }
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! I\'m your 24/7 fitness assistant. Ask me about diet plans, macros, or exercises!', isUser: false, timestamp: new Date() }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (knowledgeBase.greetings.some(g => input.includes(g))) {
      return 'Hello! How can I help you with your fitness journey today?'
    }

    if (input.includes('veg') && input.includes('diet')) {
      const veg = knowledgeBase.diet.vegetarian
      return `**Vegetarian Indian Diet Plan:**\n\n🌅 **Breakfast:** ${veg.breakfast}\n\n🍱 **Lunch:** ${veg.lunch}\n\n🌙 **Dinner:** ${veg.dinner}\n\n🥗 **Snacks:** ${veg.snacks}`
    }

    if (input.includes('non') && input.includes('veg')) {
      const nonVeg = knowledgeBase.diet.nonVeg
      return `**Non-Vegetarian Indian Diet Plan:**\n\n🌅 **Breakfast:** ${nonVeg.breakfast}\n\n🍱 **Lunch:** ${nonVeg.lunch}\n\n🌙 **Dinner:** ${nonVeg.dinner}\n\n🥗 **Snacks:** ${nonVeg.snacks}`
    }

    if (input.includes('protein')) {
      return `**Protein Requirements:**\n${knowledgeBase.macros.protein}\n\n**Best Sources:** Paneer, Dal, Eggs, Chicken, Fish, Greek Yogurt, Protein Powder`
    }

    if (input.includes('carb')) {
      return `**Carbohydrate Requirements:**\n${knowledgeBase.macros.carbs}\n\n**Best Sources:** Brown Rice, Oats, Sweet Potato, Quinoa, Whole Wheat Roti`
    }

    if (input.includes('fat')) {
      return `**Healthy Fats Requirements:**\n${knowledgeBase.macros.fats}\n\n**Best Sources:** Almonds, Walnuts, Ghee, Olive Oil, Avocado, Flaxseeds`
    }

    if (input.includes('calorie')) {
      return `**Calorie Calculation:**\n${knowledgeBase.macros.calories}\n\nFor accurate calculation, provide your weight, height, age, and activity level.`
    }

    if (input.includes('hand raise')) {
      return `**Hand Raises Guide:**\n${knowledgeBase.exercises['hand raises']}\n\n💡 **Tip:** Keep core engaged and avoid swinging. Our AI posture detector will give you real-time feedback!`
    }

    if (input.includes('sit') || input.includes('situp')) {
      return `**Sit-ups Guide:**\n${knowledgeBase.exercises['sit-ups']}\n\n💡 **Tip:** Don't pull on your neck. Focus on using your core muscles. Use our posture detector for form check!`
    }

    if (input.includes('workout') || input.includes('exercise')) {
      return `**Available Exercises:**\n\n1. Hand Raises - Upper body strength\n2. Sit-ups - Core strengthening\n\nBoth exercises have AI posture detection! Navigate to the Workout section to start.`
    }

    if (input.includes('macro')) {
      return `**Macronutrient Guide:**\n\n🥩 **Protein:** ${knowledgeBase.macros.protein}\n\n🍚 **Carbs:** ${knowledgeBase.macros.carbs}\n\n🥑 **Fats:** ${knowledgeBase.macros.fats}\n\nAsk about specific macros for detailed info!`
    }

    if (input.includes('weight loss') || input.includes('lose weight')) {
      return `**Weight Loss Tips:**\n\n1. Caloric deficit of 300-500 calories\n2. High protein intake (preserves muscle)\n3. Regular cardio + strength training\n4. Stay hydrated (3-4L water daily)\n5. Sleep 7-8 hours\n\nConsult our diet plans for meal suggestions!`
    }

    if (input.includes('muscle') || input.includes('gain')) {
      return `**Muscle Building Tips:**\n\n1. Caloric surplus of 300-500 calories\n2. Protein: 1.8-2.2g per kg bodyweight\n3. Progressive overload in workouts\n4. Recovery: 48-72 hours per muscle group\n5. Consistency is key!\n\nCheck our diet plans for high-protein meals!`
    }

    return `I can help you with:\n\n📋 **Diet Plans** - Vegetarian/Non-veg Indian meals\n💪 **Exercise Guides** - Hand raises, Sit-ups\n📊 **Macros** - Protein, Carbs, Fats, Calories\n🎯 **Fitness Goals** - Weight loss, Muscle gain\n\nWhat would you like to know?`
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      text: input,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      const botResponse: Message = {
        text: getBotResponse(input),
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 500)

    setInput('')
  }

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all z-50"
          >
            <FaComments size={28} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg">FitBot Assistant</h3>
                <p className="text-blue-100 text-xs">24/7 Online</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    <p className={`text-xs mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about diet, macros, exercises..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleSend}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
