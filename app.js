/* ============================================================
ERP — app.js
   ============================================================ */

/* ── TABS ──────────────────────────────────────────────────── */
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.tab;
        const bar = btn.closest('.tab-bar');
        const content = bar.nextElementSibling;

        bar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        content.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        content.querySelector('#' + targetId).classList.add('active');
    });
});

/* ── MODALS ────────────────────────────────────────────────── */
function openModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('open');
}

function closeModal(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('open');
}

// cerrar al click en el overlay (fuera del modal)
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay.id);
    });
});

// cerrar con Escape
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(o => o.classList.remove('open'));
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
});

/* ── TOASTS ────────────────────────────────────────────────── */
const TOAST_ICONS = {
    success: '<i class="fas fa-check-circle"></i>',
    warning: '<i class="fas fa-exclamation-triangle"></i>',
    danger:  '<i class="fas fa-times-circle"></i>',
    info:    '<i class="fas fa-info-circle"></i>',
};

const TOAST_LABELS = {
    success: 'Éxito',
    warning: 'Advertencia',
    danger:  'Error',
    info:    'Información',
};

function toast(type, title, msg, duration) {
    const container = document.getElementById('toastContainer');
    const t = document.createElement('div');
    t.className = 'toast toast-' + type;

    t.innerHTML =
        '<span class="toast-icon">' + (TOAST_ICONS[type] || 'ℹ') + '</span>' +
        '<div class="toast-msg">' +
            '<div class="toast-title">' + (title || TOAST_LABELS[type] || type) + '</div>' +
            '<div>' + msg + '</div>' +
        '</div>' +
        '<button class="toast-dismiss" onclick="dismissToast(this.parentElement)">✕</button>';

    container.appendChild(t);

    const timeout = duration || 3800;
    setTimeout(() => dismissToast(t), timeout);
}

function dismissToast(el) {
    if (!el || el.classList.contains('removing')) return;
    el.classList.add('removing');
    setTimeout(() => el.remove(), 220);
}

// exponer globalmente para uso desde HTML inline
window.toast = toast;

/* ── ALERTS ────────────────────────────────────────────────── */
function cerrarAlert(btn) {
    const alert = btn.closest('.alert');
    alert.style.transition = 'opacity 0.2s';
    alert.style.opacity = '0';
    setTimeout(() => alert.remove(), 220);
}

window.cerrarAlert = cerrarAlert;

/* ── DROPDOWN ──────────────────────────────────────────────── */
function toggleDropdown(id) {
    const dd = document.getElementById(id);
    const isOpen = dd.classList.contains('open');

    // cerrar todos primero
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));

    if (!isOpen) dd.classList.add('open');
}

function closeDropdown(id) {
    document.getElementById(id).classList.remove('open');
}

// cerrar dropdown al click afuera
document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    }
});

window.toggleDropdown = toggleDropdown;
window.closeDropdown  = closeDropdown;

/* ── FILTRO TABLA ──────────────────────────────────────────── */
function filtrarTabla() {
    const texto  = document.getElementById('busqueda').value.toLowerCase();
    const estado = document.getElementById('filtroEstado').value.toLowerCase();
    const filas  = document.querySelectorAll('#tablaBody tr');

    filas.forEach(fila => {
        const txt = fila.textContent.toLowerCase();
        const coincideTexto  = !texto  || txt.includes(texto);
        const coincideEstado = !estado || txt.includes(estado);
        fila.style.display = (coincideTexto && coincideEstado) ? '' : 'none';
    });
}

function limpiarFiltros() {
    document.getElementById('busqueda').value = '';
    document.getElementById('filtroEstado').value = '';
    filtrarTabla();
}

window.filtrarTabla  = filtrarTabla;
window.limpiarFiltros = limpiarFiltros;

/* ── FORMULARIO ────────────────────────────────────────────── */
function enviarFormulario(e) {
    e.preventDefault();

    const rut   = document.getElementById('f-rut');
    const razon = document.getElementById('f-razon');
    const tipo  = document.getElementById('f-tipo');
    let ok = true;

    [rut, razon, tipo].forEach(el => {
        if (!el.value.trim()) {
            el.classList.add('error');
            ok = false;
        } else {
            el.classList.remove('error');
        }
    });

    if (!ok) {
        toast('warning', 'Validación', 'Completa los campos obligatorios (*).');
        return false;
    }

    toast('success', 'Guardado', 'Documento creado exitosamente.');
    return false;
}

function limpiarForm() {
    document.querySelectorAll('#tab-formulario .form-control').forEach(el => {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else el.value = '';
        el.classList.remove('error');
    });
}

window.enviarFormulario = enviarFormulario;
window.limpiarForm      = limpiarForm;
window.openModal        = openModal;
window.closeModal       = closeModal;

/* ── SIDEBAR MÓVIL ─────────────────────────────────────────── */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const isOpen  = sidebar.classList.contains('open');
    isOpen ? closeSidebar() : openSidebar();
}

function openSidebar() {
    document.querySelector('.sidebar').classList.add('open');
    document.getElementById('sidebarOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    document.querySelector('.sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

// cerrar sidebar al navegar (móvil)
document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 960) closeSidebar();
    });
});

window.toggleSidebar = toggleSidebar;
window.closeSidebar  = closeSidebar;

/* ── SIMULACIÓN PROGRESS ───────────────────────────────────── */
function simularCarga() {
    const bar = document.getElementById('bar-sii');
    const pct = document.getElementById('pct-sii');
    let v = 0;
    bar.style.width = '0%';
    pct.textContent = '0%';

    toast('info', 'Sincronización', 'Iniciando conexión con el SII...');

    const iv = setInterval(() => {
        v += Math.floor(Math.random() * 12) + 3;
        if (v >= 100) {
            v = 100;
            clearInterval(iv);
            toast('success', 'Completado', 'Sincronización con el SII finalizada.');
        }
        bar.style.width = v + '%';
        pct.textContent = v + '%';
    }, 200);
}

window.simularCarga = simularCarga;

/* ── CANVAS BAR CHART ──────────────────────────────────────── */
(function () {
    const canvas = document.getElementById('mainChart');
    if (!canvas) return;

    const meses  = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'];
    const ventas = [4.2, 5.8, 3.9, 6.4, 5.1, 7.2];   // millones
    const meta   = [5.0, 5.0, 5.0, 6.0, 6.0, 6.0];

    function dibujar() {
        const W = canvas.offsetWidth;
        const H = 160;
        canvas.width  = W;
        canvas.height = H;

        const ctx  = canvas.getContext('2d');
        const PAD  = { top: 20, right: 20, bottom: 36, left: 48 };
        const cW   = W - PAD.left - PAD.right;
        const cH   = H - PAD.top  - PAD.bottom;
        const n    = meses.length;
        const maxV = 8;

        // fondo
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, W, H);

        // grid
        ctx.strokeStyle = '#dde4ec';
        ctx.lineWidth   = 1;
        for (let i = 0; i <= 4; i++) {
            const y = PAD.top + (cH / 4) * i;
            ctx.beginPath();
            ctx.moveTo(PAD.left, y);
            ctx.lineTo(W - PAD.right, y);
            ctx.stroke();

            // etiqueta Y
            const val = maxV - (maxV / 4) * i;
            ctx.fillStyle = '#8899aa';
            ctx.font      = '10px Arial';
            ctx.textAlign = 'right';
            ctx.fillText('$' + val.toFixed(1) + 'M', PAD.left - 6, y + 4);
        }

        const barW    = Math.min(cW / n * 0.5, 38);
        const slotW   = cW / n;

        meses.forEach((mes, i) => {
            const x    = PAD.left + slotW * i + slotW / 2;
            const bH   = (ventas[i] / maxV) * cH;
            const bY   = PAD.top + cH - bH;

            // gradiente barra
            const grad = ctx.createLinearGradient(0, bY, 0, bY + bH);
            grad.addColorStop(0, '#6aaae0');
            grad.addColorStop(0.45, '#4a8ac8');
            grad.addColorStop(0.55, '#3878b8');
            grad.addColorStop(1,    '#4a8ac8');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.roundRect
                ? ctx.roundRect(x - barW / 2, bY, barW, bH, [3, 3, 0, 0])
                : ctx.rect(x - barW / 2, bY, barW, bH);
            ctx.fill();

            // borde barra
            ctx.strokeStyle = '#2868a8';
            ctx.lineWidth   = 0.5;
            ctx.stroke();

            // brillo
            const shine = ctx.createLinearGradient(0, bY, 0, bY + bH * 0.45);
            shine.addColorStop(0, 'rgba(255,255,255,0.28)');
            shine.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = shine;
            ctx.beginPath();
            ctx.roundRect
                ? ctx.roundRect(x - barW / 2, bY, barW, bH * 0.45, [3, 3, 0, 0])
                : ctx.rect(x - barW / 2, bY, barW, bH * 0.45);
            ctx.fill();

            // valor sobre barra
            ctx.fillStyle  = '#2a3a50';
            ctx.font       = 'bold 10px Arial';
            ctx.textAlign  = 'center';
            ctx.fillText('$' + ventas[i].toFixed(1) + 'M', x, bY - 5);

            // mes
            ctx.fillStyle = '#6a7a8a';
            ctx.font      = '10px Arial';
            ctx.fillText(mes, x, H - PAD.bottom + 14);
        });

        // línea de meta
        const metaY = PAD.top + cH - (meta[0] / maxV) * cH;
        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = '#e08030';
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.moveTo(PAD.left, metaY);
        ctx.lineTo(W - PAD.right, metaY);
        ctx.stroke();
        ctx.setLineDash([]);

        // leyenda meta
        ctx.fillStyle = '#e08030';
        ctx.font      = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText('— Meta', W - PAD.right, metaY - 4);
    }

    dibujar();
    window.addEventListener('resize', dibujar);
})();
