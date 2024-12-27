
import About from "../components/About";
import Projects from "../components/Projects";
import {portfolio,skills,projects} from "../utils/data"
import React, { useState } from 'react';
import logo from '../assets/images/fady_portfolio_2.png'
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
                <div className="shadow-md shadow-gray-400 z-1000 bg-[#214655] relative text-white">
                    <header className="flex justify-between items-center py-5 inter-bold text-[20px] container mx-auto px-5">
                        <div className="flex items-center">
                            <img src={logo} className="h-[72px] w-[72px] rounded-full object-cover" alt="LOGO"></img>
                            <p className="pl-5">FADY DIB</p>
                        </div>
                        <div className="hidden lg:flex gap-16 text-[16px]">
                            <p onClick={() => window.location.reload()} className="cursor-pointer relative group hover:text-[#b8e4c3] transition-all duration-500">HOME <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#b8e4c3] transition-all duration-500 group-hover:w-full"></span></p>
                            <p onClick={() => scrollToSection('about')} className="cursor-pointer relative group hover:text-[#b8e4c3]" >ABOUT <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#b8e4c3] transition-all duration-500 group-hover:w-full"></span></p>
                            <p onClick={() => scrollToSection('projects')} className="cursor-pointer relative group hover:text-[#b8e4c3]" >PROJECTS <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#b8e4c3] transition-all duration-500 group-hover:w-full"></span></p>
                            <p onClick={() => scrollToSection('contact')} className="cursor-pointer relative group hover:text-[#b8e4c3]">CONTACT <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#b8e4c3] transition-all duration-500 group-hover:w-full"></span></p>
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
                        <div className="absolute top-[110px] left-0 right-0 lg:hidden flex flex-col items-center gap-4 bg-white py-4 text-[16px] shadow-lg z-50 text-[#214959]">
                            <p onClick={() => window.location.reload()} className="cursor-pointer">HOME</p>
                            <p onClick={() => scrollToSection('about')} className="cursor-pointer">ABOUT</p>
                            <p onClick={() => scrollToSection('projects')} className="cursor-pointer">PROJECTS</p>
                            <p onClick={() => scrollToSection('contact')} className="cursor-pointer">CONTACT</p>
                        </div>
                    )}
                </div>
                {/* <div className="flex flex-col justify-center items-center mx-auto px-5 container "> */}
                <div className="pt-52 pb-48 mx-auto container">
                    <div className="max-w-[590px] max-h-[469px] rounded-[60px] bg-[#2B4A4D] opacity-[62%] mr-10">
                        {/* <div className=" flex flex-col justify-center  pt-52 pb-48 text-[#1f4958] mx-auto px-5 container"> */}
                        <div className="text-white">
                                <p className="inter-black text-[22px] leading-none">HEY, I'M</p>
                                <p className="inter-black text-[60px] leading-none pt-6">FADY DIB</p>
                                <p className="max-w-[800px] text-[22px] py-12">A Result-Oriented Web Developer building and managing Websites and Web Applications that lead to the success of the overall product</p>
                            <button className=" bg-[#204958] duration-700 hover:-translate-y-1 inter-black text-white py-4 rounded text-[20px] w-[200px] text-center" onClick={() => scrollToSection('projects')}>PROJECTS</button>
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
                    {/* <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 pt-20"> */}
                        {/* <div className="lg:col-span-6"> */}
                            {/* <p className="inter-bold text-[30px]">Get to know me!</p> */}
                            <div className="text-[#1f4958] text-[18px]">
                                <p className="pt-10 mb-5">I am a <span className="inter-bold">Full Stack Web Developer</span> with a focus on building and managing both the front-end and back-end of websites and web applications, contributing to the overall success of the product. Check out some of my work in the <span className="inter-bold">Projects</span> section.</p>
                                <p>Feel free to connect or follow me on LinkedIn and Github. I'm open to <span className="inter-bold">job</span> opportunities where I can contribute, learn, and grow. If you have a role that aligns with my skills and experience, don't hesitate to <span className="inter-bold">reach out.</span></p>
                            </div>
                        {/* </div> */}
                    {/* </div> */}
                    {/* <p className="text-[#555] text-center pt-4 text-[20px] max-w-[700px] mx-auto">Here you will find more information about me, what I do, and my current skills mostly in terms of programming and technology</p> */}
                    <About portfolio={portfolio}></About>
                    {/* <div className="lg:col-span-6"> */}
                    <p className="inter-bold text-[22px] text-[#1f4958]">My skills</p>
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
                    {/* </div> */}
                   
                </div>
            </section>
            <section id="projects" className="pt-16 pb-20 bg-[#fffff]">
                <div className="mx-auto px-5 container">
                    <p className="inter-black text-[35px] relative pb-4">PROJECTS <span className="underline-part"></span></p>
                    <p className="text-[#555] pt-4 text-[20px] max-w-[700px]">Here you will find some of the projects that I worked on</p>
                </div>
                <Projects projects={projects}></Projects>
            </section>
            <section id="contact" className="pt-16 pb-20">
                <div className="mx-auto px-5 container">
                    <p className="inter-black text-[35px] relative pb-4 text-[#1f4958]">CONTACT <span className="underline-part"></span></p>
                    <p className="text-[#555] pt-4 text-[20px] max-w-[700px] ">Feel free to Contact me by submitting the form below and I will get back to you as soon as possible</p>
                </div>
                <Contact></Contact>
            </section>
            <Footer></Footer>
        </>
    )
}

export default Home;
