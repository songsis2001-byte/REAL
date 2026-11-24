// 전체를 { } 로 감싸서 변수 이름이 다른 코드와 섞이지 않게 해요.
{
  /* ========== 1. 제품 데이터 (연습용 샘플) ========== */
  const products = {
    mobile: [
      { name: '벨타 S 울트라', desc: '2억 화소 카메라',  price: 1698000, icon: 'i-phone',  badge: 'NEW' },
      { name: '벨타 S',        desc: '가볍고 강력한 기본형', price: 1155000, icon: 'i-phone' },
      { name: '벨타 워치 6',   desc: '수면·심박 측정',      price: 389000,  icon: 'i-watch',  badge: 'BEST' },
      { name: '벨타 버즈 프로', desc: '노이즈 캔슬링',      price: 279000,  icon: 'i-buds' }
    ],
    tv: [
      { name: '네오 비전 OLED 77형', desc: '4K 120Hz',        price: 4290000, icon: 'i-tv', badge: 'NEW' },
      { name: '네오 비전 QLED 65형', desc: '밝은 거실에 딱',   price: 2190000, icon: 'i-tv' },
      { name: '시네마 98형',        desc: '초대형 화면',     price: 8990000, icon: 'i-tv' },
      { name: '벨타 버즈 라이트',    desc: '가성비 무선 이어폰', price: 129000, icon: 'i-buds' }
    ],
    home: [
      { name: '큐브 냉장고 4도어', desc: '컬러 패널 교체형', price: 3290000, icon: 'i-fridge', badge: 'BEST' },
      { name: '큐브 냉장고 2도어', desc: '작은 집에 알맞게', price: 1890000, icon: 'i-fridge' },
      { name: '큐브 김치냉장고',   desc: '맛 지키는 온도 관리', price: 2390000, icon: 'i-fridge' },
      { name: '큐브 와인셀러',     desc: '조용한 저소음',   price: 990000,  icon: 'i-fridge' }
    ],
    it: [
      { name: '벨타 북 프로 16', desc: '영상 편집용 고성능', price: 2790000, icon: 'i-laptop', badge: 'NEW' },
      { name: '벨타 북 에어 14', desc: '1kg 초경량',        price: 1490000, icon: 'i-laptop' },
      { name: '벨타 북 360',     desc: '접히는 2-in-1',     price: 1890000, icon: 'i-laptop' },
      { name: '벨타 워치 클래식', desc: '회전 베젤',        price: 459000,  icon: 'i-watch' }
    ]
  };

  /* ========== 2. 자주 쓰는 요소 찾아두기 ========== */
  const header    = document.getElementById('header');
  const nav       = document.getElementById('nav');
  const menuBtn   = document.getElementById('menuBtn');
  const track     = document.getElementById('heroTrack');
  const slides    = [...track.children];
  const dotsBox   = document.getElementById('dots');
  const pauseBtn  = document.getElementById('pauseBtn');
  const grid      = document.getElementById('grid');
  const tabs      = [...document.querySelectorAll('.tab')];
  const cartCount = document.getElementById('cartCount');
  const toast     = document.getElementById('toast');

  /* ========== 3. 헤더: 스크롤하면 그림자, 모바일 메뉴 열고 닫기 ========== */
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  });

  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', e => {
    if (e.target.tagName === 'A') nav.classList.remove('open');
  });

  /* ========== 4. 히어로 슬라이드 ========== */
  let current = 0;
  let timer = null;

  // 슬라이드 개수만큼 점(dot) 버튼 만들기
  dotsBox.innerHTML = slides
    .map((_, i) => `<button aria-label="${i + 1}번 슬라이드로"></button>`)
    .join('');
  const dots = [...dotsBox.children];

  function goTo(i) {
    current = (i + slides.length) % slides.length;   // 끝에서 처음으로 돌아가게
    track.scrollTo({ left: slides[current].offsetLeft, behavior: 'smooth' });
    paintDots();
  }

  function paintDots() {
    dots.forEach((d, i) => d.classList.toggle('on', i === current));
  }

  // 사용자가 손가락으로 넘겨도 점이 따라 바뀌게
  track.addEventListener('scroll', () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== current) { current = i; paintDots(); }
  });

  dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); restart(); }));
  document.getElementById('prevBtn').addEventListener('click', () => { goTo(current - 1); restart(); });
  document.getElementById('nextBtn').addEventListener('click', () => { goTo(current + 1); restart(); });

  // 키보드 왼쪽/오른쪽 화살표로도 넘기기
  track.tabIndex = 0;
  track.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); restart(); }
    if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(current - 1); restart(); }
  });

  // 5초마다 자동으로 넘기기
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let paused = reduceMotion;

  function start() {
    if (!paused) timer = setInterval(() => goTo(current + 1), 5000);
  }
  function stop() { clearInterval(timer); }
  function restart() { stop(); start(); }

  pauseBtn.addEventListener('click', () => {
    paused = !paused;
    pauseBtn.textContent = paused ? '▶' : '❚❚';
    pauseBtn.setAttribute('aria-label', paused ? '자동 넘김 시작' : '자동 넘김 멈춤');
    restart();
  });
  if (paused) pauseBtn.textContent = '▶';

  // 마우스를 올리면 잠깐 멈춤
  track.addEventListener('mouseenter', stop);
  track.addEventListener('mouseleave', start);

  paintDots();
  start();

  /* ========== 5. 탭 + 제품 카드 그리기 ========== */
  const won = n => n.toLocaleString('ko-KR') + '원';

  function renderProducts(cat) {
    grid.innerHTML = products[cat].map((p, i) => `
      <article class="card" style="animation-delay:${i * 70}ms">
        <svg><use href="#${p.icon}"/></svg>
        ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <span class="price">${won(p.price)}</span>
        <button class="btn btn-dark add" data-name="${p.name}">장바구니 담기</button>
      </article>
    `).join('');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.toggle('on', t === tab);
        t.setAttribute('aria-selected', t === tab);
      });
      renderProducts(tab.dataset.cat);
    });
  });

  renderProducts('mobile');

  /* ========== 6. 장바구니 담기 + 알림 ========== */
  let count = 0;
  let toastTimer = null;

  // 카드는 나중에 다시 그려지므로, 부모(grid)에 이벤트를 한 번만 걸어요 (이벤트 위임)
  grid.addEventListener('click', e => {
    const btn = e.target.closest('.add');
    if (!btn) return;
    count++;
    cartCount.textContent = count;
    toast.textContent = `${btn.dataset.name}을(를) 장바구니에 담았어요`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
  });
}
