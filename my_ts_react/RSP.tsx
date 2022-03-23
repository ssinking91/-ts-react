import * as React from "react";
import { useState, useRef, useEffect } from "react";

// as const는 효과가 2개인데

// 1. 타입을 object의 value로 바꿔줍니다. (타입을 'kim'으로 바꿔줍니다)

// 2. object안에 있는 모든 속성을 readonly로 바꿔줍니다 (변경하면 에러나게)

const rspCoords = {
  바위: "0",
  가위: "-142px",
  보: "-284px",
} as const;

const scores = {
  가위: 1,
  바위: 0,
  보: -1,
} as const;

// keyof 연산자 : 이미 존재하는 오브젝트를 사용한 타입 지정이 가능하다.
// typeof 연산자 : 해당 연산자는 자바스크립트에도 존재하지만 타입스크립트 타입, 인터페이스 문법에도 확장하여 사용할 수 있다.
type ImgCoords = typeof rspCoords[keyof typeof rspCoords]; // "0" | "-142px" | "-284px"

//find() 메서드는 주어진 판별 함수를 만족하는 첫 번째 요소의 값을 반환합니다. 그런 요소가 없다면 undefined를 반환합니다.
//Object.keys() 메소드는 주어진 객체의 속성 이름들을 일반적인 반복문과 동일한 순서로 순회되는 열거할 수 있는 배열로 반환합니다.
const computerChoice = (imgCoords: ImgCoords) => {
  return (Object.keys(rspCoords) as ["바위", "가위", "보"]).find((k) => {
    return rspCoords[k] === imgCoords;
  })!; // ! => 리턴값에 무조건 undefined가 되지 않는다(확신이 들때 씀!)
};

const RSP = () => {
  const [result, setResult] = useState("");
  const [imgCoord, setImgCoord] = useState<ImgCoords>(rspCoords.바위);
  const [score, setScore] = useState(0);
  const interval = useRef<number>();
  const clicked = useRef<boolean>(false);

  useEffect(() => {
    // componentDidMount, componentDidUpdate 역할(1대1 대응은 아님)
    console.log("다시 실행");
    interval.current = window.setInterval(changeHand, 100);
    return () => {
      // componentWillUnmount 역할
      console.log("종료");
      clearInterval(interval.current);
    };
  }, [imgCoord]);

  const changeHand = () => {
    if (imgCoord === rspCoords.바위) {
      setImgCoord(rspCoords.가위);
    } else if (imgCoord === rspCoords.가위) {
      setImgCoord(rspCoords.보);
    } else if (imgCoord === rspCoords.보) {
      setImgCoord(rspCoords.바위);
    }
  };

  //onClick={onClickBtn("")} => 고차함수 타이핑 : const onClickBtn = () => () => {}
  const onClickBtn = (choice: keyof typeof rspCoords) => () => {
    if (!clicked.current) {
      clearInterval(interval.current);
      clicked.current = true;
      const myScore = scores[choice];
      const cpuScore = scores[computerChoice(imgCoord)];
      const diff = myScore - cpuScore;
      if (diff === 0) {
        setResult("비겼습니다!");
        //includes() => es2016 tsconfig.json에 추가 할 것
      } else if ([-1, 2].includes(diff)) {
        setResult("이겼습니다!");
        setScore((prevScore) => prevScore + 1);
      } else {
        setResult("졌습니다!");
        setScore((prevScore) => prevScore - 1);
      }
      setTimeout(() => {
        interval.current = window.setInterval(changeHand, 100);
        clicked.current = false;
      }, 1000);
    }
  };

  return (
    <>
      <div
        id="computer"
        style={{
          background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0`,
        }}
      />
      <div>
        <button id="rock" className="btn" onClick={onClickBtn("바위")}>
          바위
        </button>
        <button id="scissor" className="btn" onClick={onClickBtn("가위")}>
          가위
        </button>
        <button id="paper" className="btn" onClick={onClickBtn("보")}>
          보
        </button>
      </div>
      <div>{result}</div>
      <div>현재 {score}점</div>
    </>
  );
};

export default RSP;
