
import { Facebook, Instagram, Twitter, Linkedin, Mail, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info - Moved to the left */}
        <div>
          <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">Next Quest</h3>
          <p className="text-sm text-gray-400">
            A Subprime Platforms Inc. Product
          </p>
          <p className="text-xs mt-2 text-gray-500">
            Simplifying project management for innovative teams
          </p>
        </div>

        {/* Social & Legal - Center */}
        <div>
          <h4 className="font-semibold mb-4 text-gray-300">Connect</h4>
          <ul className="space-y-2 text-gray-400 mb-4">
            <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact Us</Link></li>
            <li><Link to="/help" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
              <HelpCircle size={16} /> Help Center
            </Link></li>
          </ul>
          <div className="flex space-x-4 mb-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
              <Facebook size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
              <Twitter size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
              <Instagram size={18} />
            </a>
            <a href="mailto:hello@nextquest.com" className="text-gray-400 hover:text-yellow-400 transition-colors">
              <Mail size={18} />
            </a>
          </div>
          <ul className="text-xs space-y-1 text-gray-500">
            <li><Link to="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Product Links - Moved to the right */}
        <div>
          <h4 className="font-semibold mb-4 text-gray-300">Product</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/features" className="hover:text-yellow-400 transition-colors">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-yellow-400 transition-colors">Pricing</Link></li>
            <li><Link to="/roadmap" className="hover:text-yellow-400 transition-colors">Roadmap</Link></li>
            <li><Link to="/integrations" className="hover:text-yellow-400 transition-colors">Integrations</Link></li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Next Quest by Subprime Platforms Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
