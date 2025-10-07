import React, { useState, useEffect, useContext } from 'react';
import './AIRecommendations.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const AIRecommendations = () => {
  const { token, url, addToCart } = useContext(StoreContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [recommendationType, setRecommendationType] = useState('');

  useEffect(() => {
    // Check if recommendations are already cached in sessionStorage
    const cachedData = sessionStorage.getItem('aiRecommendations');
    const cacheTimestamp = sessionStorage.getItem('aiRecommendationsTime');
    const cacheExpiry = 30 * 60 * 1000; // 30 minutes
    
    if (cachedData && cacheTimestamp) {
      const age = Date.now() - parseInt(cacheTimestamp);
      if (age < cacheExpiry) {
        // Use cached data
        const cached = JSON.parse(cachedData);
        setRecommendations(cached.recommendations);
        setRecommendationType(cached.recommendationType);
        setInsights(cached.insights);
        setLoading(false);
        return;
      }
    }
    
    // Fetch new recommendations if no valid cache
    fetchAIRecommendations();
  }, [token]);

  const fetchAIRecommendations = async () => {
    setLoading(true);
    try {
      if (token) {
        // Get AI-powered personalized recommendations
        const response = await axios.post(
          `${url}/api/ai/recommendations`,
          {},
          { headers: { token } }
        );

        if (response.data.success) {
          const data = {
            recommendations: response.data.recommendations,
            recommendationType: response.data.reason,
            insights: response.data.insights
          };
          
          setRecommendations(data.recommendations);
          setRecommendationType(data.recommendationType);
          setInsights(data.insights);
          
          // Cache the recommendations
          sessionStorage.setItem('aiRecommendations', JSON.stringify(data));
          sessionStorage.setItem('aiRecommendationsTime', Date.now().toString());
        }
      } else {
        // For non-logged users, get popular items
        const response = await axios.get(`${url}/api/food/list`);
        if (response.data.success) {
          // Get diverse selection
          const foods = response.data.data;
          const categories = [...new Set(foods.map(f => f.category))];
          const diverse = [];
          
          categories.forEach(cat => {
            const catItems = foods.filter(f => f.category === cat);
            if (catItems.length > 0) {
              diverse.push(catItems[Math.floor(Math.random() * catItems.length)]);
            }
          });
          
          const data = {
            recommendations: diverse.slice(0, 6),
            recommendationType: 'popular',
            insights: null
          };
          
          setRecommendations(data.recommendations);
          setRecommendationType(data.recommendationType);
          
          // Cache the recommendations
          sessionStorage.setItem('aiRecommendations', JSON.stringify(data));
          sessionStorage.setItem('aiRecommendationsTime', Date.now().toString());
        }
      }
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationReason = (item) => {
    if (recommendationType === 'personalized' && insights) {
      if (item.category === insights.favoriteCategory) {
        return `You love ${insights.favoriteCategory}! ❤️`;
      }
      return `AI picked this for you ✨`;
    }
    return "Popular choice 🌟";
  };

  const handleAddToCart = (itemId) => {
    addToCart(itemId);
    // Show success feedback
    const button = document.querySelector(`[data-item-id="${itemId}"]`);
    if (button) {
      button.textContent = "Added! ✓";
      button.style.background = "#10b981";
      setTimeout(() => {
        button.innerHTML = '<span>Add to Cart</span><span class="btn-icon">+</span>';
        button.style.background = "";
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="ai-recommendations">
        <div className="recommendations-header">
          <h2>
            Analyzing your preferences...
          </h2>
        </div>
        <div className="loading-skeleton">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="skeleton-card"></div>
          ))}
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="ai-recommendations">
      <div className="recommendations-header">
        <div className="header-content">
          <h2>
            {token && recommendationType === 'personalized' 
              ? "Recommendations For You" 
              : "Popular Dishes"}
          </h2>
          <p>
            {token && recommendationType === 'personalized'
              ? "Personalized based on your order history"
              : "Curated selection from our menu"}
          </p>
        </div>
        {token && recommendationType === 'personalized' && (
          <div className="recommendation-badge">
            <span className="badge-icon">⚡</span>
            
          </div>
        )}
      </div>

      {/* User Insights */}
      {insights && recommendationType === 'personalized' && (
        <div className="ai-insights">
          <h3>🎯 Your Preferences</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <span className="insight-icon">❤️</span>
              <div>
                <div className="insight-label">Favorite Category</div>
                <div className="insight-value">{insights.favoriteCategory}</div>
              </div>
            </div>
            <div className="insight-card">
              <span className="insight-icon">📦</span>
              <div>
                <div className="insight-label">Total Orders</div>
                <div className="insight-value">{insights.totalOrders}</div>
              </div>
            </div>
            <div className="insight-card">
              <span className="insight-icon">💵</span>
              <div>
                <div className="insight-label">Avg Order Value</div>
                <div className="insight-value">₹{insights.avgOrderValue}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="recommendations-grid">
        {recommendations.map((item, index) => (
          <div 
            key={item._id} 
            className="recommendation-card" 
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="card-image">
              <img src={url + "/images/" + item.image} alt={item.name} />
              <div className="card-badge">
                {getRecommendationReason(item)}
              </div>
            </div>
            
            <div className="card-content">
              <h3>{item.name}</h3>
              <p className="card-category">{item.category}</p>
              <p className="card-description">{item.description}</p>
              
              <div className="card-footer">
                <div className="card-price">
                  <span className="price-label">Price:</span>
                  <span className="price-value">₹{item.price}</span>
                </div>
                <button 
                  className="add-btn"
                  data-item-id={item._id}
                  onClick={() => handleAddToCart(item._id)}
                >
                  <span>Add to Cart</span>
                  <span className="btn-icon">+</span>
                </button>
              </div>
            </div>

            <div className="card-glow"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;