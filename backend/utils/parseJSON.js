export const safeParse = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("JSON Parse Error:", text);
    return null;
  }
};