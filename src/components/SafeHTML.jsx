import DOMPurify from 'dompurify';

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
 * @param {Object} props - Component props
 * @param {string} props.html - HTML content to sanitize and render (required)
 * @param {string} [props.className=''] - Optional CSS classes for the wrapper div
 * @param {Object} [props.config={}] - Optional DOMPurify configuration
 * @returns {React.ReactElement} Safe HTML rendered in a div
 * 
 * @example
 * // Basic usage
 * <SafeHTML html="<b>Bold text</b>" />
 * 
 * // With custom classes
 * <SafeHTML html={content} className="mt-4 text-lg" />
 * 
 * // With custom DOMPurify config
 * <SafeHTML 
 *   html={content}
 *   config={{ ALLOWED_TAGS: ['b', 'i', 'em', 'strong'] }}
 * />
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

export default SafeHTML;
