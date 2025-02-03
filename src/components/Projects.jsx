import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Projects = ({ projects }) => {
    const [groupSize, setGroupSize] = useState(6);

    useEffect(() => {
        const updateGroupSize = () => {
            const width = window.innerWidth;
            if (width >= 1280) {
                setGroupSize(6); 
            } else if (width >= 1024) {
                setGroupSize(4); 
            } else if (width >= 768) {
                setGroupSize(2); 
            } else {
                setGroupSize(1); 
            }
        };

        updateGroupSize();
        window.addEventListener('resize', updateGroupSize);
        return () => window.removeEventListener('resize', updateGroupSize);
    }, []);

    
    const groupedProjects = [];
    for (let i = 0; i < projects.length; i += groupSize) {
        groupedProjects.push(projects.slice(i, i + groupSize));
    }

    const sliderSettings = {
        autoplay: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    return (
        <div className="projects-container pt-20 mx-auto px-5 container">
            <Slider {...sliderSettings} className="slider">
                {groupedProjects.map((group, groupIndex) => (
                    <div key={groupIndex} className="slide-group flex flex-col items-center">
                        <div className={`grid gap-16 
                            ${groupSize >= 6 ? 'grid-cols-3' :
                                groupSize >= 4 ? 'grid-cols-2' :
                                    'grid-cols-1'}
                        `}>
                            {group.map((project, index) => (
                                <div
                                    key={index}
                                    className="project-item w-[280px] sm:w-[350px] h-[320px] flex flex-col bg-white rounded-lg shadow-lg items-center justify-center pt-2 cursor-pointer">

                                    <div className="w-[280px] h-[250px] flex items-center justify-center rounded-md overflow-hidden">
                                        {project.url ? (
                                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={project.image}
                                                    className="max-w-full max-h-full object-contain p-2 transition-all duration-700 ease-in-out hover:scale-110"
                                                    alt={project.title}
                                                    loading="lazy"
                                                />
                                            </a>
                                        ) : (
                                            <img
                                                src={project.image}
                                                className="max-w-full max-h-full object-contain p-2"
                                                alt={project.title}
                                                loading="lazy"
                                            />
                                        )}
                                    </div>
                                    <div className="w-full bg-[#CDF8C9] flex items-center justify-center py-5 rounded-b-lg">
                                        <p className="text-center text-base font-semibold text-[#1F4959]">{project.title}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Projects;
