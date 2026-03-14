const Auth = {
    // Basic static credentials for v1.0
    // In production, these should be checked against an API
    credentials: {
        username: 'admin',
        password: 'password123' 
    },

    login: function(username, password) {
        if (username === this.credentials.username && password === this.credentials.password) {
            sessionStorage.setItem('admin_logged_in', 'true');
            sessionStorage.setItem('admin_user', username);
            return true;
        }
        return false;
    },

    isLoggedIn: function() {
        return sessionStorage.getItem('admin_logged_in') === 'true';
    },

    logout: function() {
        sessionStorage.removeItem('admin_logged_in');
        sessionStorage.removeItem('admin_user');
        window.location.href = 'login.html';
    },

    checkAuth: function() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
        }
    }
};
