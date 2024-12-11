
import About from "../components/About";
import Projects from "../components/Projects";
import {portfolio,skills,projects} from "../utils/data"
import React, { useState } from 'react';
import logo from '../assets/images/fady_portfolio.svg'
import menu from '../assets/images/icons8-hamburger.svg'
import close_icon from '../assets/images/icons8-close.svg'
import Contact from "../components/Contact";
import Footer from "../components/Footer";

function Home() {

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId); 
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' }); 
        }
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            <section id="home" className="common-bg ">
                <div className="shadow-md shadow-gray-300 z-1000 bg-white relative">
                    <header className="flex justify-between items-center py-5 lato-bold text-[20px] container mx-auto px-5">
                        <div className="flex items-center">
                            <img src={logo} className="h-[72px] w-[72px] rounded-full object-cover" alt="LOGO"></img>
                            <p className="pl-5">FADY DIB</p>
                        </div>
                        <div className="hidden lg:flex gap-16 text-[16px]">
                            <p onClick={() => window.location.reload()} className="cursor-pointer">HOME</p>
                            <p onClick={() => scrollToSection('about')} className="cursor-pointer" >ABOUT</p>
                            <p onClick={() => scrollToSection('projects')} className="cursor-pointer" >PROJECTS</p>
                            <p onClick={() => scrollToSection('contact')} className="cursor-pointer">CONTACT</p>
                        </div>
                        <div className="lg:hidden">
                            <button onClick={toggleMenu} className="focus:outline-none">
                                { isMenuOpen ? (
                                    <img src={close_icon} alt="CLOSE MENU" className="h-[35px] w-[35px] transition-transform duration-300 ease-in-out rotate-180" />
                                ) 
                                : 
                                    (<img src={menu} alt="BURGER MENU" className="h-[35px] w-[35px] transform transition-transform duration-300 ease-in-out rotate-0"></img> )
                                } 
                            </button>
                        </div>
                    </header>
                    {isMenuOpen && (
                        <div className="absolute top-[110px] left-0 right-0 lg:hidden flex flex-col items-center gap-4 bg-white py-4 text-[16px] shadow-lg z-50">
                            <p onClick={() => window.location.reload()} className="cursor-pointer">HOME</p>
                            <p onClick={() => scrollToSection('about')} className="cursor-pointer">ABOUT</p>
                            <p onClick={() => scrollToSection('projects')} className="cursor-pointer">PROJECTS</p>
                            <p onClick={() => scrollToSection('contact')} className="cursor-pointer">CONTACT</p>
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-center items-center mx-auto px-5 container">
                    <div className=" flex flex-col justify-center items-center pt-60 pb-48">
                        <p className="lato-black text-[60px] leading-none text-center">HEY, I'M FADY DIB</p>
                        <p className="text-center max-w-[800px] text-[22px] py-12">A Result-Oriented Web Developer building and managing Websites and Web Applications that lead to the success of the overall product</p>
                        <button className=" bg-[#7843E9] duration-700 hover:-translate-y-1 lato-black text-white py-4 px-20 rounded text-[20px]" onClick={() => scrollToSection('projects')}>PROJECTS</button>
                    </div>
                    <div className="py-16">
                        <div className="mouse">
                        </div>
                    </div>
                </div>
            </section>
            <section id="about" className="pt-16 pb-20 bg-gray-100 ">
                <div className="mx-auto px-5 container">
                    <p className="lato-black text-center text-[35px] relative pb-4">ABOUT ME <span className="underline-part"></span></p>
                    <p className="text-[#555] text-center pt-4 text-[20px] max-w-[700px] mx-auto">Here you will find more information about me, what I do, and my current skills mostly in terms of programming and technology</p>
                    <About portfolio={portfolio}></About>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 pt-20">
                        <div className="lg:col-span-6">
                            <p className="lato-bold text-[30px]">Get to know me!</p>
                            <div className="text-[#666] text-[18px]">
                                <p className="pt-10 mb-5">I am a <span className="lato-bold">Full Stack Web Developer</span> with a focus on building and managing both the front-end and back-end of websites and web applications, contributing to the overall success of the product. Check out some of my work in the <span className="lato-bold">Projects</span> section.</p>
                                <p>Feel free to connect or follow me on LinkedIn and Github. I'm open to <span className="lato-bold">job</span> opportunities where I can contribute, learn, and grow. If you have a role that aligns with my skills and experience, don't hesitate to <span className="lato-bold">reach out.</span></p>
                            </div>
                        </div>
                        <div className="lg:col-span-6">
                            <p className="lato-bold text-[30px]">My skills</p>
                            <div className="flex flex-wrap gap-4 pt-10">
                                {skills.map((skill, index) => (
                                    <div
                                        key={index}
                                        className="bg-gray-200 text-center py-2 px-4 rounded-lg shadow-md"
                                    >
                                        {skill}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="projects" className="pt-16 pb-20 bg-[#fffff]">
                <div className="mx-auto px-5 container">
                    <p className="lato-black text-center text-[35px] relative pb-4">PROJECTS <span className="underline-part"></span></p>
                    <p className="text-[#555] text-center pt-4 text-[20px] max-w-[700px] mx-auto">Here you will find some of the projects that I worked on</p>
                </div>
                <Projects projects={projects}></Projects>
            </section>
            <section id="contact" className="pt-16 pb-20 common-bg">
                <div className="mx-auto px-5 container">
                    <p className="lato-black text-center text-[35px] relative pb-4">CONTACT <span className="underline-part"></span></p>
                    <p className="text-[#555] text-center pt-4 text-[20px] max-w-[700px] mx-auto">Feel free to Contact me by submitting the form below and I will get back to you as soon as possible</p>
                </div>
                <Contact></Contact>
            </section>
            <Footer></Footer>
        </>
    )
}

export default Home;
