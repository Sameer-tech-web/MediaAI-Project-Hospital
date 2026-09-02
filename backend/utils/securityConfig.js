const isPlaceholder = (value) =>
  /^(paste|replace|change|your|example|<)/i.test(value.trim());

const getConfiguredValue = (value, minimumLength = 1) => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim();

  if (normalizedValue.length < minimumLength || isPlaceholder(normalizedValue)) {
    return null;
  }

  return normalizedValue;
};

const getJwtSecret = () => getConfiguredValue(process.env.JWT_SECRET, 32);
const getBootstrapToken = () =>
  getConfiguredValue(process.env.BOOTSTRAP_TOKEN, 16);
const getGeminiApiKey = () =>
  getConfiguredValue(process.env.GEMINI_API_KEY, 20);
const getGeminiModel = () =>
  getConfiguredValue(process.env.GEMINI_MODEL) || 'gemini-2.5-flash';

module.exports = {
  getJwtSecret,
  getBootstrapToken,
  getGeminiApiKey,
  getGeminiModel,
};
