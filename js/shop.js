//マウスのカスタムカーソルイベント
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

const images = document.querySelectorAll('.shopping img');
const total = images.length;
let loaded = 0;
const span = document.querySelector('.loader span');

function updateProgress() {
  loaded++;
  let loadProgress = loaded / total;      // プロセス計算
  let percent = loadProgress * 100;       //パーセント計算
  
  // ロディングの変化
  span.style.width = percent + '%';
  
  // GSAPでアニメションを使ってspanの色と動作を設定
  gsap.to(span, {
    duration: 1,
    scaleX: loadProgress,
    backgroundColor: `hsl(${300 + loadProgress * 30}, 100%, 50%)`,
  });

  if (loaded === total) {
    document.querySelector('.loading__wrapper').style.display = 'none';
    document.querySelector('.shopping').style.display = 'block';
  }
}

images.forEach(img => {
  if (img.complete && img.naturalWidth !== 0) {
    updateProgress();
  } else {
    img.addEventListener('load', updateProgress);
    img.addEventListener('error', updateProgress);
  }
});


const lightbox = document.querySelector(".lightbox")
const lightboxImg = document.querySelector('.lightbox-image')
const figcaption = document.createElement('figcaption')
let currentImage = null;
const closeBtn = document.createElement('span');
closeBtn.className = 'material-symbols-outlined close-btn';
closeBtn.textContent = 'close';


//マウスクリックでrightboxを開ける
fetch('data.json')
.then(res => res.json())
.then(resProducts => {
  products = resProducts; 
  const thumbs = document.querySelectorAll('img[data-thumbid]');

  thumbs.forEach(thumb => {

    thumb.addEventListener('click', (e) => {
      const image = e.target;
      image.style.viewTransitionName = 'selected-img';

      if (!document.startViewTransition) {
        openLightbox(image);
        return;
      }

      document.startViewTransition(() => openLightbox(image));
    });
  });
});

//rightnoxの中身
async function openLightbox(image) {
//rightboxを開ける時　ショップリストのポインターイベントなし
document.querySelectorAll('.product').forEach(product => {
  product.style.pointerEvents = 'none';
});

const imageID = image.getAttribute('data-thumbID')
const data = await fetchData()
const product = data.find((item) => item.id === imageID )

currentImage = image;
lightboxImg.innerHTML = '';
figcaption.innerHTML = '';
figcaption.classList.add("figcaption");

let sizeHTML = '';
if(Array.isArray(product.size) && product.size.length > 1){
  sizeHTML = `
  <label>
  <select id="sizeSelect">
  ${product.size.map(s => `<option value="${s}">${s}</option>`).join('')}
  </select>
  </label>
  `
}else{
  sizeHTML = `
  <p>${product.size}</p>
  `
}

figcaption.innerHTML=`
<div class="product-details">
  <h1>${product.name}</h1>
  <h2>¥${product.price}<span>円</span></h2>

  <div class="product-size">${sizeHTML}</div>

  <div class="quantity-wrapper">
  <button type="button" class="decrement">−</button>
  <input type="number" id="quantityInput" value="1" min="1">
  <button type="button" class="increment">＋</button>
  </div>

  <button class="add-cart-btn"><span>Add to Cart</span></button>
</div>
`;
lightboxImg.append(image);
lightboxImg.append(figcaption);
lightboxImg.append(closeBtn);
};
async function fetchData() {
let response = await fetch('data.json')

if(!response.ok) {
    throw 'Something went wrong'
}

let data = await response.json()
return data
}
//「＋」「−」ボタン 親要素にイベントリスナーを一度だけつけて (イベント委任
figcaption.addEventListener('click', (e) => {
  const input = figcaption.querySelector('#quantityInput');
  if (!input) return;

  if (e.target.classList.contains('increment')) {
    input.value = parseInt(input.value || 1) + 1;
  }

  if (e.target.classList.contains('decrement')) {
    const val = parseInt(input.value || 1);
    if (val > 1) input.value = val - 1;
  }
});



function closeLightbox(image) {
  //product pointevent
  document.querySelectorAll('.product').forEach(product => {
    product.style.pointerEvents = '';
  });

  const productParentID = image.getAttribute('data-thumbID')
  const productParent = document.getElementById(`${productParentID}`)
  
  productParent.append(image)
  lightboxImg.removeChild(figcaption)
  lightboxImg.removeChild(closeBtn)
}


closeBtn.addEventListener('click', async () => {

  if (!document.startViewTransition) {
    closeLightbox(currentImage);
    return;
  }

  const animation = document.startViewTransition(() => {
    closeLightbox(currentImage);
  });

  await animation.finished;
  
  currentImage.style.viewTransitionName = '';

});
