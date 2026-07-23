export const getApiUrl = () => {
  const savedUrl = localStorage.getItem('@FlowPDV:apiUrl');
  return savedUrl || 'http://localhost:8080';
};