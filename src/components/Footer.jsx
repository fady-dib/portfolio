import React from 'react';

import linkedin from '../assets/images/linkedin-ico.png'
import github from '../assets/images/github-ico.png'


const Footer = () => {
    const current_year = new Date().getFullYear();
    return (
        <footer className="bg-[#1F4959] text-white pt-16">
            <div className="container mx-auto px-5 ">
                <div className='flex flex-col md:flex-row md:justify-between'>
                    <div className='w-4/5 md:w-2/5 '>
                        <h2 className="text-xl inter-bold">FADY DIB</h2>
                        <p className="mt-5 text-sm">
                            Building scalable, high-performing, and user-centric web solutions that drive innovation, and contribute to business success
                        </p>
                    </div>
                    <div className='mt-10 md:mt-0'>
                        <h2 className="text-xl inter-bold">CONNECT WITH ME</h2>
                        <div className='flex space-x-2 mt-5'>
                            <a
                                href="https://www.linkedin.com/in/fady-dib"
                                className="hover:text-gray-400"
                                aria-label="LinkedIn"
                            >
                                <img
                                    src={linkedin}
                                    className="w-[30px] h-[30px]"
                                    alt="Linkedin"
                                    loading="lazy"
                                />
                            </a>
                            <a
                                href="https://github.com/fady-dib"
                                className="hover:text-gray-400"
                                aria-label="GitHub"
                            >
                                <img
                                    src={github}
                                    className="w-[30px] h-[30px]"
                                    alt="Github"
                                    loading="lazy"
                                />
                            </a>
                        </div>
                    </div>
                </div>
              
                <p className="text-xs mt-14 text-center border-t border-white py-14">
                    &copy; Copyright {current_year}. Made by <span className="font-semibold">FADY DIB</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
