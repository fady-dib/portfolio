import React, { useEffect, useRef } from 'react';
import SplitType from 'split-type';
import gsap from "gsap";
import ScrollTrigger from 'gsap/ScrollTrigger';

const About = ({ portfolio }) => {
    const sectionsRef = useRef([]);
    const visitedSectionsRef = useRef(new Set());

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        runSplit();

        setupDynamicNumbers();

        setTimeout(() => {
            setupDynamicNumbers();
        }, 100);

        const handleScroll = () => {
            setupDynamicNumbers();
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    },); 

    const isInViewport = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight && rect.bottom > 0
        );
    };

    const setupDynamicNumbers = () => {
        sectionsRef.current.forEach((section) => {
            if (section && isInViewport(section) && !visitedSectionsRef.current.has(section)) {
                const dynamicNumberElement = section.querySelector('.dynamic-number');

                if (dynamicNumberElement && dynamicNumberElement.childElementCount === 0) {
                    const startNum = parseInt(dynamicNumberElement.getAttribute('data-number'), 10);
                    setup(startNum, dynamicNumberElement);
                    visitedSectionsRef.current.add(section);
                }
            }
        });
    };

    const setup = (startNum, element) => {
        const digits = startNum.toString().split('');

        element.innerHTML = '';

        digits.forEach((digit) => {
            addDigit(digit, element);
        });

        scrollNumber(['9'], element);

        setTimeout(() => scrollNumber(digits, element), 1);
    };

    const addDigit = (digit, element) => {
        const spanList = Array.from({ length: 10 }, (_, j) => `<span>${j}</span>`).join('');
        element.insertAdjacentHTML(
            'beforeend',
            `<span style="transform: translateY(-1000%)" data-value="${digit}">${spanList}</span>`
        );
    };

    const scrollNumber = (digits, element) => {
        element.querySelectorAll('span[data-value]').forEach((tick, i) => {
            tick.style.transition = 'transform 2.5s cubic-bezier(0.35, 0.1, 0.15, 1)';
            tick.style.transform = `translateY(-${100 * parseInt(digits[i])}%)`;
        });

        element.style.width = `${digits.length * 52}px`;
    };

    const runSplit = () => {
        new SplitType('.split-lines', { types: 'lines, words' });

        document.querySelectorAll('.line').forEach((line) => {
            const lineMask = document.createElement('div');
            lineMask.classList.add('line-mask');
            line.appendChild(lineMask);
        });

        createLineAnimation();
    };

    const createLineAnimation = () => {
        document.querySelectorAll('.line').forEach((line) => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: line,
                    start: 'top bottom-=15%',
                    end: 'bottom center',
                    scrub: 1
                }
            });
            tl.to(line.querySelector('.line-mask'), {
                width: '0%',
                duration: 1
            });
        });
    };

    return (
        <div className="pt-20 pb-4 text-white">
            <div className="container mx-auto">
                <div className="flex flex-wrap justify-center">
                    {portfolio.map((item, index) => (
                        <div
                            key={index}
                            className="w-full md:w-2/4 lg:w-2/4 xl:w-1/3 py-4 md:px-5 flex justify-center"
                            ref={(el) => (sectionsRef.current[index] = el)}
                        >
                            <div className="bg-[#204958] p-5 w-full flex min-h-[370px] flex-col justify-start rounded-lg">
                                <p className="text-[#bbe8c8] text-2xl">{item.title}</p>
                                <div className="n-scroll">
                                    <h3 className="pb-20">
                                        <span id="number" data-number={item.number} className="dynamic-number"></span>
                                        <span>+</span>
                                    </h3>
                                </div>
                                <p className="text-white text-lg split-lines mr-5">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
