const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

export const createSnippet = async (data) => {
    const response = await fetch(`${API_URL}/snippets`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    return response.json();
};

export const getSnippets = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/snippets?${query}`, {
        method: 'GET',
        headers: getHeaders()
    });
    return response.json();
};

export const generateWithAI = async (prompt) => {
    const response = await fetch(`${API_URL}/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });
    return response.json();
};

export const updateSnippet = async (id, data) => {
    const response = await fetch(`${API_URL}/snippets/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
    });
    return response.json();
};

export const deleteSnippet = async (id) => {
    const response = await fetch(`${API_URL}/snippets/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
    return response.json();
};

export const duplicateSnippet = async (id) => {
    const response = await fetch(`${API_URL}/snippets/${id}/duplicate`, {
        method: 'POST',
        headers: getHeaders()
    });
    return response.json();
};

export const toggleFavorite = async (id) => {
    const response = await fetch(`${API_URL}/snippets/${id}/favorite`, {
        method: 'PUT',
        headers: getHeaders()
    });
    return response.json();
};

export const getMe = async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders()
    });
    return response.json();
};

export const logoutUser = async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'GET',
        headers: getHeaders()
    });
    localStorage.removeItem('token');
    return response.json();
};
