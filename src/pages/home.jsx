function home() {
    const handleProjectsClick = () => {
        console.log(1)
    }
    return (
        <>
            <div className="shadow-md shadow-gray-100">
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
            <section id="home" className="common-bg">
                <div className="text-center">
                    <p>HEY, I'M FADY DIB</p>
                    <p>A Result-Oriented Web Developer building and managing Websites and Web Applications that leads to the success of the overall product</p>
                    <button onClick={handleProjectsClick()}>PROJECTS</button>
                </div>
            </section>
        </>
    )
}

export default home;
