import { GoogleGenerativeAI } from "@google/generative-ai";
import foodModel from "../models/foodModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// ✅ Initialize Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ========================= 🧠 AI Chatbot =========================
const aiChat = async (req, res) => {
    try {
      const { message, conversationHistory } = req.body;
  
      if (!message) {
        return res.status(400).json({
          success: false,
          message: "Message is required",
        });
      }
  
      // Fetch all food items to include in context
      const foodList = await foodModel.find({});
  
      const restaurantContext = `You are a friendly AI assistant for "Shree Kitchen", an Indian food delivery restaurant. 
  
  IMPORTANT INSTRUCTIONS:
  - Be warm, friendly, and helpful
  - Use emojis occasionally to be friendly
  - Keep responses concise (2–3 sentences for simple queries)
  - Always suggest ordering through the website
  - If asked about prices, menu, or specific dishes, use the EXACT information from the menu below
  
  MENU ITEMS:
  ${foodList.map(item => `- ${item.name} (${item.category}): ₹${item.price} - ${item.description || 'Delicious item'}`).join('\n')}
  
  CAPABILITIES:
  - Answer questions about menu items, prices, categories
  - Provide food recommendations based on user preferences
  - Explain dishes and ingredients
  - Help with dietary requirements (veg/non-veg/spicy)
  - Assist with order-related queries
  - Give information about delivery and ordering process
  
  CONVERSATION HISTORY:
  ${conversationHistory ? conversationHistory.map(msg => `${msg.role}: ${msg.text}`).join('\n') : 'This is the start of the conversation.'}
  
  USER QUERY: ${message}
  
  Respond naturally and helpfully. If asked about specific items, mention their exact prices and descriptions from the menu.`;
  
      // ✅ Correct API format
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: restaurantContext }] }],
      });
  
      const aiResponse = result.response.text();
  
      res.json({
        success: true,
        message: aiResponse,
      });
  
    } catch (error) {
      console.error("AI Chat Error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
  

// ========================= 🍽️ AI Recommendations =========================
const aiRecommendations = async (req, res) => {
    try {
        const userId = req.body.userId;

        const userOrders = await orderModel.find({ userId }).sort({ date: -1 }).limit(10);
        const allFoods = await foodModel.find({});

        if (userOrders.length === 0) {
            // New user → return popular items
            return res.json({
                success: true,
                recommendations: allFoods.slice(0, 6),
                reason: "popular"
            });
        }

        // Extract ordered items + frequencies
        const orderedItems = {};
        const orderedCategories = {};
        let totalSpent = 0;

        userOrders.forEach(order => {
            order.items.forEach(item => {
                orderedItems[item.name] = (orderedItems[item.name] || 0) + 1;
            });
            totalSpent += order.amount;
        });

        const avgOrderValue = totalSpent / userOrders.length;

        // Determine favorite category
        for (const itemName in orderedItems) {
            const food = allFoods.find(f => f.name === itemName);
            if (food) {
                orderedCategories[food.category] = (orderedCategories[food.category] || 0) + 1;
            }
        }

        const favoriteCategory = Object.keys(orderedCategories).reduce((a, b) =>
            orderedCategories[a] > orderedCategories[b] ? a : b
        );

        // ✅ Correct model name
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are a food recommendation AI for Shree Kitchen restaurant.

USER PROFILE:
- Total orders: ${userOrders.length}
- Favorite category: ${favoriteCategory}
- Average order value: ₹${avgOrderValue.toFixed(0)}
- Previously ordered items: ${Object.keys(orderedItems).join(', ')}

AVAILABLE MENU:
${allFoods.map(item => `${item.name} (${item.category}) - ₹${item.price}`).join('\n')}

TASK: Recommend 6 items the user would most likely enjoy based on their order history. 
- Don't repeat items they've already ordered frequently
- Suggest items from their favorite category: ${favoriteCategory}
- Include some variety from other categories
- Consider their spending pattern (₹${avgOrderValue.toFixed(0)} average)

Return ONLY a JSON array of item names in this exact format:
["item1", "item2", "item3", "item4", "item5", "item6"]
`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        // Parse AI response for recommendations
        let recommendedNames = [];
        try {
            const jsonMatch = aiResponse.match(/\[.*?\]/s);
            if (jsonMatch) recommendedNames = JSON.parse(jsonMatch[0]);
        } catch (parseError) {
            console.log("Error parsing AI response, using fallback");
        }

        let recommendations = [];
        if (recommendedNames.length > 0) {
            recommendations = allFoods.filter(food =>
                recommendedNames.includes(food.name)
            );
        }

        // Fallback if not enough
        if (recommendations.length < 6) {
            const categoryItems = allFoods.filter(food =>
                food.category === favoriteCategory &&
                !orderedItems[food.name] &&
                !recommendations.find(r => r.name === food.name)
            );
            recommendations = [...recommendations, ...categoryItems].slice(0, 6);
        }

        res.json({
            success: true,
            recommendations,
            reason: "personalized",
            insights: {
                favoriteCategory,
                totalOrders: userOrders.length,
                avgOrderValue: avgOrderValue.toFixed(0)
            }
        });

    } catch (error) {
        console.log("AI Recommendations Error:", error);
        const fallbackFoods = await foodModel.find({}).limit(6);
        res.json({
            success: true,
            recommendations: fallbackFoods,
            reason: "fallback"
        });
    }
};

// ========================= 🔍 AI Smart Search =========================
const aiSearch = async (req, res) => {
    try {
        const { query } = req.body;
        const allFoods = await foodModel.find({});

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
You are a smart search assistant for Shree Kitchen restaurant.

AVAILABLE MENU:
${allFoods.map(item => `${item.name} (${item.category}) - ₹${item.price} - ${item.description || ''}`).join('\n')}

USER SEARCH QUERY: "${query}"

TASK: Based on the user's natural language query, find the most relevant menu items.
Consider:
- Direct name matches
- Category matches
- Price range if mentioned
- Dietary preferences (veg/non-veg/spicy)
- Taste preferences (spicy, sweet, mild)
- Meal type (breakfast, lunch, dinner, snack)

Return ONLY a JSON array of item names that match, ordered by relevance:
["most_relevant_item", "second_item", "third_item", ...]
`;

        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();

        let searchResults = [];
        try {
            const jsonMatch = aiResponse.match(/\[.*?\]/s);
            if (jsonMatch) {
                const itemNames = JSON.parse(jsonMatch[0]);
                searchResults = allFoods.filter(food =>
                    itemNames.includes(food.name)
                );
            }
        } catch (parseError) {
            // Basic fallback search
            searchResults = allFoods.filter(food =>
                food.name.toLowerCase().includes(query.toLowerCase()) ||
                food.category.toLowerCase().includes(query.toLowerCase())
            );
        }

        res.json({
            success: true,
            results: searchResults
        });

    } catch (error) {
        console.log("AI Search Error:", error);
        res.json({
            success: false,
            results: []
        });
    }
};

export { aiChat, aiRecommendations, aiSearch };
