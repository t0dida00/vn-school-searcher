import React from 'react';
import { Globe } from 'lucide-react';
import Link from 'next/link';

interface CustomLinkProps {
    url?: string;
    shortUrl?: string; // Optional, if you want to display a different text
}

const CustomLink: React.FC<CustomLinkProps> = ({ url, shortUrl }) => {
    if (!url) return null;

    return (
        <div>
            <Globe className="inline mr-1" size={20} />
            <Link href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {shortUrl}
            </Link>
        </div>
    );
};

export default CustomLink;
