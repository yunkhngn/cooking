# Dinner AI — Product Brief

## Overview

**Dinner AI** is a lightweight AI-powered web application that helps users answer one simple question:

> **"What should we have for dinner tonight?"**

Users provide a few basic preferences, and the AI generates a complete dinner menu with estimated cost, cooking time, ingredients, cooking instructions, and shopping list.

The product focuses on **great food**, **practicality**, and **simplicity** rather than nutrition tracking.

---

# Vision

Create the fastest and easiest way to plan a delicious dinner.

The application should feel like talking to someone who knows how to cook, not like prompting an AI chatbot.

---

# Goals

- Generate delicious and realistic dinner menus.
- Stay within the user's budget.
- Minimize food waste by reusing ingredients across dishes.
- Keep recipes practical and easy to cook.
- Require zero learning curve.

---

# Non-Goals

This is **NOT**:

- a calorie tracking app
- a fitness meal planner
- a grocery management system
- a recipe database
- a chatbot

Calories and nutrition are **estimated only**.

---

# Target Audience

- Students
- Working professionals
- Couples
- Families
- Anyone who struggles to decide what to cook for dinner

---

# Core Principles

- Vietnamese-first experience
- No account required
- No login
- No backend
- No database
- No user data storage
- Stateless
- Single-page application
- Fast and minimal

---

# User Flow

Open website

↓

Fill in preferences

↓

Click **Generate Dinner**

↓

AI generates a complete dinner menu

↓

View recipes

↓

Go shopping and cook

---

# User Inputs

## Required

### Number of People

Examples

- 1
- 2
- 3
- 4
- 5+

---

### Budget

Examples

- 50,000 VND
- 100,000 VND
- 150,000 VND
- 200,000 VND
- Custom amount

---

### Cuisine

- Vietnamese
- Japanese
- Korean
- Chinese
- Thai
- Italian
- American
- Mixed

---

### Maximum Cooking Time

- 15 minutes
- 30 minutes
- 45 minutes
- 60+ minutes

---

## Optional

### Available Ingredients

Examples

- Eggs
- Chicken
- Beef
- Tomatoes
- Onion
- Broccoli

The AI should prioritize using these ingredients whenever possible.

---

### Ingredients to Avoid

Examples

- Seafood
- Mushrooms
- Cilantro
- Spicy food

---

### Dietary Preference

- Regular
- Healthy
- High Protein
- Vegetarian
- Low Carb

---

### Dining Occasion

Examples

- Family Dinner
- Date Night
- Weekend Dinner
- Friends Gathering
- Comfort Food

---

# AI Responsibilities

The AI should not simply generate random dishes.

It should optimize the menu using the following priority:

1. Delicious and appealing.
2. Practical for home cooking.
3. Within budget.
4. Balanced meal composition.
5. Reuse ingredients across multiple dishes.
6. Match the requested cooking time.
7. Provide estimated nutrition information.

---

# Output

## Summary

- Estimated total cost
- Estimated cooking time
- Estimated calories
- Number of dishes

---

## Dinner Menu

Each dish includes:

- Name
- Short description
- Estimated price
- Estimated calories
- Cooking time
- Difficulty

---

## Dish Details

Expandable section containing:

### Ingredients

Complete ingredient list.

### Cooking Instructions

Step-by-step preparation.

### Estimated Nutrition

- Calories
- Protein
- Carbohydrates
- Fat

All values are approximate.

---

## Recipe References

Provide quick actions such as:

- Watch on YouTube
- Search recipe on Google

Do not fabricate external URLs.

---

## Shopping List

Generate one consolidated shopping list.

If the user has provided available ingredients, exclude them from the shopping list.

Example:

Need to Buy

- 500g beef
- 2 tomatoes
- 1 broccoli
- Spring onions

Already Available

- Eggs
- Rice
- Garlic

---

# Menu Quality Requirements

A good dinner menu should:

- Taste good.
- Feel like a real home-cooked meal.
- Avoid repetitive dishes.
- Include a balanced combination of protein, vegetables, and soup (when appropriate).
- Reuse ingredients across dishes.
- Avoid unnecessary food waste.
- Use ingredients commonly available in Vietnam.
- Be realistic to cook at home.

---

# Product Differentiator

Unlike a generic AI prompt, Dinner AI should think like an experienced home cook.

The AI should:

- Recommend dishes that pair well together.
- Minimize the number of unique ingredients.
- Maximize ingredient reuse.
- Reduce shopping cost.
- Reduce leftover ingredients.
- Prioritize ingredients commonly found in Vietnamese supermarkets and local markets.

---

# UI Principles

- Clean
- Minimal
- Modern
- Mobile-first
- Vietnamese language only
- One-page experience
- Expandable cards for dish details
- Smooth micro-interactions

---

# Technology Stack

Frontend

- Next.js
- React
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Zod (AI response validation)

No backend.

No authentication.

No database.

No persistent storage.

Clean UI and both for mobile and desktop

---

# Success Criteria

A successful result should make the user feel:

> "This is exactly what I want to cook tonight."

The user should be able to open the website, generate a complete dinner plan in seconds, and immediately start shopping or cooking without needing additional planning.
