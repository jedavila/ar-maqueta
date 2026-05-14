(function () {
    'use strict';

    /* ── Referencias ── */
    const modelo = document.getElementById('modelo');
    const marcador = document.getElementById('marcador');
    const dot = document.getElementById('dot');
    const statusText = document.getElementById('status-text');
    const statusBar = document.getElementById('status-bar');

    /* ── Estado de rotación ── */
    let rotY = 0;      // grados actuales
    let timer = null;   // intervalo activo
    const VEL = 1.6;    // grados por frame
    const FRAME_MS = 16;     // ~60 fps

    /* ── Helpers de rotación ── */
    function iniciarRotacion(dir) {
        if (timer !== null) return;
        timer = setInterval(function () {
            rotY = ((rotY + dir * VEL) % 360 + 360) % 360;
            modelo.setAttribute('rotation', '0 ' + rotY + ' 0');
        }, FRAME_MS);
    }

    function detenerRotacion() {
        if (timer !== null) {
            clearInterval(timer);
            timer = null;
        }
    }

    function resetRotacion() {
        detenerRotacion();
        rotY = 0;
        modelo.setAttribute('rotation', '0 0 0');
    }

    /* ── Conectar botones ── */
    function conectarBoton(id, dir) {
        var btn = document.getElementById(id);

        /* Mouse (desktop) */
        btn.addEventListener('mousedown', function () {
            btn.classList.add('presionado');
            iniciarRotacion(dir);
        });
        btn.addEventListener('mouseup', function () {
            btn.classList.remove('presionado');
            detenerRotacion();
        });
        btn.addEventListener('mouseleave', function () {
            btn.classList.remove('presionado');
            detenerRotacion();
        });

        /* Touch (móvil) — preventDefault evita doble-tap zoom */
        btn.addEventListener('touchstart', function (e) {
            e.preventDefault();
            btn.classList.add('presionado');
            iniciarRotacion(dir);
        }, { passive: false });

        btn.addEventListener('touchend', function (e) {
            e.preventDefault();
            btn.classList.remove('presionado');
            detenerRotacion();
        }, { passive: false });

        btn.addEventListener('touchcancel', function () {
            btn.classList.remove('presionado');
            detenerRotacion();
        });
    }

    conectarBoton('btn-izq', -1);
    conectarBoton('btn-der', 1);

    /* Reset */
    var btnReset = document.getElementById('btn-reset');
    btnReset.addEventListener('click', resetRotacion);
    btnReset.addEventListener('touchstart', function (e) {
        e.preventDefault();
        resetRotacion();
    }, { passive: false });

    /* ── Estado del marcador ── */
    var ocultarTimer = null;

    marcador.addEventListener('markerFound', function () {
        dot.classList.add('detectado');
        statusText.textContent = 'Marcador detectado ✓';
        statusBar.classList.remove('oculto');

        /* Ocultar el status después de 2 s */
        if (ocultarTimer) clearTimeout(ocultarTimer);
        ocultarTimer = setTimeout(function () {
            statusBar.classList.add('oculto');
        }, 2000);
    });

    marcador.addEventListener('markerLost', function () {
        if (ocultarTimer) clearTimeout(ocultarTimer);
        statusBar.classList.remove('oculto');
        dot.classList.remove('detectado');
        statusText.textContent = 'Apunte al QR porfavor';
    });

})();