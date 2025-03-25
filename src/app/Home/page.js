import Header from "../../Components/MembershipProcess/HomeComponents/Header"
import LeftBar from "../../Components/MembershipProcess/HomeComponents/LeftBar"

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