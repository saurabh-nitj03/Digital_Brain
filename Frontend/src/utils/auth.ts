// Utility functions for token management

export const setToken = (token: string) => localStorage.setItem('token', token);
export const getToken = () => {
    const token = localStorage.getItem('token');
    console.log("Retrieved token:", token); // Debug log
    return token;
};
export const removeToken = () => localStorage.removeItem('token'); 