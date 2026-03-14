const API_BASE = 'http://localhost:3000/api'; // URL of the optional local JSON server

const Api = {
    // Current data cache
    data: {
        live: [],
        highlights: [],
        categories: [],
        matches: [],
        banners: [],
        streams: []
    },

    // Fetch all data from either local server or relative paths
    async fetchAll() {
        const endpoints = {
            live: '../assets/data/live.json',
            highlights: '../assets/data/highlights.json',
            categories: '../assets/data/categories.json',
            matches: '../assets/data/matches.json',
            banners: '../assets/data/banners.json',
            streams: '../assets/data/streams.json'
        };

        for (const [key, path] of Object.entries(endpoints)) {
            try {
                // Try fetching from server first if available, else local path
                const response = await fetch(path);
                this.data[key] = await response.json();
            } catch (e) {
                console.warn(`Failed to fetch ${key}, initializing empty.`, e);
                this.data[key] = [];
            }
        }
        return this.data;
    },

    // Save data - call local server if exists
    async save(type, newData) {
        this.data[type] = newData;
        console.log(`Saving ${type}:`, newData);

        try {
            const response = await fetch(`${API_BASE}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data: newData })
            });

            if (response.ok) {
                alert(`${type} saved successfully to JSON!`);
                return true;
            }
        } catch (e) {
            console.error('Local JSON server not detected. Changes saved in memory/localStorage only.', e);
            localStorage.setItem(`cricfast_${type}`, JSON.stringify(newData));
            alert(`Saved! Note: Local server not running. To persist to JSON files, run 'node admin-server.js'`);
        }
        return true;
    }
};
