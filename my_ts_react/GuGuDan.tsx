import * as React from 'react';
import { useState, useRef } from 'react';

const GuGuDan = () => {
    const [first, setFirst] = useState<number>(Math.ceil(Math.random() * 9));
    const [second, setSecond] = useState<number>(Math.ceil(Math.random() * 9));
    const [value, setValue] = useState('');
    const [result, setResult] = useState('');
    const inputEl = useRef<HTMLInputElement>(null);

    const onSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = inputEl.current;
        console.log(input);
        if (parseInt(value) === first * second) { // 정답 맞췄으면
            setResult('정답');
            setFirst(Math.ceil(Math.random() * 9));
            setSecond(Math.ceil(Math.random() * 9));
            setValue('');
            if (input) {
                input.focus();
            }
        
        } else {
            setResult('땡');
            setValue('');
            if (input) {
                input.focus();
            }
        }
    }
    //preventDefault : form 안에 submit 역할을 하는 버튼을 눌렀어도 새로 실행하지 않게 하고싶을 경우 (submit은 작동됨)

    return (
        <>
            <div>{first} 곱하기 {second}는?</div>
            <form onSubmit={onSubmitForm}>
                <input
                    ref={inputEl}
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </form>
            <div>{result}</div>
        </>
    )
}

export default GuGuDan;