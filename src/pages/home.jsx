
import About from "../components/About";
import Projects from "../components/Projects";
import {portfolio,skills,projects} from "../utils/data"
import React, { useState } from 'react';
import logo from '../assets/images/fady_portfolio_2.webp'
import menu from '../assets/images/icons8-hamburger.svg'
import close_icon from '../assets/images/icons8-close.svg'
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function Home() {

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100); 
        }
        setIsMenuOpen(false);
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <section id="home" className="common-bg ">
                <div className="shadow-md shadow-gray-400 z-1000 bg-[#214655] relative text-white">
                    <header className="flex justify-between items-center py-5 text-[20px] container mx-auto px-5">
                        <div className="flex items-center">
                            <img src={logo} className="h-[72px] w-[72px] rounded-full object-cover" alt="LOGO" ></img>
                            <p className="pl-5 inter-bold">FADY DIB</p>
                        </div>
                        <div className="hidden lg:flex gap-16 text-[16px] ">
                            <p onClick={() => window.location.reload()} className="cursor-pointer relative group hover:text-[#b8e4c3] transition-all duration-500 inter-medium">HOME <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#b8e4c3] transition-all duration-500 group-hover:w-full"></span></p>
                            <p onClick={() => scrollToSection('about')} className="cursor-pointer relative group hover:text-[#b8e4c3] inter-medium" >ABOUT <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#b8e4c3] transition-all duration-500 group-hover:w-full"></span></p>
                            <p onClick={() => scrollToSection('projects')} className="cursor-pointer relative group hover:text-[#b8e4c3] inter-medium" >PROJECTS <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#b8e4c3] transition-all duration-500 group-hover:w-full"></span></p>
                            <p onClick={() => scrollToSection('contact')} className="cursor-pointer relative group hover:text-[#b8e4c3] inter-medium">CONTACT <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#b8e4c3] transition-all duration-500 group-hover:w-full"></span></p>
                        </div>
                        <div className="lg:hidden">
                            <button onClick={toggleMenu} className="focus:outline-none">
                                { isMenuOpen ? (
                                    <img src={close_icon} alt="CLOSE MENU" className="h-[35px] w-[35px] transition-transform duration-500 ease-in-out rotate-180" loading="lazy" />
                                ) 
                                : 
                                    (<img src={menu} alt="BURGER MENU" className="h-[35px] w-[35px] transform transition-transform duration-500 ease-in-out rotate-0" loading="lazy"></img> )
                                } 
                            </button>
                        </div>
                    </header>
                    <div className={`absolute top-[110px] left-0 right-0 lg:hidden flex flex-col items-start custom:items-center bg-white text-[16px] shadow-lg z-50 text-[#214959]
                            transition-all duration-500 ease-in-out transform ${isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                        <p onClick={() => window.location.reload()} className="cursor-pointer inter-medium w-full pl-6 custom:w-auto custom:pl-0 custom:hover:bg-white h-[60px] flex items-center hover:opacity-55 hover:bg-gray-100 transition-all duration-300 border-b border-gray-200 custom:border-none">HOME</p>
                        <p onClick={() => scrollToSection('about')} className="cursor-pointer inter-medium w-full pl-6 custom:w-auto custom:pl-0 custom:hover:bg-white h-[60px] flex items-center hover:opacity-55 hover:bg-gray-100 transition-all duration-300 border-b border-gray-200 custom:border-none">ABOUT</p>
                        <p onClick={() => scrollToSection('projects')} className="cursor-pointer inter-medium w-full pl-6 custom:w-auto custom:pl-0 custom:hover:bg-white h-[60px] flex items-center hover:opacity-55 hover:bg-gray-100 transition-all duration-300 border-b border-gray-200 custom:border-none">PROJECTS</p>
                        <p onClick={() => scrollToSection('contact')} className="cursor-pointer inter-medium w-full pl-6 custom:w-auto custom:pl-0 custom:hover:bg-white h-[60px] flex items-center hover:opacity-55 hover:bg-gray-100 transition-all duration-300">CONTACT</p>
                    </div>
                </div>
                <div className="pt-20 pb-24 md:pt-40 md:pb-48 mx-auto container px-5">
                    <div className="max-w-full md:max-w-[590px] lg:max-h-[469px] rounded-[40px] bg-[#2B4A4D] bg-opacity-[62%] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] border-2 border-[#CDF8C9]">
                        <div className="text-white px-6 py-8 md:mx-10 md:py-10 text-center md:text-left">
                            <p className="inter-black text-[28px] md:text-[35px] leading-none">HEY, I'M</p>
                            <p className="inter-black text-[40px] md:text-[60px] leading-none pt-4 md:pt-6">FADY DIB</p>
                            <p className="md:max-w-md text-[16px] md:text-[20px] py-6 md:py-12 ">
                                A Result-Oriented Web Developer building and managing Websites and Web Applications that lead to the success of the overall product.
                            </p>
                            <button
                                className="bg-[#1F4959] duration-700 hover:-translate-y-1 hover:bg-[#1A3641] hover:font-bold hover:text-[#CDF8C9] inter-medium text-white py-4 rounded-[12px] border-2 border-[#CDF8C9] text-[16px] md:text-[20px] w-full max-w-[250px] "
                                onClick={() => scrollToSection('projects')}
                            >
                                PROJECTS
                            </button>
                        </div>
                    </div>
                </div>

                    {/* <div className="py-16">
                        <div className="mouse">
                        </div>
                    </div> */}
                {/* </div> */}
            </section>
            <section id="about" className="pt-16 pb-20">
                <div className="mx-auto px-5 container">
                    <p className="inter-black text-[35px] relative pb-4 text-[#1f4958]">ABOUT ME <span className="underline-part"></span></p>
                    <div className="text-[#1f4958] text-[20px] max-w-4xl">
                                <p className="pt-10 mb-5">I am a <span className="inter-bold">Full Stack Web Developer</span> with a focus on building and managing both the front-end and back-end of websites and web applications, contributing to the overall success of the product. Check out some of my work in the <span className="inter-bold">Projects</span> section.</p>
                                <p>Feel free to connect or follow me on LinkedIn and Github. I'm open to <span className="inter-bold">job</span> opportunities where I can contribute, learn, and grow. If you have a role that aligns with my skills and experience, don't hesitate to <span className="inter-bold">reach out.</span></p>
                            </div>
                    <About portfolio={portfolio}></About>
                    <p className="inter-bold text-[25px] text-[#1f4958] mt-8">My skills</p>
                    <div className="flex flex-wrap gap-4 pt-10 max-w-4xl">
                        {skills.map((skill, index) => (
                            <div
                                key={index}
                                className="bg-[#E0F5FF] border border-[#32819F] text-[#1F4959] text-center py-2 px-4 rounded-lg shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#32819F] hover:to-[#1F4959] hover:text-white hover:shadow-lg"
                            >
                                {skill}
                            </div>
                        ))}
                    </div>

                </div>
            </section>
            <section id="projects" className="pt-16 pb-20 common-bg-2">
                <div className="mx-auto px-5 container">
                    <p className="inter-black text-[35px] relative pb-4 text-white">PROJECTS <span className="underline-part-white"></span></p>
                    <p className="text-white pt-4 text-[20px] max-w-[700px]">Here are some projects I contributed to during my employment</p>
                </div>
                <Projects projects={projects}></Projects>
            </section>
            <section id="contact" className="pt-16 pb-20">
                <div className="mx-auto px-5 container">
                    <p className="inter-black text-[35px] relative pb-4 text-[#1f4958]">CONTACT <span className="underline-part"></span></p>
                    <p className="text-[#1F4959] pt-4 text-[20px] max-w-[700px] ">Feel free to Contact me by submitting the form below and I will get back to you as soon as possible</p>
                </div>
                <Contact></Contact>
            </section>
            <a
                href="https://wa.me/96170544067"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-3 left-2 bg-[#25D366] p-3 md:p-4 rounded-full shadow-lg hover:bg-[#1EBE5F] transition duration-700 hover:-translate-y-1 z-10"
            >
                <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-8 w-8 md:h-10 md:w-10" loading="lazy" />
            </a>
            <Footer></Footer>
        </>
    )
}

export default Home;
