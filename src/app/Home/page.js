import Header from "./HomeComponents/Header"
import LeftBar from "./HomeComponents/LeftBar"

const Home = () => {
    return(
        <>
            <Header />
            <div className="flex">
                <LeftBar />
            </div>
        </>
    )
}

export default Home