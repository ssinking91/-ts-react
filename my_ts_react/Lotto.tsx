import * as React from "react";
import Ball from "./Ball";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";

function getWinNumbers() {
  console.log("getWinNumbers");

  // 45개 로또번호
  const candidate = Array(45)
    .fill(null) //배열의 시작 인덱스부터 끝 인덱스의 이전까지 정적인 값 하나로 채웁니다.
    .map((v, i) => i + 1);

  // candidate 랜덤으로 섞어놓은 로또번호
  const shuffle = [];

  while (candidate.length > 0) {
    // splice() : 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경
    // Math.random() : 0 이상 1 미만의 구간
    shuffle.push(
      candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]
    );
    //candidate = [] 이 됨
  }

  const bonusNumber = shuffle[shuffle.length - 1]; // shuffle 마지막 번호
  // slice() : 어떤 배열의 begin부터 end까지(end 미포함)에 대한 얕은 복사본을 새로운 배열 객체로 반환
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c); // shuffle 인덱스 0 ~ 5까지 반환 후 정렬
  return [...winNumbers, bonusNumber];
}

const Lotto = () => {
  const lottoNumbers = useMemo(() => getWinNumbers(), []);
  const [winNumbers, setWinNumbers] = useState(lottoNumbers); // 로또번호
  const [winBalls, setWinBalls] = useState<number[]>([]); // 로또번호 6개
  const [bonus, setBonus] = useState<number | null>(null); // 보너스 번호 1개
  const [redo, setRedo] = useState(false); // 한번더 버튼 유무
  const timeouts = useRef<number[]>([]); //setTimeout으로 된 값 7개

  useEffect(() => {
    console.log("useEffect");

    for (let i = 0; i < winNumbers.length - 1; i++) {
      timeouts.current[i] = window.setTimeout(() => {
        setWinBalls((prevBalls) => [...prevBalls, winNumbers[i]]);
      }, (i + 1) * 1000);
    }
    timeouts.current[6] = window.setTimeout(() => {
      setBonus(winNumbers[6]);
      setRedo(true);
    }, 7000);
    return () => {
      timeouts.current.forEach((v) => {
        clearTimeout(v);
      });
    };
  }, [timeouts.current]); // 빈 배열이면 componentDidMount와 동일
  // 배열에 요소가 있으면 componentDidMount랑 componentDidUpdate 둘 다 수행

  useEffect(() => {
    console.log("로또 숫자를 생성합니다.");
  }, [winNumbers]);

  const onClickRedo = useCallback(() => {
    console.log("onClickRedo");
    console.log(winNumbers);
    setWinNumbers(getWinNumbers());
    setWinBalls([]);
    setBonus(null);
    setRedo(false);
    timeouts.current = [];
  }, [winNumbers]);

  return (
    <>
      <div>당첨 숫자</div>
      <div id="결과창">
        {winBalls.map((v) => (
          <Ball key={v} number={v} />
        ))}
      </div>
      <div>보너스!</div>
      {bonus && <Ball number={bonus} />}
      {redo && <button onClick={onClickRedo}>한 번 더!</button>}
    </>
  );
};

export default Lotto;
