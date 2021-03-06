(() => {
  const actions = {
    birdFlies(key) {
      if (key) {
        // key값이 true라면, data-index="5"인 객체에 .bird가 존재하는 클래스의 transform을 window.innerWidth(윈도우의 보여지는 화면)으로 이동
        document.querySelector('[data-index="5"] .bird').style.transform = `translateX(${window.innerWidth}px)`;
      } else {
        // key값이 true가 아니라면, 화면 밖으로 밀어냄
        document.querySelector('[data-index="5"] .bird').style.transform = `translateX(-100%)`;
      }
    },
    // birdFlies2(key) {
    //   if (key) {
    //     document.querySelector(
    //       '[data-index="5"] .bird'
    //     ).style.transform = `translate(${window.innerWidth}px, ${
    //       -window.innerHeight * 0.7
    //     }px)`;
    //   } else {
    //     document.querySelector(
    //       '[data-index="5"] .bird'
    //     ).style.transform = `translateX(-100%)`;
    //   }
    // },
  };

  // 그림과 글을 짝 맞춰 인덱스 번호 붙여줌
  const stepElems = document.querySelectorAll('.step');
  const graphicElems = document.querySelectorAll('.graphic-item');
  let currentItem = graphicElems[0]; // 현재 활성화된(visible 클래스가 붙은) .graphic-item을 지정
  let ioIndex;

  // 아이템이 화면에 보이는지 확인하는 IntersectionObserver
  // 관찰하는 대상의 객체가 나타나는지 사라지는지를 알 수 있음
  // 사용하는 이유 : 화면에 보이지 않는 객체들까지 루프를 도는 비효율성을 줄이기 위해(루프 횟수 줄이기)
  const io = new IntersectionObserver((entries, observer) => {
    // entries[0].target.dataset.index 가 문자열로 인식되므로
    // * 1을 통해 숫자로 변경
    console.log(entries[0].target.dataset.index * 1);
    ioIndex = entries[0].target.dataset.index * 1;
  });

  for (let i = 0; i < stepElems.length; i++) {
    // 생성된 인스턴스(io)로 관찰자 초기화하고 관찰할 대상(stepElems[i]) 지정
    io.observe(stepElems[i]);
    // 방법1
    // stepElems[i].setAttribute('data-index', i);
    // 방법2
    stepElems[i].dataset.index = i;
    graphicElems[i].dataset.index = i;

    function activate(action) {
      // console.log(action);
      currentItem.classList.add('visible');
      if (action) {
        actions[action](true);
      }
    }
    function inactivate(action) {
      currentItem.classList.remove('visible');
      if (action) {
        actions[action](false);
      }
    }

    // scroll 시 효과
    window.addEventListener('scroll', () => {
      let step;
      let boundingRect;
      //루프 횟수를 확인하기 위한 변수 temp
      let temp = 0;
      //   for (let i = 0; i < stepElems.length; i++) {
      for (let i = ioIndex - 1; i < ioIndex + 2; i++) {
        step = stepElems[i];
        // step이 존재하지 않으면 다시 위의 반복문으로 돌아가서 시작
        if (!step) continue;
        boundingRect = step.getBoundingClientRect();
        // top의 위치를 통해
        // console.log(boundingRect.top);

        temp++;

        if (
          // 글자박스가 화면 위,아래 10% 부분 안쪽으로
          // 들어오게 되면 그림을 변경
          boundingRect.top > window.innerHeight * 0.1 &&
          boundingRect.top < window.innerHeight * 0.8
        ) {
          //   console.log(step.dataset.index);
          // 본래 보여졌던 currentItem을 보이지 않게,,
          if (currentItem) {
            // html의 data-action과 관련있음
            inactivate(currentItem.dataset.action);
          }
          // 현재 보여지는 currentItem을 재설정 후 보이게,,
          currentItem = graphicElems[step.dataset.index];
          activate(currentItem.dataset.action);
        }
      }
      console.log(temp);
    });
    // 새로 고침 시 맨 위로 올리는 동작
    window.addEventListener('load', () => {
      setTimeout(() => scrollTo(0, 0), 100);
    });
    // 맨처음 이미지 보이게 실행 1번 해줌
    activate();
  }
})();
