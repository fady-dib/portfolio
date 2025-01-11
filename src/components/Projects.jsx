import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Projects = ({ projects }) => {
    const sliderSettings = {
        autoplay: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
    };

    const groupedProjects = [];
    for (let i = 0; i < projects.length; i += 6) {
        groupedProjects.push(projects.slice(i, i + 6));
    }

    return (
        <div className="projects-container pt-20 mx-auto px-5 container">
            <Slider {...sliderSettings} className="slider">
                {groupedProjects.map((group, groupIndex) => (
                    <div key={groupIndex} className="slide-group flex flex-col">
                        <div className="row flex justify-center mb-4">
                            {group.slice(0, 3).map((project, index) => (
                                <div
                                    key={index}
                                    className="project-item w-[441px] h-[320px] flex flex-col m-6 bg-white rounded-[15px] items-center justify-center "
                                >
                                    <div className="image-wrapper">
                                        {project.url ? (
                                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={project.image}
                                                    className="w-[256px] h-[256px] object-contain carousel-item"
                                                    alt={project.title}
                                                />
                                            </a>
                                        ) : (
                                            <img
                                                src={project.image}
                                                className="w-full h-full object-scale-down carousel-item"
                                                alt={project.title}
                                            />
                                        )}
                                    </div>
                                    <p className="mt-2 text-center">{project.title}</p>
                                </div>
                            ))}
                        </div>
                        <div className="row flex justify-center">
                            {group.slice(3, 6).map((project, index) => (
                                <div
                                    key={index}
                                    className="project-item w-64 h-64 flex flex-col m-2"
                                >
                                    <div className="image-wrapper">
                                        {project.url ? (
                                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={project.image}
                                                    className="w-full h-full object-scale-down carousel-item"
                                                    alt={project.title}
                                                />
                                            </a>
                                        ) : (
                                            <img
                                                src={project.image}
                                                className="w-full h-full object-scale-down carousel-item"
                                                alt={project.title}
                                            />
                                        )}
                                    </div>
                                    <p className="mt-2 text-center">{project.title}</p>
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