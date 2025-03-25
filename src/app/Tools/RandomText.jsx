import { useEffect, useState } from "react";

const RandomText = () => {

    const [selectedText,setSelectedText] = useState("");

    const randomSelector = () => {
        const randomIndex = Math.floor(Math.random() * gereksizBilgiler.bilgiler.length);
        const randomBilgi = gereksizBilgiler.bilgiler[randomIndex];
        setSelectedText(randomBilgi);
    }

    useEffect(() => {
        randomSelector();
    }, [])
    

    const gereksizBilgiler = {
        bilgiler: [
            "Atların 4 bacağı vardır.",
            "Ay, geceleri daha net görünür.",
            "Yağmur suyu genellikle ıslaktır.",
            "Karpuzun çekirdekleri genelde karpuzun içindedir.",
            "Çay sıcaksa daha sıcaktır.",
            "Tuzlu su, genellikle tuzludur.",
            "Ağaçlar genelde kökleriyle toprağa bağlıdır.",
            "Telefonun şarjı biterse kapanır.",
            "Bir kalem yere düşerse genellikle yerle temas eder.",
            "Kendi göbeğini kaşıdığında en çok sen hissedersin.",
            "Dondurma soğukken daha soğuktur.",
            "Bir kaplumbağa kabuğunu çıkarırsa üşür.",
            "Gözlerin açıkken daha iyi görürsün.",
            "Bir bardak su içersen genellikle susuzluğun azalır.",
            "Arabanın tekerlekleri genelde yuvarlaktır.",
            "Bir kedi miyavlarsa genellikle miyav sesi çıkarır.",
            "Kapılar genellikle kapı kolu çevrilince açılır.",
            "Çoraplarını çıkarırsan genelde çıplak ayak kalırsın.",
            "Bir kedi seni tırmalarsa genellikle canın yanar.",
            "Geceleri güneş yoktur.",
            "Deniz seviyesinden yukarı çıkarsan rakım artar.",
            "Bir köpeğe 'otur' dersen bazen gerçekten oturur.",
            "Bilgisayarın fişini çekersen genellikle kapanır.",
            "Bir ampul patlarsa ışığı kesilir.",
            "Bir uçağın içindeysen genellikle havadasındır.",
            "Cips yersen cipsin azalır.",
            "Bir şey düşerse genellikle yer çekimi yüzünden düşer.",
            "Güneş doğduğunda sabah olur.",
            "Ekmek kızartılırsa genellikle kızarmış ekmek olur.",
            "Bir kapı kapalıysa açman gerekebilir.",
            "Bir kitabın sayfalarını çevirirsen ilerlersin.",
            "Şampuan gözünüze kaçarsa genellikle yanar.",
            "Ayakkabı giyersen genellikle çıplak ayak yürümezsin.",
            "Bir su şişesinin kapağını açmazsan suyu içemezsin.",
            "Gözlüğün camını çıkarırsan gözlük camı olmaz.",
            "Bir elmayı yersen elma azalır.",
            "Mektubun içine kağıt koymazsan mektup boş olur.",
            "Televizyon açıksa genellikle çalışıyordur.",
            "Bir insan yürümezse olduğu yerde kalır.",
            "Eğer yemek yemezsen genellikle aç kalırsın."
        ]
    };

    return(
        <>
            {selectedText}
        </>
    )
}

export default RandomText