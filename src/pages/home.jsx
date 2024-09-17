import Portfolio from "../components/Portfolio/Portfolio";
import {portfolio} from "../utils/data"
function home() {

    const handleProjectsClick = () => {
        console.log(1)
    }

    return (
        <>
            <section id="home" className="common-bg ">
                <div className="shadow-md shadow-gray-300 z-1000 bg-white">
                    <header className="flex justify-between items-center py-5 lato-bold text-[20px] container mx-auto px-5">
                        <div className="flex items-center">
                            <img src="images/fady_portfolio.svg" className="h-[72px] w-[72px] rounded-full object-cover"></img>
                            <p className="pl-5">Fady Dib</p>
                        </div>
                        <div className="flex gap-16 text-[16px]">
                            <p>HOME</p>
                            <p>ABOUT</p>
                            <p>PROJECTS</p>
                            <p>CONTACT</p>
                        </div>
                    </header>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className=" flex flex-col justify-center items-center pt-60 pb-48">
                        <p className="lato-black text-[60px] leading-none">HEY, I'M FADY DIB</p>
                        <p className="text-center max-w-[800px] text-[22px] py-12">A Result-Oriented Web Developer building and managing Websites and Web Applications that lead to the success of the overall product</p>
                        <button className=" bg-[#7843E9] duration-700 hover:-translate-y-1 lato-black text-white py-4 px-20 rounded text-[20px]" onClick={handleProjectsClick()}>PROJECTS</button>
                    </div>
                    <div className="py-16">
                        <div className="mouse">
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default home;
