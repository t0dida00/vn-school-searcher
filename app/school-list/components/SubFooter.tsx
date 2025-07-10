import { Mail } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const SubFooter: React.FC = () => {
    return (
        <div className="flex flex-col sm:flex-row items-start gap-2 mb-20">
            <div className="flex-1"><div className='text-lg font-semibold mb-2'>About us</div>
                <p>The FinUnies is designed to help students easily find information about universities in Finland.</p>
            </div>
            <div className="flex-1"><div className='text-lg font-semibold  mb-2'>Contact</div>
                <div>
                    <Mail className='cursor-pointer'></Mail>
                </div>
            </div>
            <div className="flex-1"><div className='text-lg font-semibold mb-2'>
                Links</div>
                <div>
                    <Link href="/map" target="_blank" rel="noopener noreferrer" className="hover:underline ">
                        Feedback for the website
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default SubFooter;