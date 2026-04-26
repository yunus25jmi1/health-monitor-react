#!/usr/bin/env python3
"""
Local Bonk Code Review CLI
Mimics Bonk functionality for local testing

Usage:
    python scripts/bonk.py security-review [file]
    python scripts/bonk.py code-quality [file]
    python scripts/bonk.py explain [file]
    python scripts/bonk.py test-coverage [file]
    python scripts/bonk.py accessibility [file]
    python scripts/bonk.py custom --prompt "Your prompt here" [file]
"""

import os
import sys
import json
import subprocess
import argparse
from pathlib import Path
from dotenv import load_dotenv

# Load environment
load_dotenv('.env.opencode')

class BonkLocal:
    def __init__(self):
        self.api_key = os.getenv('OPENCODE_API_KEY')
        self.model = os.getenv('MODEL', 'opencode/claude-opus-4-5')
        self.verbose = os.getenv('VERBOSE', 'false').lower() == 'true'
        
        if not self.api_key:
            print("❌ Error: OPENCODE_API_KEY not found in .env.opencode")
            print("   Copy .env.opencode.example to .env.opencode and add your API key")
            sys.exit(1)
    
    def run_opencode(self, prompt: str, target: str = '.') -> str:
        """Execute OpenCode CLI with prompt"""
        cmd = [
            'opencode',
            'review',
            target,
            '--prompt',
            prompt,
            '--model',
            self.model
        ]
        
        if self.verbose:
            print(f"🔧 Running: {' '.join(cmd)}")
        
        try:
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return result.stdout
        except subprocess.CalledProcessError as e:
            print(f"❌ Error: {e.stderr}")
            sys.exit(1)
        except FileNotFoundError:
            print("❌ OpenCode CLI not found. Install with: bun install -g opencode")
            sys.exit(1)
    
    def security_review(self, target: str = '.'):
        """Security-focused code review"""
        print(f"🔐 Security Review: {target}")
        print("━" * 70)
        
        prompt = """Perform a comprehensive security review focusing on:

1. **Authentication & Authorization**
   - JWT handling and HttpOnly cookie implementation
   - Session validation
   - RBAC implementation
   - Token expiration

2. **XSS Prevention**
   - DOMPurify usage verification
   - dangerouslySetInnerHTML detection
   - HTML sanitization configuration
   - User input validation

3. **API Security**
   - CORS configuration correctness
   - API endpoint protection
   - Error handling for sensitive data leakage
   - Rate limiting needs

4. **Cryptography & Data**
   - Secure random number generation
   - Password handling
   - Sensitive data in transit
   - No hardcoded secrets

5. **Dependencies**
   - Known vulnerabilities in package.json
   - Outdated security-critical packages
   - Suspicious dependencies

6. **Environment Variables**
   - .env properly excluded from git
   - No exposed secrets in code
   - Configuration management

7. **CSRF & Session Management**
   - CSRF token usage
   - SameSite cookie flags
   - Session timeout

For each issue found:
- Provide specific file paths and line numbers
- Explain the vulnerability
- Suggest fixes
- Rate severity: CRITICAL, HIGH, MEDIUM, LOW

Prioritize critical and high-severity issues."""
        
        output = self.run_opencode(prompt, target)
        print(output)
        return output
    
    def code_quality_review(self, target: str = '.'):
        """Code quality and best practices review"""
        print(f"📊 Code Quality Review: {target}")
        print("━" * 70)
        
        prompt = """Review this code for quality issues:

1. **React Best Practices**
   - Unnecessary re-renders
   - Improper hook usage (useEffect, useCallback, useMemo)
   - Missing dependency arrays
   - Memory leaks in event listeners
   - Closure issues

2. **Performance**
   - N+1 query problems
   - Inefficient DOM manipulations
   - Large bundle size contributors
   - Unnecessary component renders

3. **Code Cleanliness**
   - Dead code or unused imports
   - Code duplication
   - Naming conventions (camelCase, PascalCase)
   - Function complexity (>50 lines)
   - File organization

4. **Error Handling**
   - Missing try-catch blocks
   - Unhandled promise rejections
   - User-friendly error messages
   - Proper logging

5. **Type Safety**
   - PropTypes or TypeScript usage
   - Type consistency
   - Missing type hints

6. **Testing Coverage**
   - Missing unit tests
   - Edge cases not covered
   - Mock usage
   - Test organization

For improvements:
- Point to specific line numbers
- Show before/after code examples
- Explain the benefit of change
- Rate priority: CRITICAL, HIGH, MEDIUM, LOW"""
        
        output = self.run_opencode(prompt, target)
        print(output)
        return output
    
    def explain_code(self, target: str = '.'):
        """Explain how code works"""
        print(f"📖 Code Explanation: {target}")
        print("━" * 70)
        
        prompt = """Explain this code:

1. **Purpose**: What does this code do?
2. **Architecture**: How is it organized?
3. **Key Components**: What are the main parts?
4. **Data Flow**: How does data move through?
5. **Dependencies**: What does it depend on?
6. **Entry Points**: Where does execution start?
7. **Edge Cases**: What special cases are handled?
8. **Improvements**: What could be better?

Be concise but thorough. Include code examples."""
        
        output = self.run_opencode(prompt, target)
        print(output)
        return output
    
    def test_coverage_review(self, target: str = '.'):
        """Review test coverage and suggest improvements"""
        print(f"🧪 Test Coverage Review: {target}")
        print("━" * 70)
        
        prompt = """Review test coverage and suggest improvements:

1. **Current Coverage**
   - What is currently tested?
   - What's missing?
   - Coverage percentage estimate

2. **Critical Paths**
   - Authentication flows
   - API calls
   - Error scenarios
   - Edge cases

3. **Test Quality**
   - Are tests meaningful?
   - Proper mocking usage?
   - Test isolation?
   - Flaky tests?

4. **Missing Tests**
   - Happy path tests
   - Error path tests
   - Integration tests
   - Edge case tests

5. **Suggestions**
   - High-value tests to add
   - Testing tools to use
   - Organization improvements
   - Mock strategies

Format as actionable checklist."""
        
        output = self.run_opencode(prompt, target)
        print(output)
        return output
    
    def accessibility_review(self, target: str = '.'):
        """Review accessibility compliance"""
        print(f"♿ Accessibility Review: {target}")
        print("━" * 70)
        
        prompt = """Review this code for accessibility compliance:

1. **ARIA Attributes**
   - Proper landmark roles (main, nav, aside)
   - aria-label usage
   - aria-describedby
   - aria-expanded, aria-selected states

2. **Keyboard Navigation**
   - Tab order logical?
   - Keyboard traps?
   - Focus management
   - Keyboard shortcuts documented

3. **Visual Design**
   - Color contrast ratio (WCAG AA: 4.5:1)
   - Not relying on color alone
   - Focus indicators visible
   - Text resizable

4. **Screen Reader**
   - Semantic HTML (button, nav, h1-h6)
   - Image alt text
   - Form labels
   - Skip links

5. **Motion & Animation**
   - prefers-reduced-motion respected
   - Auto-playing videos disabled
   - Animation speed controllable

6. **Mobile/Touch**
   - Touch target size (48px minimum)
   - Gesture alternatives
   - Responsive design

Compliance level: WCAG 2.1 Level AA

Issues found:
- Severity: CRITICAL, HIGH, MEDIUM, LOW
- Specific file and line
- Fix suggestion
- WCAG criterion violated"""
        
        output = self.run_opencode(prompt, target)
        print(output)
        return output
    
    def custom_review(self, prompt: str, target: str = '.'):
        """Run custom review with user prompt"""
        print(f"🤖 Custom Review: {target}")
        print("━" * 70)
        print(f"Prompt: {prompt}")
        print("━" * 70)
        
        output = self.run_opencode(prompt, target)
        print(output)
        return output

def main():
    parser = argparse.ArgumentParser(
        description='Local Bonk Code Review - Test AI code reviews locally',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Security review entire repo
  python scripts/bonk.py security-review
  
  # Code quality review specific file
  python scripts/bonk.py code-quality src/components/SafeHTML.jsx
  
  # Explain how authentication works
  python scripts/bonk.py explain src/context/AuthProvider.jsx
  
  # Test coverage suggestions
  python scripts/bonk.py test-coverage src/
  
  # Custom review
  python scripts/bonk.py custom --prompt "Review for XSS vulnerabilities" src/
        """
    )
    
    subparsers = parser.add_subparsers(dest='command', help='Review type')
    
    # Security review
    security_parser = subparsers.add_parser('security-review', help='Security-focused review')
    security_parser.add_argument('target', nargs='?', default='.', help='File or directory to review')
    
    # Code quality
    quality_parser = subparsers.add_parser('code-quality', help='Code quality review')
    quality_parser.add_argument('target', nargs='?', default='.', help='File or directory to review')
    
    # Explain
    explain_parser = subparsers.add_parser('explain', help='Explain code')
    explain_parser.add_argument('target', nargs='?', default='.', help='File or directory to explain')
    
    # Test coverage
    test_parser = subparsers.add_parser('test-coverage', help='Test coverage review')
    test_parser.add_argument('target', nargs='?', default='.', help='File or directory to review')
    
    # Accessibility
    a11y_parser = subparsers.add_parser('accessibility', help='Accessibility review')
    a11y_parser.add_argument('target', nargs='?', default='.', help='File or directory to review')
    
    # Custom
    custom_parser = subparsers.add_parser('custom', help='Custom review with your prompt')
    custom_parser.add_argument('--prompt', required=True, help='Your custom prompt')
    custom_parser.add_argument('target', nargs='?', default='.', help='File or directory to review')
    
    args = parser.parse_args()
    
    bonk = BonkLocal()
    
    if not args.command:
        parser.print_help()
        sys.exit(1)
    
    if args.command == 'security-review':
        bonk.security_review(args.target)
    elif args.command == 'code-quality':
        bonk.code_quality_review(args.target)
    elif args.command == 'explain':
        bonk.explain_code(args.target)
    elif args.command == 'test-coverage':
        bonk.test_coverage_review(args.target)
    elif args.command == 'accessibility':
        bonk.accessibility_review(args.target)
    elif args.command == 'custom':
        bonk.custom_review(args.prompt, args.target)

if __name__ == '__main__':
    main()
