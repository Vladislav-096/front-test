import { validateResponse } from "./validationResponse";

interface GetDisgStatistic {
  dishName: string;
  signal?: AbortSignal;
}

const API_URL = import.meta.env.VITE_BACKEND_PROXY_URL;
const TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";

export const getDishStatistic = async ({
  dishName,
  signal,
}: GetDisgStatistic) => {
  const useProxy = import.meta.env.VITE_USE_BACKEND_PROXY === "true";
  if (useProxy) {
    console.log("use proxy");
    return fetch(`${API_URL}/dish-statistics`, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dishName }),
    })
      .then(validateResponse)
      .catch((err) => {
        console.log("getDishStatistic (proxy) error", err);
        throw err;
      });
  } else {
    console.log("don't use proxy");
    const prompt = `How many calories, proteins, fats, and carbohydrates are in 100 grams of ${dishName}? Return the answer as a JSON string with fields for calories, proteins, fats, and carbohydrates, and a separate field with a comment about the glycemic index in English. Do not include ANYTHING else in the response (no extra symbols or words) except the JSON string. But if ${dishName} is not a food, then return an empty string as an answer`;

    return fetch(TOGETHER_API_URL, {
      method: "POST",
      signal,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TOGETHER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      }),
    })
      .then(validateResponse)
      .catch((err) => {
        console.log("getDishStatistic (direct) error", err);
        throw err;
      });
  }
};
