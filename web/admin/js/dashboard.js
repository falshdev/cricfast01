document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initial Setup
    const adminName = sessionStorage.getItem('admin_user');
    if (adminName) document.getElementById('adminName').textContent = adminName;

    await Api.fetchAll();
    renderSection('live');

    // 2. Navigation
    document.querySelectorAll('.menu-item[data-section]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');

            // Update UI
            document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const titles = {
                live: 'Live Stream Manager',
                highlights: 'Highlights Manager',
                categories: 'Category Manager',
                matches: 'Upcoming Matches Manager',
                banners: 'Banner Manager',
                streams: 'Live Streams Manager'
            };
            document.getElementById('currentSectionTitle').textContent = titles[section];

            renderSection(section);
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('open');
            }
        });
    });

    // Mobile Toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    document.getElementById('logoutBtn').addEventListener('click', () => Auth.logout());

    // 3. Render Logic
    function renderSection(section) {
        const container = document.getElementById('managerContent');
        const data = Api.data[section];

        let html = '';

        if (section === 'live') {
            html = renderLiveManager(data);
        } else if (section === 'highlights') {
            html = renderHighlightsManager(data);
        } else if (section === 'categories') {
            html = renderCategoriesManager(data);
        } else if (section === 'matches') {
            html = renderMatchesManager(data);
        } else if (section === 'banners') {
            html = renderBannersManager(data);
        } else if (section === 'streams') {
            html = renderStreamsManager(data);
        }

        container.innerHTML = html;
        attachEventListeners(section);
    }

    // Section Renderers
    function renderLiveManager(data) {
        const item = data[0] || { title: '', embed: '' };
        return `
            <div class="content-card">
                <div class="card-header">
                    <h3>Current Live Stream</h3>
                </div>
                <div class="card-body">
                    <form id="liveStreamForm">
                        <div class="form-group">
                            <label>Live Title</label>
                            <input type="text" class="form-control" name="title" value="${item.title}" required>
                        </div>
                        <div class="form-group">
                            <label>Embed Code / Stream URL</label>
                            <textarea class="form-control" name="embed" rows="6" required>${item.embed}</textarea>
                        </div>
                        <button type="submit" class="btn">Update Live Stream</button>
                    </form>
                </div>
            </div>
        `;
    }

    function renderHighlightsManager(data) {
        return `
            <div class="header-row">
                <button class="btn btn-sm" id="addItemBtn"><i class="fa-solid fa-plus"></i> Add Highlight</button>
            </div>
            <div class="content-card">
                <table>
                    <thead>
                        <tr>
                            <th>Thumbnail</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Duration</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((h, i) => `
                            <tr>
                                <td><img src="${h.thumbnail}" width="60" style="border-radius: 4px"></td>
                                <td>${h.title}</td>
                                <td>${h.category}</td>
                                <td>${h.duration}</td>
                                <td class="actions">
                                    <button class="btn btn-sm btn-outline edit-btn" data-index="${i}">Edit</button>
                                    <button class="btn btn-sm btn-outline delete-btn" data-index="${i}" style="color: var(--accent)">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderCategoriesManager(data) {
        return `
            <div class="header-row">
                <button class="btn btn-sm" id="addItemBtn"><i class="fa-solid fa-plus"></i> Add Category</button>
            </div>
            <div class="content-card">
                <table>
                    <thead>
                        <tr>
                            <th>Category Name</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((c, i) => `
                            <tr>
                                <td>${c}</td>
                                <td class="actions">
                                    <button class="btn btn-sm btn-outline edit-btn" data-index="${i}">Edit</button>
                                    <button class="btn btn-sm btn-outline delete-btn" data-index="${i}" style="color: var(--accent)">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderMatchesManager(data) {
        return `
            <div class="header-row">
                <button class="btn btn-sm" id="addItemBtn"><i class="fa-solid fa-plus"></i> Add Match</button>
            </div>
            <div class="content-card">
                <table>
                    <thead>
                        <tr>
                            <th>Match</th>
                            <th>Series</th>
                            <th>Date/Time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((m, i) => `
                            <tr>
                                <td>${m.teamA} vs ${m.teamB}</td>
                                <td>${m.series}</td>
                                <td>${m.date} | ${m.time}</td>
                                <td class="actions">
                                    <button class="btn btn-sm btn-outline edit-btn" data-index="${i}">Edit</button>
                                    <button class="btn btn-sm btn-outline delete-btn" data-index="${i}" style="color: var(--accent)">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderBannersManager(data) {
        return `
            <div class="header-row">
                <button class="btn btn-sm" id="addItemBtn"><i class="fa-solid fa-plus"></i> Add Banner</button>
            </div>
            <div class="content-card">
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Title</th>
                            <th>Link</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((b, i) => `
                            <tr>
                                <td><img src="${b.image}" width="100" style="border-radius: 4px"></td>
                                <td>${b.title}</td>
                                <td>${b.link}</td>
                                <td class="actions">
                                    <button class="btn btn-sm btn-outline edit-btn" data-index="${i}">Edit</button>
                                    <button class="btn btn-sm btn-outline delete-btn" data-index="${i}" style="color: var(--accent)">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderStreamsManager(data) {
        return `
            <div class="header-row">
                <button class="btn btn-sm" id="addItemBtn"><i class="fa-solid fa-plus"></i> Add Stream</button>
            </div>
            <div class="content-card">
                <table>
                    <thead>
                        <tr>
                            <th>Order</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map((s, i) => `
                            <tr>
                                <td>${s.order || 0}</td>
                                <td>${s.name}</td>
                                <td><span class="badge" style="background: var(--card-bg); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; font-size: 11px;">${s.type}</span></td>
                                <td>${s.active ? '<i class="fa-solid fa-circle-check" style="color: #10B981"></i>' : '<i class="fa-solid fa-circle-xmark" style="color: var(--accent)"></i>'}</td>
                                <td class="actions">
                                    <button class="btn btn-sm btn-outline edit-btn" data-index="${i}">Edit</button>
                                    <button class="btn btn-sm btn-outline delete-btn" data-index="${i}" style="color: var(--accent)">Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // 4. Modal & Form Logic
    function attachEventListeners(section) {
        // Special Live Stream Form
        if (section === 'live') {
            document.getElementById('liveStreamForm').addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updated = [{
                    title: formData.get('title'),
                    embed: formData.get('embed')
                }];
                Api.save('live', updated);
            });
            return;
        }

        // Add Button
        const addBtn = document.getElementById('addItemBtn');
        if (addBtn) {
            addBtn.onclick = () => showModal(section, null);
        }

        // Edit/Delete
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.onclick = () => showModal(section, btn.dataset.index);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.onclick = () => {
                if (confirm('Are you sure you want to delete this item?')) {
                    const data = [...Api.data[section]];
                    data.splice(btn.dataset.index, 1);
                    Api.save(section, data).then(() => renderSection(section));
                }
            };
        });
    }

    function showModal(section, index) {
        const modal = document.getElementById('modalOverlay');
        const form = document.getElementById('editForm');
        const title = document.getElementById('modalTitle');
        const isEdit = index !== null;
        const item = isEdit ? Api.data[section][index] : null;

        title.textContent = isEdit ? `Edit ${section.slice(0, -1)}` : `Add ${section.slice(0, -1)}`;
        modal.style.display = 'flex';

        let formHtml = '';
        if (section === 'highlights') {
            formHtml = `
                <div class="form-group"><label>Title</label><input type="text" name="title" class="form-control" value="${item?.title || ''}" required></div>
                <div class="form-group"><label>Thumbnail URL</label><input type="text" name="thumbnail" class="form-control" value="${item?.thumbnail || ''}" required></div>
                <div class="form-group"><label>Video URL</label><input type="text" name="video" class="form-control" value="${item?.video || ''}" required></div>
                <div class="form-group"><label>Category</label><input type="text" name="category" class="form-control" value="${item?.category || ''}" required></div>
                <div class="form-group"><label>Duration</label><input type="text" name="duration" class="form-control" value="${item?.duration || ''}" required></div>
            `;
        } else if (section === 'categories') {
            formHtml = `
                <div class="form-group"><label>Category Name</label><input type="text" name="name" class="form-control" value="${item || ''}" required></div>
            `;
        } else if (section === 'matches') {
            formHtml = `
                <div class="form-group"><label>Team A</label><input type="text" name="teamA" class="form-control" value="${item?.teamA || ''}" required></div>
                <div class="form-group"><label>Team B</label><input type="text" name="teamB" class="form-control" value="${item?.teamB || ''}" required></div>
                <div class="form-group"><label>Date</label><input type="text" name="date" class="form-control" value="${item?.date || ''}" required></div>
                <div class="form-group"><label>Time</label><input type="text" name="time" class="form-control" value="${item?.time || ''}" required></div>
                <div class="form-group"><label>Series</label><input type="text" name="series" class="form-control" value="${item?.series || ''}" required></div>
                <div class="form-group"><label>Thumbnail</label><input type="text" name="thumbnail" class="form-control" value="${item?.thumbnail || ''}" required></div>
            `;
        } else if (section === 'banners') {
            formHtml = `
                <div class="form-group"><label>Title</label><input type="text" name="title" class="form-control" value="${item?.title || ''}" required></div>
                <div class="form-group"><label>Image URL</label><input type="text" name="image" class="form-control" value="${item?.image || ''}" required></div>
                <div class="form-group"><label>Link</label><input type="text" name="link" class="form-control" value="${item?.link || ''}" required></div>
            `;
        } else if (section === 'streams') {
            formHtml = `
                <div class="form-group"><label>Stream Name (Button Label)</label><input type="text" name="name" class="form-control" value="${item?.name || ''}" required></div>
                <div class="form-group"><label>Live Title (Header)</label><input type="text" name="title" class="form-control" value="${item?.title || ''}" required></div>
                <div class="form-group"><label>Stream Type</label>
                    <select name="type" class="form-control">
                        <option value="dash" ${item?.type === 'dash' ? 'selected' : ''}>DASH (.mpd)</option>
                        <option value="hls" ${item?.type === 'hls' ? 'selected' : ''}>HLS (.m3u8)</option>
                        <option value="mp4" ${item?.type === 'mp4' ? 'selected' : ''}>MP4 Video</option>
                        <option value="embed" ${item?.type === 'embed' ? 'selected' : ''}>Iframe Embed</option>
                    </select>
                </div>
                <div class="form-group"><label>Stream URL / Embed Code</label><textarea name="url" class="form-control" rows="3" required>${item?.url || ''}</textarea></div>
                <div class="form-group"><label>Order</label><input type="number" name="order" class="form-control" value="${item?.order || 0}" required></div>
                <div class="form-group" style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" name="active" id="activeCheck" ${item === null || item?.active ? 'checked' : ''}>
                    <label for="activeCheck" style="margin: 0;">Active (Show on App)</label>
                </div>
            `;
        }

        form.innerHTML = formHtml + '<button type="submit" class="btn">Save Changes</button>';

        form.onsubmit = (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = [...Api.data[section]];
            let newItem;

            if (section === 'categories') {
                newItem = formData.get('name');
            } else {
                newItem = {};
                formData.forEach((value, key) => newItem[key] = value);

                // Handle checkbox and number types
                if (section === 'streams') {
                    newItem.active = formData.get('active') === 'on';
                    newItem.order = parseInt(newItem.order || 0);
                    // If DASH, ensure we don't clear keys if they exist in item
                    if (isEdit && item.clearKeys) newItem.clearKeys = item.clearKeys;
                    else newItem.clearKeys = null;
                }
            }

            if (isEdit) data[index] = newItem;
            else data.push(newItem);

            Api.save(section, data).then(() => {
                modal.style.display = 'none';
                renderSection(section);
            });
        };
    }

    document.getElementById('closeModal').onclick = () => {
        document.getElementById('modalOverlay').style.display = 'none';
    };
});
