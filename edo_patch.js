// JukeBox Microtonal - EDO Selector Overlay
// Inject EDO dropdown into Song Settings without modifying core JS
(function(){
  var retries = 0;
  function inject() {
    try {
      var settings = document.querySelector('.editor-song-settings');
      if(!settings) return retry();
      
      // Don't inject twice
      if(settings.querySelector('.jbm-edo-row')) return;
      
      // Find Scale row to insert after
      var rows = settings.querySelectorAll('.selectRow');
      var scaleRow = null;
      for(var i=0; i<rows.length; i++) {
        if(rows[i].textContent.indexOf('Scale') >= 0) {
          scaleRow = rows[i];
          break;
        }
      }
      if(!scaleRow) return retry();
      
      // Create EDO selector
      var select = document.createElement('select');
      select.style.width = '100%';
      
      var common = [5,7,9,10,11,12,13,14,15,16,17,19,22,24,26,27,29,31,34,36,37,41,43,46,48,50,53,63];
      
      select.appendChild(new Option('1 (monophonic)', '1'));
      for(var e=5; e<=63; e++) {
        var label = e + '-EDO';
        if(common.indexOf(e) >= 0) label += ' ★';
        select.appendChild(new Option(label, String(e)));
      }
      
      // Try to get current EDO
      try { select.value = String(window.beepbox && window.beepbox.Config ? 12 : 12); } catch(_) {}
      
      // Create the row
      var row = document.createElement('div');
      row.className = 'selectRow jbm-edo-row';
      
      var labelSpan = document.createElement('span');
      labelSpan.className = 'tip';
      labelSpan.textContent = 'EDO: ';
      
      var container = document.createElement('div');
      container.className = 'selectContainer';
      container.appendChild(select);
      
      row.appendChild(labelSpan);
      row.appendChild(container);
      
      scaleRow.parentNode.insertBefore(row, scaleRow.nextSibling);
      
      // Handle change - use the Edit menu's Change EDO option
      select.addEventListener('change', function() {
        // Find the Edit menu and trigger Change EDO prompt
        var editMenu = document.querySelector('.menu.edit select, select.menu.edit, .edit-menu select');
        if(!editMenu) {
          // Try finding by checking all select menus
          var menus = document.querySelectorAll('.menu-area select');
          for(var m=0; m<menus.length; m++) {
            if(menus[m].textContent.indexOf('Edit') >= 0 || menus[m].querySelector('[value*="Edo"], [value*="edo"]')) {
              editMenu = menus[m];
              break;
            }
          }
        }
        
        if(editMenu) {
          // Set the edit menu to trigger EDO prompt
          var opt = editMenu.querySelector('[value*="Edo"], [value*="edo"]');
          if(opt) {
            editMenu.value = opt.value;
            editMenu.dispatchEvent(new Event('change', {bubbles: true}));
            
            // Wait for prompt, then set value and confirm
            setTimeout(function() {
              var promptContainer = document.querySelector('.promptContainer .prompt');
              if(promptContainer) {
                var input = promptContainer.querySelector('input[type="text"], input[type="number"]');
                var okBtn = promptContainer.querySelector('button.okayButton, button:not(.cancelButton)');
                if(input) {
                  input.value = select.value;
                  if(okBtn) setTimeout(function() { okBtn.click(); }, 100);
                }
              }
            }, 200);
          }
        }
      });
      
    } catch(e) {
      retry();
    }
  }
  
  function retry() {
    if(retries++ < 50) setTimeout(inject, 200);
  }
  
  // Wait for DOM and editor to initialize
  if(document.readyState === 'complete') {
    setTimeout(inject, 1500);
  } else {
    window.addEventListener('load', function() { setTimeout(inject, 1500); });
  }
})();
