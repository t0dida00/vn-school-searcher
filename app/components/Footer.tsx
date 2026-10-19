import React from 'react';

const Footer: React.FC = () => (
    <footer className='text-center px-4 py-1.5 bg-white border-t border-[#f3f3f3]' >
        <small className='text-xs leading-none'>
            &copy; {new Date().getFullYear()} Khoa Dinh. All rights reserved.
        </small>
    </footer>
);

export default Footer;