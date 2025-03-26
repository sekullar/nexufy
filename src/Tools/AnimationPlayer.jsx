"use client";

import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('react-lottie'), { ssr: false });
import smileAni from '../../public/animations/smile.json';
import soundAni from '../../public/animations/sound.json';
import textingAni from "../../public/animations/texting.json"


const AnimationPlayer = ({animationName,hPar,wPar}) => {


    const smileOptions = {
        loop: true,  
        autoplay: true,  
        animationData: smileAni,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      };
    
      const soundOptions = {
        loop: true,  
        autoplay: true,  
        animationData: soundAni,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      };

      const textingOptions = {
        loop: true,  
        autoplay: true,  
        animationData: textingAni,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      };


    return(
        <>
            {animationName == "helloAni" ?
                <Lottie options={smileOptions} height={hPar} width={wPar} />
            : null}

            {animationName == "soundAni" ?
                <Lottie options={soundOptions} height={hPar} width={wPar} />
            : null}

            {animationName == "textingAni" ?
                <Lottie options={textingOptions} height={hPar} width={wPar} />
            : null}
        </>
    )
}

export default AnimationPlayer