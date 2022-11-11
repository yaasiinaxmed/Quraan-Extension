let  audio = document.querySelector('.quranPlayer'),
    surahContainer = document.querySelector(".surahs"),
    ayah = document.querySelector(".ayah"),
    next = document.querySelector(".next"),
    prev = document.querySelector(".prev"),
    play = document.querySelector(".play");

    getSurahs();

window.onload = function(){
    chrome.windows.getCurrent({}, w => {
        chrome.windows.update(w.id, {focused: true}, () => {});
    });
    windowInitHeight = window.innerHeight;
}


async function getSurahs() {

    fetch('https://api.quran.gading.dev/surah')
    .then(response => response.json())
    .then(data => {
       for (let surah in data.data) {
          
        surahContainer.innerHTML += 
        `
           <div>
               <p>${data.data[surah].name.long}</p>
               <p>${data.data[surah].name.transliteration.en}</p>
           </div>
        `

       }

       let allSurahs = document.querySelectorAll('.surahs div'),
       AyahsAudios ,
       AyahsText;

       allSurahs.forEach( (surah,index) => {
            surah.addEventListener('click', () => {
                fetch(`https://api.quran.gading.dev/surah/${index + 1}`)
                .then(response => response.json())
                .then(data=> {
                    let verses = data.data.verses;
                    AyahsAudios = [];
                    AyahsText = [];
                    SurahAudios = [];
                    verses.forEach(verses => {
                        AyahsAudios.push(verses.audio.primary)
                        AyahsText.push(verses.text.arab);
                    })
                   let ayahIndex = 0;
                   changeAyah(ayahIndex);
                   
                   audio.addEventListener('ended', () => {
                     ayahIndex++;
                     if(ayahIndex < AyahsAudios.length) {
                        changeAyah(ayahIndex);
                     } 
                     else {
                        ayahIndex = 0
                        changeAyah(ayahIndex);
                        audio.play();
                        SurahAudios.push(verses.audio);
                        isPlaying = false;
                        togglePlay();
                     }
                     audio.play();
                   })
                  
                   next.addEventListener("click", () => {
                      ayahIndex < AyahsAudios.length - 1 ? ayahIndex++ : ayahIndex = 0;
                      changeAyah(ayahIndex);
                      audio.pause();
                    isPlaying = false;
                    togglePlay();
                   })

                   prev.addEventListener("click", () => {
                    ayahIndex == 0 ? ayahIndex = AyahsAudios.length -1 :
                    ayahIndex--;
                    changeAyah(ayahIndex)
                    audio.pause();
                    isPlaying = false;
                    togglePlay();
                  })

                  let isPlaying = false ;

                  function togglePlay() {
                    
                    if(isPlaying) {
                        audio.pause();
                        play.innerHTML = `<i class="fa fa-play"></i>`;
                        isPlaying = false;
                    } 
                    else {
                        audio.play();
                        play.innerHTML = `<i class="fa fa-pause"></i>`;
                        isPlaying = true;
                    }
                  }

                  play.addEventListener("click", togglePlay)

                   function changeAyah(index) {
                    audio.src = AyahsAudios[index],
                    ayah.innerHTML = AyahsText[index]

                   }

                })
            });
       });

    });
};

const scroll = document.querySelector('.scrollTop');

window.addEventListener('scroll', function(){
    scroll.classList.toggle('active', window.scrollY > 500);
})

scroll.addEventListener('click', scrollToTop);

function scrollToTop(){
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}