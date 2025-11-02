# Shree Kitchen

Shree Kitchen is a full-stack MERN food delivery web application designed to provide a seamless ordering experience for users and an intuitive management system for administrators. The project leverages modern technologies including React for the frontend, Node.js/Express for the backend, and MongoDB for the database. It is enhanced with AI-powered features using Google Gemini for a smarter user experience.

The application is structured as a monorepo containing three main parts: a customer-facing `frontend`, a `backend` server, and an `admin` panel for management.

## Features

### Customer-Facing App (Frontend)
- **Browse Menu**: Users can explore a diverse menu categorized for easy navigation.
- **User Authentication**: Secure user registration and login using JSON Web Tokens (JWT).
- **Shopping Cart**: Fully functional cart to add, remove, and view items.
- **Profile Management**: Users can view and update their personal information and delivery address.
- **Secure Payments**: Integrated with Stripe for secure and reliable payment processing.
- **Order History**: Users can view their past orders and track their status.
- **Dynamic Shipping**: Delivery fees are calculated dynamically based on the user's address.
- **AI Chatbot**: An interactive chatbot powered by Google Gemini to assist users with menu questions and general inquiries.
- **AI Recommendations**: Personalized food recommendations based on the user's order history.

### Admin Panel
- **Food Management**: Full CRUD (Create, Read, Update, Delete) functionality for food items in the menu.
- **Order Management**: A centralized dashboard to view all incoming customer orders.
- **Status Updates**: Admins can update the status of each order (e.g., "Food Processing," "Out for Delivery," "Delivered").

### Backend
- **RESTful API**: A robust API built with Express.js to handle all application logic.
- **Database**: MongoDB with Mongoose for data modeling and persistence.
- **Image Handling**: Multer is used for handling image uploads for food items.
- **AI Integration**: Connects with the Google Gemini API to power the chatbot and recommendation engine.

## Tech Stack

- **Frontend**: React, Vite, React Router, Axios, CSS
- **Admin Panel**: React, Vite, React Router, Axios, React Toastify, CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Bcrypt, Stripe, Multer, Google Generative AI (`@google/genai`)

### Deployed link:  
https://shree-kitchen-frontend-phjr.onrender.com/
