import React from 'react';

import linkedin from '../assets/images/linkedin-ico.png'
import github from '../assets/images/github-ico.png'


const Footer = () => {
    const current_year = new Date().getFullYear();
    return (
        <footer className="bg-black text-white pt-20">
            <div className="container mx-auto px-5 ">
                <div className='flex flex-col md:flex-row md:justify-between'>
                    <div className=' w-1/2 '>
                        <h2 className="text-xl lato-bold">FADY DIB</h2>
                        <p className="mt-5 text-sm">
                            A Result-Oriented Web Developer building and managing Websites and Web Applications that lead to the success of the overall product
                        </p>
                    </div>
                    <div className='mt-10 md:mt-0'>
                        <h2 className="text-xl lato-bold">CONNECT WITH ME</h2>
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
                                />
                            </a>
                        </div>
                    </div>
                </div>
              
                <p className="text-xs mt-20 text-center border-t border-[#444] py-10">
                    &copy; Copyright {current_year}. Made by <span className="font-semibold">FADY DIB</span>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
