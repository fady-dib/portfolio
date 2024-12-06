import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Projects = ({projects}) => {

    const sliderSettings = {
        autoplay: true,
        dots: true,
        arrows: false,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: false,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    variableWidth: false,
                },
            },
        ],
    };

  return (
    <>
          <Slider {...sliderSettings} className="slider flex flex-wrap justify-center items-center mb-5 pr-4 pt-20 mx-auto px-5 container">
              {projects.map((project,index) => (
                  <div key={index} className={`item custom:pl-6 flex flex-col`}>
                      <div className="w-full aspect-w-16 aspect-h-12">
                      {project.url ? (
                          <a href={project.url} target="_blank" rel="noopener noreferrer">
                              <img
                                src={project.image}
                                className="w-full h-full object-cover carousel-item"
                                alt={project.title}
                              />
                          </a>
                      ) : (
                          <img
                            src={project.image}
                            className="w-full h-full object-cover carousel-item"
                            alt={project.title}
                          />
                      )}
                      </div>
                      <p className="mt-2">{project.title}</p>

                  </div>
              ))}
          </Slider>
    </>
  )
}

export default Projects
