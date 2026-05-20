import { DEFAULT_DATA } from "../utils/defaultData.js";

const STORAGE_KEY = "tf_v4";

/**
 * Завантажує дані з localStorage.
 * Якщо даних немає — повертає дефолтні.
 * @returns {object} AppData
 */
export function loadFromLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("[storage] Помилка читання localStorage:", e);
  }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

/**
 * Зберігає дані в localStorage.
 * @param {object} data
 */
export function saveToLocal(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("[storage] Помилка запису в localStorage:", e);
  }
}

/**
 * Очищає збережені дані (reset).
 */
export function clearLocal() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("[storage] Помилка очищення localStorage:", e);
  }
}
