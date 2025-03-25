import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const LogSender = ({logs,mail,category,triggerOpen}) => {

    const supabaseUrl = process.env.NEXT_PUBLIC_DBURL;
    const supabaseKey = process.env.NEXT_PUBLIC_DBKEY;

    const supabase = createClient(supabaseUrl,supabaseKey);

    const [isOkState,setIsOkState] = useState(0);

    useEffect(() => {
        setIsOkState(0);
    }, [isOkState])

    useEffect(() => {
        if(triggerOpen == 1){
            sendLog();
        }
    }, [triggerOpen])

    const sendLog = async () => {
        try{
            const {data,error} = await supabase
            .from("error_logs")
            .insert([{
                mail,
                category: category,
                error: logs
            }])

            if(error){
                console.log("returned 1:",error)
            }
            else{
                setIsOkState(1)
            }
        }
        catch(error){
            console.log("returned 2:",error)
        }
    }

    return(
        <>

        </>
    )
}

export default LogSender