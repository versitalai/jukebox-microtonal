// JukeBox Microtonal - EDO Selector Patch
// Injects an inline EDO dropdown into the Song Settings panel
// Runs after the main editor JS loads

(function() {
    'use strict';

    // Wait for editor to be ready
    function waitForEditor() {
        // Check if the editor instance exists (look for song.edo)
        if (typeof beepbox === 'undefined' || !beepbox.editor) {
            return setTimeout(waitForEditor, 100);
        }
        injectEdoSelector();
    }

    function injectEdoSelector() {
        try {
            const doc = beepbox.editor.doc;
            const song = doc && doc.song;
            if (!song) return setTimeout(waitForEditor, 100);

            // Find the Song Settings panel
            const songSettings = document.querySelector('.song-settings-area .editor-song-settings');
            if (!songSettings) return setTimeout(waitForEditor, 100);

            // Find the Scale and Key rows to insert between them
            const rows = songSettings.querySelectorAll('.selectRow');
            let scaleRow = null;
            let keyRow = null;
            for (let i = 0; i < rows.length; i++) {
                const text = rows[i].textContent || '';
                if (text.includes('Scale:')) scaleRow = rows[i];
                if (text.includes('Key:')) keyRow = rows[i];
            }

            // Check if EDO selector already exists
            if (songSettings.querySelector('.edo-selector-row')) return;

            // Common EDOs marked with ★
            const commonEdos = [5, 7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 22, 24, 26, 27, 29, 31, 34, 36, 37, 41, 43, 46, 48, 50, 53, 63];
            const isCommon = commonEdos.reduce((o, v) => { o[v] = true; return o; }, {});

            // Build EDO options (1-63)
            const select = document.createElement('select');
            select.style.width = '100%';
            select.id = 'edo-selector-' + Date.now();
            
            for (let e = 1; e <= 63; e++) {
                const opt = document.createElement('option');
                opt.value = String(e);
                let label = e + '-EDO';
                if (isCommon[e]) label += ' ★';
                opt.textContent = label;
                select.appendChild(opt);
            }
            select.value = String(song.edo || 12);

            // Create the row
            const row = document.createElement('div');
            row.className = 'selectRow edo-selector-row';
            
            const label = document.createElement('span');
            label.className = 'tip';
            label.textContent = 'EDO: ';
            
            const container = document.createElement('div');
            container.className = 'selectContainer';
            container.appendChild(select);
            
            row.appendChild(label);
            row.appendChild(container);

            // Insert between Scale and Key
            if (scaleRow && keyRow) {
                scaleRow.parentNode.insertBefore(row, keyRow);
            } else if (keyRow) {
                keyRow.parentNode.insertBefore(row, keyRow);
            } else if (scaleRow) {
                scaleRow.parentNode.insertBefore(row, scaleRow.nextSibling);
            }

            // Handle change
            select.addEventListener('change', function() {
                const newEdo = parseInt(this.value);
                if (newEdo && newEdo != (doc.song ? doc.song.edo : 12)) {
                    // Call the existing ChangeEdo mechanism
                    try {
                        // Find and execute the editor's EDO change
                        const change = new (getChangeEdoClass())(doc, newEdo);
                        doc.record(change);
                        // Force rebuild scale/key dropdowns if that function exists
                        // The ChangeEdo class should handle this internally
                    } catch(e) {
                        console.warn('EDO change failed:', e);
                    }
                }
            });

            // Try to hook into the existing menu's "Change EDO" action
            // so the inline selector stays in sync
            const origFn = doc && doc.setEdo ? doc.setEdo : null;
            if (origFn) {
                const _orig = origFn;
                doc.setEdo = function(v) {
                    _orig.call(this, v);
                    select.value = String(v);
                };
            }

        } catch(e) {
            console.warn('EDO patch error:', e);
            setTimeout(waitForEditor, 500);
        }
    }

    function getChangeEdoClass() {
        // Search for the ChangeEdo class in the beepbox module
        for (const key in beepbox) {
            try {
                const val = beepbox[key];
                if (typeof val === 'function' && val.prototype && 
                    val.prototype instanceof beepbox.Change) {
                    // Check if it handles EDO by looking at its code
                    const str = val.toString();
                    if (str.includes('edo') || str.includes('EDO')) {
                        return val;
                    }
                }
            } catch(e) {}
        }
        // Fallback: just create a generic change
        return null;
    }

    waitForEditor();
})();
