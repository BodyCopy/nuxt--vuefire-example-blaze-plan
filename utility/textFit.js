// Convert the UMD wrapper to export as a module

export function textFit(els, options) {
  var defaultSettings = {
    alignVert: false,
    alignHoriz: false,
    multiLine: false,
    detectMultiLine: true,
    minFontSize: 6,
    maxFontSize: 80,
    reProcess: true,
    widthOnly: false,
    alignVertWithFlexbox: false,
  };

  if (!options) options = {};

  var settings = {};
  for (var key in defaultSettings) {
    settings[key] = options.hasOwnProperty(key) ? options[key] : defaultSettings[key];
  }

  if (typeof els.toArray === "function") els = els.toArray();

  if (!Array.isArray(els) && !(els instanceof NodeList)) {
    els = [els];
  }

  for (let el of els) {
    processItem(el, settings);
  }

  function processItem(el, settings) {
    if (!isElement(el) || (!settings.reProcess && el.getAttribute('textFitted'))) return false;

    if (!settings.reProcess) el.setAttribute('textFitted', 1);

    let innerSpan, originalHeight, originalHTML, originalWidth;
    let low, mid, high;

    originalHTML = el.innerHTML;
    originalWidth = innerWidth(el);
    originalHeight = innerHeight(el);

    if (!originalWidth || (!settings.widthOnly && !originalHeight)) {
      throw new Error('Set static height/width before using textFit!');
    }

    if (originalHTML.indexOf('textFitted') === -1) {
      innerSpan = document.createElement('span');
      innerSpan.className = 'textFitted';
      innerSpan.style.display = 'inline-block';
      innerSpan.innerHTML = originalHTML;
      el.innerHTML = '';
      el.appendChild(innerSpan);
    } else {
      innerSpan = el.querySelector('span.textFitted');
    }

    if (settings.alignHoriz) el.style['text-align'] = 'center';

    let multiLine = settings.multiLine;
    if (settings.detectMultiLine && !multiLine && innerSpan.getBoundingClientRect().height >= parseInt(window.getComputedStyle(innerSpan)['font-size'], 10) * 2) {
      multiLine = true;
    }

    if (!multiLine) el.style['white-space'] = 'nowrap';

    low = settings.minFontSize;
    high = settings.maxFontSize;
    let size = low;

    while (low <= high) {
      mid = (high + low) >> 1;
      innerSpan.style.fontSize = mid + 'px';
      const innerSpanBoundingRect = innerSpan.getBoundingClientRect();

      if (innerSpanBoundingRect.width <= originalWidth && (settings.widthOnly || innerSpanBoundingRect.height <= originalHeight)) {
        size = mid;
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    if (innerSpan.style.fontSize !== size + 'px') innerSpan.style.fontSize = size + 'px';

    if (settings.alignVert) {
      var height = innerSpan.scrollHeight;
      if (window.getComputedStyle(el)['position'] === 'static') el.style.position = 'relative';

      innerSpan.style.height = height + 'px';
    }
  }

  function innerHeight(el) {
    const style = window.getComputedStyle(el);
    return el.getBoundingClientRect().height - parseInt(style.getPropertyValue('padding-top'), 10) - parseInt(style.getPropertyValue('padding-bottom'), 10);
  }

  function innerWidth(el) {
    const style = window.getComputedStyle(el);
    return el.getBoundingClientRect().width - parseInt(style.getPropertyValue('padding-left'), 10) - parseInt(style.getPropertyValue('padding-right'), 10);
  }

  function isElement(o) {
    return typeof HTMLElement === 'object' ? o instanceof HTMLElement : o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
  }
}
