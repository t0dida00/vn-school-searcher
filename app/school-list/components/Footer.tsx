import React from 'react';

const Footer: React.FC = () => (
    <footer className='text-center p-4 bg-white border border-t-[#f3f3f3]' >
        <small>
            &copy; {new Date().getFullYear()} Khoa Dinh. All rights reserved.
        </small>
    </footer>
);

export default Footer;