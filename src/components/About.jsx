import React, { useEffect, useRef, useState } from 'react';
// import SplitType from 'split-type';
import gsap from "gsap";
// import { useGSAP } from "@gsap/react";
import ScrollTrigger from 'gsap/ScrollTrigger';



const About = ({ portfolio }) => {
    const sectionsRef = useRef([]);
    const [setupStatusMap, setSetupStatusMap] = useState(new Map());

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        runSplit();
        const handleScroll = () => {
            setupDynamicNumbers();
        };

        window.addEventListener('scroll', handleScroll);
        setupDynamicNumbers();

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [setupStatusMap]);

    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const setupDynamicNumbers = () => {
        sectionsRef.current.forEach((section, index) => {
            if (isInViewport(section) && !setupStatusMap.has(section)) {
                const dynamicNumberElement = section.querySelector('.dynamic-number');

                if (dynamicNumberElement.childElementCount === 0) {
                    const startNum = parseInt(dynamicNumberElement.getAttribute('data-number'));
                    setup(startNum, dynamicNumberElement);

                    setSetupStatusMap((prevMap) => new Map(prevMap.set(section, true)));
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
        // const typeSplit = new SplitType('.split-lines', {
        //     types: 'lines, words'
        // });

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
        <div className="pt-20 pb-4 bg-gray-100 text-white">
            <div className="container mx-auto">
                <div className="flex flex-wrap justify-center">
                    {portfolio.map((item, index) => (
                        <div
                            key={index}
                            className="w-full md:w-1/2 lg:w-1/3 p-4 flex justify-center"
                            ref={(el) => (sectionsRef.current[index] = el)}
                        >
                            <div className="bg-gray-800 p-5 w-full">
                                <p className="text-gray-500 text-2xl">{item.title}</p>
                                <div className="n-scroll">
                                    <h3 className="mt-4 mb-5 pb-5">
                                        <span id="number" data-number={item.number} className="dynamic-number"></span>
                                        <span>+</span>
                                    </h3>
                                </div>
                                <p className="pl-5 ml-4 text-gray-500 text-lg split-lines">{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
