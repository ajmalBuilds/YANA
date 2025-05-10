import React, { forwardRef } from 'react';
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Github as GitHub,
  Mail,
  Users,
} from 'lucide-react';

const InnerPageFooter = forwardRef((props, ref) => {
  return (
    <footer ref={ref} className="bg-white border-t border-gray-200 pt-10 pb-6 text-gray-700">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <Users className="h-6 w-6 text-indigo-500 mr-2" />
            <span className="font-semibold text-xl">YANA</span>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-500 hover:text-indigo-500 transition-colors duration-200">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-500 transition-colors duration-200">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-500 transition-colors duration-200">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-500 transition-colors duration-200">
              <Linkedin className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-500 hover:text-indigo-500 transition-colors duration-200">
              <GitHub className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} YANA. All rights reserved.
          </p>
          <div className="flex items-center text-sm text-gray-500">
            <Mail className="h-4 w-4 mr-2" />
            <a href="mailto:hello@yana.community" className="hover:text-indigo-500 transition-colors duration-200">
              hello@yana.community
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default InnerPageFooter;
