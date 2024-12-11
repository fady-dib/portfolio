import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import arrow_left from '../assets/images/left-arrow-back-svgrepo-com.svg'
import arrow_right from '../assets/images/right-arrow-next-svgrepo-com.svg'


const Projects = ({projects}) => {

   const SamplePrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`} >
                <img src={arrow_left} className='arrows' alt="ARROW LEFT"></img>
            </div>
        )
    }

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div onClick={onClick} className={`arrow ${className}`} >
                <img src={arrow_right} className='arrows' alt="ARROW RIGHT"></img>
            </div>
        )
    }

    const sliderSettings = {
        autoplay: false,
        dots: true,
        arrows: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow to="next" />,
        prevArrow: <SamplePrevArrow to="prev" />,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    arrows: false
                },
            },
            {
                breakpoint: 1050,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true,
                    arrows: false
                },
            },
            {
                breakpoint: 650,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false

                },
            },
        ],
    };

  return (
    <>
          <Slider {...sliderSettings} className="slider flex flex-wrap justify-center items-center mb-5 pr-4 pt-20 mx-auto px-5 container">
              {projects.map((project,index) => (
                  <div key={index} className={`item custom:px-6 flex flex-col`}>
                      <div className="w-64 h-64">
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
                      <p className="mt-2">{project.title}</p>

                  </div>
              ))}
          </Slider>
    </>
  )
}

export default Projects
