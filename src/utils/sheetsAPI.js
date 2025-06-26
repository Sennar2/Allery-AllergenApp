// src/utils/sheetsAPI.js
import axios from "axios";
import Papa from "papaparse";

const baseURL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRfS9cag5vyojc7Gb2fGfFOmfiKZW8xnroajn69I66oWlcYf0a92QcarW2BpPyfGz7ZoI9zNpxzdZ6e/pub?output=csv";

export async function fetchMenu() {
  const res = await axios.get(baseURL);
  const parsed = Papa.parse(res.data, {
    header: true,
    skipEmptyLines: true
  });

  return parsed.data.map((row) => {
    // Construct Dietary Tags from separate columns
    const diet = [];
    if (row["Vegan"]?.toLowerCase() === "yes") diet.push("vegan");
    if (row["Vegetarian"]?.toLowerCase() === "yes") diet.push("vegetarian");
    if (row["Gluten-Free"]?.toLowerCase() === "yes") diet.push("glutenfree");

    return {
      Name: row["Dish Name"]?.trim(),
      Ingredients: row["Ingredients"]?.trim(),
      Category: row["Category"]?.trim(),
      Price: row["Price"]?.trim(),
      Allergens: row["Allergen Tags"]?.trim(),
      "Spicy Level": row["Spicy Level"]?.trim(),
      Notes: row["Notes"]?.trim(),
      "Dietary Tags": diet.join(", ")
    };
  });
}
