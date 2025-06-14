const body = document.body;
const starCreate = () => {
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        star.classList.add('star'); //星の見た目はCSSで定義されている想定

        let r = Math.random() * 3 + 1;// 半径1〜4pxくらいのランダムサイズ
        star.style.width = r + 'px'; 
        star.style.height = r + 'px';
        
        star.style.left = Math.random() * innerWidth + 'px'; 
        star.style.top = Math.random() * innerHeight + 'px';
        
        document.querySelector('.Layers_02').append(star); // DOMに追加

         // 10秒後に削除
        setTimeout(() => {
            star.remove();
        }, 10000);
    }
};
setInterval(() => {
    starCreate();// 5秒ごとに星を出現
}, 5000);


let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
let w = window.innerWidth;
let h = window.innerHeight;
canvas.width = w;
canvas.height = h;
//ウィンドウのサイズに合わせてCanvasをリサイズ
let num = 100;
let snows =[];
for(let i=0; i<num; i++){
    snows.push({
        x:Math.random()*w,
        y:Math.random()*h,
        r:Math.random()*5+1
    });
}
//100個の雪（ランダム位置と大きさ）を配列に格納。
let move = () =>{
    for(let i = 0;i < num; i++){
        let snow =snows[i];
        snow.x -= Math.random()*2+1;
        snow.y -= Math.random()*2+1;
        if(snow.x < 0){
            snow.x = w;
        }
        if(snow.y < 0){
            snow.y = h;
        }
    }
}
//ループする降雪効果
let draw = () => {
    context.clearRect(0,0,w,h);
    context.beginPath();
    context.fillStyle = 'rgb(255,255,255)';
    context.shadowColor = 'rgb(255,255,255)';
    context.shadowBlur = 10;

        for(let i = 0;i < num; i++){
            let snow =snows[i];
            context.moveTo(snow.x,snow.y);
            context.arc(snow.x,snow.y,snow.r,0,Math.PI*2)
        }
        context.fill();
        context.closePath();
        move();
};
draw();
setInterval(draw,30);
//読み込み完了後にロード画面を消す処理
document.addEventListener("DOMContentLoaded", () => {
	gsap.to(".loading__wrapper", {
		duration: 0.8,
		opacity: 0,
		pointerEvents: "none",
		onComplete: () => {
			document.querySelector(".Layers").style.opacity = 1;
		},
	});
});
