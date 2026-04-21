import { getMe, getSnippets, logoutUser } from './api/client.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Check Auth
    const token = localStorage.getItem('token');
    if (!token) {
        // Normally redirect to login
        alert('Please login first to view your dashboard. \nProceeding as guest simulation for testing...');
    }

    try {
        // Fetch User Details
        const userRes = await getMe();
        if (userRes.success && userRes.data) {
            document.getElementById('user-name').textContent = userRes.data.name;
            document.getElementById('user-email').textContent = userRes.data.email;
            document.getElementById('user-role').textContent = userRes.data.role;
        } else {
            console.warn('Failed to load user profile', userRes);
            document.getElementById('user-name').textContent = 'Guest User';
        }

        // Fetch Total Snippets
        const allSnippetsRes = await getSnippets({ sort: 'createdAt:desc' });
        let snippets = [];
        let favorites = [];

        if (allSnippetsRes.success) {
            snippets = allSnippetsRes.data;
            favorites = snippets.filter(s => s.isFavorite);
            
            // Render Stats
            document.getElementById('stat-total').textContent = snippets.length;
            document.getElementById('total-snippets-sm').textContent = snippets.length;
            
            document.getElementById('stat-favorites').textContent = favorites.length;
            document.getElementById('total-favorites-sm').textContent = favorites.length;

            // Render Recent Activity (Map latest 5 limits)
            const recentSnippetsTable = document.getElementById('recent-snippets-table');
            if (snippets.length === 0) {
                recentSnippetsTable.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">No snippets found. Click "New Snippet" to create one.</td></tr>';
            } else {
                recentSnippetsTable.innerHTML = snippets.slice(0, 5).map(snippet => `
                    <tr>
                        <td>
                            <i class="${snippet.language === 'web' ? 'fab fa-html5 text-danger' : 'fas fa-code text-secondary'} me-2"></i>
                            <span class="fw-semibold">${snippet.title}</span>
                            ${snippet.isFavorite ? '<i class="fas fa-star text-warning ms-1" style="font-size: 0.8rem;"></i>' : ''}
                        </td>
                        <td><span class="badge bg-secondary">${snippet.language.toUpperCase()}</span></td>
                        <td>${new Date(snippet.createdAt).toLocaleDateString()}</td>
                        <td class="text-end">
                            <a href="index.html?id=${snippet._id}" class="btn btn-sm btn-outline-primary"><i class="fas fa-edit"></i> Edit</a>
                        </td>
                    </tr>
                `).join('');
            }

            // Render Favorites Grid
            const favoritesGrid = document.getElementById('favorites-grid');
            if (favorites.length === 0) {
                favoritesGrid.innerHTML = '<div class="col-12 text-center py-4 text-muted border rounded" style="border-style: dashed !important;"><i class="fas fa-star me-2 mb-3"></i>No favorites yet... star a snippet to see it here!</div>';
            } else {
                favoritesGrid.innerHTML = favorites.map(fav => `
                    <div class="col-md-4 col-sm-6">
                        <div class="card h-100 shadow-sm border border-secondary" style="background:var(--bg-color);">
                            <div class="card-body">
                                <h6 class="card-title fw-bold text-truncate">${fav.title}</h6>
                                <p class="card-text text-muted small mb-3">Created: ${new Date(fav.createdAt).toLocaleDateString()}</p>
                                <a href="index.html?id=${fav._id}" class="btn btn-sm btn-primary w-100">Open in Editor <i class="fas fa-arrow-right ms-1"></i></a>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
        
    } catch (err) {
        console.error('API Error loading dashboard', err);
        document.getElementById('recent-snippets-table').innerHTML = '<tr><td colspan="4" class="text-danger py-3 text-center">API Error. Please ensure backend is running.</td></tr>';
        document.getElementById('favorites-grid').innerHTML = '<div class="text-danger p-3">API Error.</div>';
    }

    // Logout Functionality
    document.getElementById('logout-btn').addEventListener('click', async () => {
        if(confirm('Are you sure you want to logout?')) {
            try {
                await logoutUser();
                window.location.reload();
            } catch(e) {
                console.error(e);
                alert("Failed to logout");
            }
        }
    });

});