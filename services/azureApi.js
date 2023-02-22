

export const getMe = async (token) => {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
    const data = await response.json();
    return data;
};