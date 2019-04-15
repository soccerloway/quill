import { EmbedBlot } from 'parchment';
import { sanitize } from './link';

const ATTRIBUTES = ['alt', 'height', 'width'];
const STYLES = ['verticalAlign']

class Image extends EmbedBlot {
  static create(value) {
    const node = super.create(value);
    if (typeof value === 'string') {
      node.setAttribute('src', this.sanitize(value));
    }
    return node;
  }

  static formats(domNode) {
    let formats = {}

    STYLES.reduce((formats, style) => {
      if (domNode.style[style]) {
        formats[style] = domNode.style[style];
      }
      return formats;
    }, formats)

    return ATTRIBUTES.reduce((formats, attribute) => {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, formats);
  }

  static match(url) {
    return /\.(jpe?g|gif|png)$/.test(url) || /^data:image\/.+;base64/.test(url);
  }

  static register() {
    if (/Firefox/i.test(navigator.userAgent)) {
      setTimeout(() => {
        // Disable image resizing in Firefox
        document.execCommand('enableObjectResizing', false, false);
      }, 1);
    }
  }

  static sanitize(url) {
    return sanitize(url, ['http', 'https', 'data']) ? url : '//:0';
  }

  static value(domNode) {
    return domNode.getAttribute('src');
  }

  constructor(scroll, domNode) {
    super(scroll, domNode);
    this.format('verticalAlign', 'middle')
  }

  format(name, value) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else if (STYLES.indexOf(name) > -1) {
      if (value) {
        this.domNode.style[name] = value
      } else {
        this.domNode.style[name] = 'initial'
      }
    } else {
      super.format(name, value);
    }
  }
}
Image.blotName = 'image';
Image.tagName = 'IMG';

export default Image;
