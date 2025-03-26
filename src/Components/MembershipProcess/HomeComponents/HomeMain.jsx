import Article from "./Article"
import Header from "./Header"
import LeftBar from "./LeftBar"
import { useUserContext } from "@/Context/UserContext";
import AddUsername from "./AddUsername";

const HomeMain = () => {

    const { userNew } = useUserContext;

    

    return(
        <>
            {!userNew ?
            <> 
                <AddUsername />
            </> : 
            <>
                <Header />
                <div className="flex">
                    <LeftBar />
                    <Article />
                </div>
            </>}
        </>
    )
}

export default HomeMain