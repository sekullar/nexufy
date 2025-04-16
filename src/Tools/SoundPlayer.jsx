import { useEffect} from "react"

const SoundPlayer = ({mode,trigger}) => {


    useEffect(() => {
        if(trigger != 0){
            if(mode == "error"){
                const audio = new Audio("/sounds/current/s1.mp3");
                audio.volume = 1;
                audio.play();
            }
            else if(mode == "warn"){
                const audio = new Audio("sounds/current/s2.mp3");
                audio.volume = 1;
                audio.play();
            }
            else if(mode == "success"){
                const audio = new Audio("/sounds/current/s3.mp3");
                audio.volume = 1;
                audio.play();
            }
            else if(mode == "joinChannel"){
                const audio = new Audio("/sounds/current/defaultJoinVoice.mp3");
                audio.volume = 1;
                audio.play();
            }
        }
    }, [trigger])

    return(
        <>

        </>
    )
}

export default SoundPlayer