import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';

/**
 * SafeHTML Component
 * 
 * Sanitizes and safely renders HTML content to prevent XSS attacks.
 * Uses DOMPurify to strip dangerous HTML/JavaScript before rendering.
 * 
 * Security Features:
 * - Removes all <script> tags
 * - Removes event handlers (onclick, onload, etc.)
 * - Sanitizes attributes
 * - Preserves safe HTML formatting (bold, italic, links, etc.)
 * 
 * @param {string} html - HTML content to sanitize and render
 * @param {string} className - Optional CSS classes for the wrapper div
 * @param {object} config - Optional DOMPurify configuration
 */
const SafeHTML = ({ html, className = '', config = {} }) => {
  // Default configuration for DOMPurify
  const defaultConfig = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'code', 'pre', 'blockquote'],
    ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
    KEEP_CONTENT: true,
    ...config,
  };

  // Sanitize the HTML
  const sanitizedHTML = DOMPurify.sanitize(html, defaultConfig);

  return (
    <div
      className={`prose prose-slate max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
    />
  );
};

SafeHTML.propTypes = {
  html: PropTypes.string.isRequired,
  className: PropTypes.string,
  config: PropTypes.object,
};

export default SafeHTML;
