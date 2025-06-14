console.clear();
const { gsap, imagesLoaded } = window;

//マウスのカスタムカーソルイベント
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

// カードスライダー
const items = document.querySelectorAll(".cards-item");// 各カード要素
const cards = document.querySelector(".cards");// カード全体を囲む親
const navi = document.querySelector(".navi"); 
const gallerySection = document.querySelector(".Gallery");// ギャラリーセクション


let progress = 50;
let startX = 0;//ドラッグ時の開始位置
let active = 0;// 現在のアクティブなカードのインデックス
let isDown = false;// マウスが押されているかどうか

const speedWheel = 0.05;// ホイールスクロールの感度
const speedDrag = -0.1;// ドラッグ時の感度


const getZindex = (array,index) =>
array.map((_,i) =>
    index === i ? array.length : array.length - Math.abs(index - i)
);
//Zインデックスとアクティブ(カードの表示を更新する関数)
const displayItems = (item, index, active) =>{
    const zIndex= getZindex([...items],active)[index];
    item.style.setProperty("--zIndex",zIndex);
    item.style.setProperty("--active",(index - active) / items.length);
};
//中心のカードを判定
const animate = () => {
    progress = Math.max(0,Math.min(progress,100));
    active = Math.floor((progress / 100) * (items.length - 1));
    items.forEach((item,index)=>displayItems(item,index,active));
};
animate();
//.マウスホイールで進行度を変える
const handleWheel = (e) => {
    const wheelProgress = e.deltaY * speedWheel;
    progress = progress + wheelProgress;
    animate();
};
  
//ドラッグしてスクロール操作を可能
const handleMouseMove = (e) => {
    if(!isDown)return;
    const x = e.clientX ||(e.touches && e.touches[0].clientX) || 0;
    const mouseProgress = (x - startX) * speedDrag;
    progress = progress + mouseProgress;
    startX = x;
    animate();
};

const handleMouseDown = (e) => {
    isDown =true;
    startX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
};

const handleMouseUp = () => {
    isDown = false;
};

document.addEventListener("mousewheel",handleWheel);
document.addEventListener("mousedown",handleMouseDown);
document.addEventListener("mousemove",handleMouseMove);
document.addEventListener("mouseup",handleMouseUp);
document.addEventListener("touchstart",handleMouseDown);
document.addEventListener("touchmove",handleMouseMove);
document.addEventListener("touchend",handleMouseUp);

//カードとテキストのアニメーション初期化関数
function init() {

	let tl = gsap.timeline();

	tl.to(cards.children, {
		delay: 0.15,
		duration: 0.5,
		stagger: {
			ease: "power4.inOut",
			from: "right",
			amount: 0.1,
		},
		"--card-translateY-offset": "0%",
	})
		.to(gallerySection.querySelector(".text"),
		{
			duration: 0.4,
			opacity: 1,
			pointerEvents: "all",
		},
		"-=0.4"
	);
}
//ページ内の全画像が読み込み完了するまで待ち ローディングバーを表示し,完了後に .loading__wrapper をフェードアウトして init() を実行
const waitForImages = () => {
	const images = [...document.querySelectorAll("img")];
	const totalImages = images.length;
	let loadedImages = 0;
	const loaderEl = document.querySelector(".loader span");

	gsap.set(gallerySection.querySelector(".text"), {
		pointerEvents: "none",
		opacity: "0",
	});

	images.forEach((image) => {
		imagesLoaded(image, (instance) => {
			if (instance.isComplete) {
				loadedImages++;
				let loadProgress = loadedImages / totalImages;

				gsap.to(loaderEl, {
					duration: 1,
					scaleX: loadProgress,
					backgroundColor: `hsl(${300 + loadProgress * 30}, 100%, 50%)`,
				});

				if (totalImages == loadedImages) {
					gsap.timeline()
						.to(".loading__wrapper", {
						duration: 0.8,
						opacity: 0,
						pointerEvents: "none",
					})
						.call(() => init());
				}
			}
		});
	});
};


waitForImages();

//.web_Container 要素にスクロールアニメーション
window.addEventListener("scroll", function() {
    let scrollAnimationElm = document.querySelectorAll(".web_Container")
    function scrollAnimationFunc(){
    for (let i = 0; i < scrollAnimationElm.length; i++) {
        let triggerMargin = 100; 
        if (window.innerHeight > scrollAnimationElm[i].getBoundingClientRect().top + triggerMargin) {
            scrollAnimationElm[i].classList.add('on'); 
        } else {
            scrollAnimationElm[i].classList.remove('on'); 
        }
    }
    }
    scrollAnimationFunc(); 
});   

//.video video にホバーで動画再生
const videos = document.querySelectorAll(".video video");

videos.forEach((video) => {
    let playTimeout; 

    video.addEventListener("mouseenter", () => {
        playTimeout = setTimeout(() => {
            video.play();
        }, 600); 
    });
    video.addEventListener("mouseleave", () => {
        clearTimeout(playTimeout); 
        video.pause();
        video.currentTime = 0; 
    });
});




document.addEventListener("DOMContentLoaded",()=>{
    //LenisとScrollTriggerの連携
    const lenis = new Lenis();
    lenis.on("scroll",ScrollTrigger.update);
    gsap.ticker.add((time)=>{
        lenis.raf(time*1000);
    })
    gsap.ticker.lagSmoothing(0);
    gsap.registerPlugin(ScrollTrigger);
    const gallerySection = document.querySelector(".Gallery");
    const galleryHeight = window.innerHeight * 2;
    //.Gallery をピン留め
    ScrollTrigger.create({
        trigger:gallerySection,
        start:"top top",
        end:`+=${galleryHeight}px`,
        pin:true,
        pinSpacing:true,
    })

    const strickySection = document.querySelector(".About_me");
    const strickyHeader = document.querySelector(".about_text");
    const cards = document.querySelectorAll(".about");

    //.About_me 内の .about_text 横移動＋.about 要素のアニメーション
    const transforms = [
        [
            [10,50,-10,10],
            [20,-10,-45,20],
        ],
        [
            [0,47.5,-10,15,],
            [-25,15,-45,30],
        ],
        [
            [0,52.5,-10,5],
            [15,-5,-40,69],
        ],
        [
            [0,50,30,-80],
            [20,-10,60,5]
        ],
        [
            [0,55,-15,30],
            [25,-15,60,95],
        ],
    ];
    ScrollTrigger.create({
        trigger:strickySection,
        start:"top top",// 要素が画面上に来たら開始
        end:`+=${galleryHeight}px`,// 高さ2画面分スクロールで終了
        pin:true,//.Aboutをピン留め
        pinSpacing:true,
        onUpdate:(self) =>{
            const progress = self.progress;
            
            //about_text を横にスクロール
            const maxTranslate = strickyHeader.offsetWidth - window.innerWidth;
            const translateX = -progress * maxTranslate;
            gsap.set(strickyHeader,{ x:translateX });
            //各 .about 要素（カード）に**個別の出現タイミング（delay）**を設定
            cards.forEach((about,index)=>{
                const delay = index * 0.1125;
                //スクロールが進むごとに順番に登場し、0 → 1 の進行度でアニメーション
                const aboutprogress = Math.max(0,Math.min((progress - delay) *2, 1));

                if(aboutprogress > 0){
                    const aboutStartX = 25;
                    const aboutEndX = -650;
                    const yPos = transforms[index][0];
                    const rotations = transforms[index][1];

                    const aboutX = gsap.utils.interpolate(
                        aboutStartX,
                        aboutEndX,
                        aboutprogress
                    );
                    const yProgress = aboutprogress * 3;
                    const yIndex = Math.min(Math.floor(yProgress),yPos.length - 2);
                    const yInterpolation = yProgress - yIndex;
                    const aboutY = gsap.utils.interpolate(
                        yPos[yIndex],
                        yPos[yIndex + 1],
                        yInterpolation
                    );
                    //transforms[index] からカードごとの Y 軸と回転の変化パターンを取得
                    const aboutRotation = gsap.utils.interpolate(
                        rotations[yIndex],
                        rotations[yIndex + 1],
                        yInterpolation
                    );

                    gsap.set(about,{
                        xPercent:aboutX,
                        yPercent:aboutY,
                        rotation:aboutRotation,
                        opacity:1
                    });
                }else{
                    //カードのアニメーションタイミング外では透明に
                    gsap.set(about,{ opacity: 0});
                }
            });
        },
    });

});


//スクロールトリガーで PNG を左右にバウンド
gsap.registerPlugin(ScrollTrigger);
const PNG = document.querySelector(".ScrollTrigger img");
const container = document.querySelector(".ScrollTrigger");
function animatePNG() {
    gsap.fromTo(
      PNG,
      { x: 0 }, 
      {
        x: container.offsetWidth - PNG.offsetWidth, 
        duration: 4,
        ease: 'bounce.out'
      }
    );
  }
  
  ScrollTrigger.create({
    trigger: ".contact",
    start: "top bottom",
    onEnter: animatePNG,        
    onLeave: () => gsap.set(PNG, { x: 0 }),  
    onEnterBack: animatePNG,       
    toggleActions: "restart none reverse none"
});

//内容をホバー/クリックアニメーション＋コピー
const emailText = document.getElementById('emailText');
const emailValue = document.getElementById('emailValue');

const flipText = (newText) => {
    gsap.to(emailText, {
        duration: 0.4,
        rotationX: -90,
        opacity: 0,
        onComplete: () => {
            emailText.textContent = newText;
            gsap.fromTo(emailText, 
                { rotationX: 90, opacity: 0 },
                { duration: 0.4, rotationX: 0, opacity: 1 }
            );
        }
    });
};

emailValue.addEventListener('mouseenter', () => {
    flipText('Click it to Copy!');
});

emailValue.addEventListener('mouseleave', () => {
    flipText('Want to say hi?');
});
//クリックしてクリックボードの中に貼り付ける
emailValue.addEventListener('click', () => {
    const email = emailValue.textContent;

    navigator.clipboard.writeText(email).then(() => {
        flipText('Email copied to clipboard');

    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
});

//電話番号のアニメーション
const telText = document.getElementById('telText');
        const telValue = document.getElementById('telValue');

        const PhoneText = (newText) => {
            gsap.to(telText, {
                duration: 0.4,
                rotationX: -90,
                opacity: 0,
                onComplete: () => {
                    telText.textContent = newText;
                    gsap.fromTo(telText, 
                        { rotationX: 90, opacity: 0 },
                        { duration: 0.4, rotationX: 0, opacity: 1 }
                    );
                }
            });
        };

        telValue.addEventListener('mouseenter', () => {
            PhoneText('Click it to Copy!');
        });

        telValue.addEventListener('mouseleave', () => {
            PhoneText('Want to ask?');
        });

        telValue.addEventListener('click', () => {
            const email = telValue.textContent;

            navigator.clipboard.writeText(email).then(() => {
                PhoneText('Telephone copied to clipboard');

            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
        
//アンカーリンクをスクロールさせるための GSAP アニメーション
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        gsap.to(window, {
            duration: 1, 
            scrollTo: {
                y: this.getAttribute('href'),
                offsetY: 50 
            },
            ease: "power2.out" 
        });
    });
});

