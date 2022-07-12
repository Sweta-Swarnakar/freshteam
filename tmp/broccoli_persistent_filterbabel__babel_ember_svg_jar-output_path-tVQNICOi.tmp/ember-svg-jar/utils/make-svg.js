define("ember-svg-jar/utils/make-svg", ["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.createAccessibilityElements = createAccessibilityElements;
  _exports.createAriaLabel = createAriaLabel;
  _exports.default = makeSvg;
  _exports.formatAttrs = formatAttrs;
  _exports.inlineSvgFor = inlineSvgFor;
  _exports.sanitizeAttrs = sanitizeAttrs;
  _exports.symbolUseFor = symbolUseFor;
  const accessibilityElements = ['title', 'desc'];
  const ESC = {
    '"': '&quot;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };

  function matcher(char) {
    return ESC[char];
  }

  function escapeText(text) {
    if (typeof text !== 'string') {
      return '';
    }

    if (text.indexOf('>') > -1 || text.indexOf('<') > -1 || text.indexOf('&') > -1 || text.indexOf('"') > -1) {
      return text.replace(/[&"<>]/g, matcher);
    }

    return text;
  }

  function sanitizeAttrs(attrs) {
    let attrsCopy = Object.assign({}, attrs);
    Object.keys(attrsCopy).forEach(key => {
      attrsCopy[key] = escapeText(attrsCopy[key]);
    });
    return attrsCopy;
  }

  function createAccessibilityElements(attrs) {
    const sanitizedAttrs = sanitizeAttrs(attrs);
    const {
      title,
      desc
    } = sanitizedAttrs;

    if (!title && !desc) {
      return '';
    }

    return accessibilityElements.reduce((elements, tag) => {
      if (sanitizedAttrs[tag]) {
        return elements.concat(`<${tag} id="${tag}">${sanitizedAttrs[tag]}</${tag}>`);
      }

      return elements;
    }, '');
  }

  function createAriaLabel(attrs) {
    const {
      title,
      desc
    } = attrs;

    if (!title && !desc) {
      return '';
    }

    return `aria-labelledby="${accessibilityElements.filter(tag => attrs[tag]).join(' ')}"`;
  }

  function formatAttrs(attrs) {
    return Object.keys(attrs).filter(attr => !accessibilityElements.includes(attr)).map(key => !Ember.isNone(attrs[key]) && `${key}="${attrs[key]}"`).filter(attr => attr).join(' ');
  }

  function symbolUseFor(assetId) {
    let attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return `<svg ${formatAttrs(attrs)}${createAriaLabel(attrs)}><use xlink:href="${assetId}" />${createAccessibilityElements(attrs)}</svg>`;
  }

  function inlineSvgFor(assetId, getInlineAsset) {
    let attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    let asset = getInlineAsset(assetId);

    if (!asset) {
      // eslint-disable-next-line no-console
      console.warn(`ember-svg-jar: Missing inline SVG for ${assetId}`);
      return;
    }

    let svgAttrs = asset.attrs ? Ember.assign({}, asset.attrs, attrs) : attrs;
    let {
      size
    } = attrs;

    if (size) {
      svgAttrs.width = parseFloat(svgAttrs.width) * size || svgAttrs.width;
      svgAttrs.height = parseFloat(svgAttrs.height) * size || svgAttrs.height;
      delete svgAttrs.size;
    }

    return `<svg ${formatAttrs(svgAttrs)}${createAriaLabel(attrs)}>${createAccessibilityElements(attrs)}${asset.content}</svg>`;
  }

  function makeSvg(assetId) {
    let attrs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let getInlineAsset = arguments.length > 2 ? arguments[2] : undefined;

    if (!assetId) {
      // eslint-disable-next-line no-console
      console.warn('ember-svg-jar: asset name should not be undefined or null');
      return;
    }

    let isSymbol = assetId.lastIndexOf('#', 0) === 0;
    let svg = isSymbol ? symbolUseFor(assetId, attrs) : inlineSvgFor(assetId, getInlineAsset, attrs);
    return Ember.String.htmlSafe(svg);
  }
});