const $body = document.getElementById('body');
const $main = document.getElementById('main');
const $relative = document.querySelector('.relative');
const $timer = document.getElementById('timer');
const $questionframe = document.getElementById('questionframe');
const $questionNumber = document.getElementById('questionNumber');
const $numberofquestion = document.getElementById('numberofquestion');
const $questiontype = document.getElementById('questiontype');
const $level = document.getElementById('level');
const $question = document.getElementById('question');
const $optionsbox =  document.getElementById('options-box');
const $button = document.querySelectorAll('.option-btn');
const $input = document.getElementById('input');
const $decide = document.getElementById('decide');
const $pass = document.getElementById('pass');
const $finish = document.getElementById('finish');
const $result = document.getElementById('result');
const $extrabox = document.getElementById('extrabox');
const $extra = document.getElementById('extra');
const $resultbox = document.getElementById('resultbox');
const $resultgrid = document.getElementById('resultgrid');


let quizNumber = 0;
let questiontype;
let multiplexanswerbox = [];
let answerorder = [];
let score = 0;
let answers = [];

//問題文と選択肢を表示させる
const setupquiz = () =>{
    $questionNumber.firstChild.textContent  = `第${quizNumber + 1}問`;
    $numberofquestion.textContent =  `/${quiz.length}問`;

    const questionAnimate =()=>{
        $questiontype.textContent = questiontype;
        $questiontype.animate({
            opacity:[0,1],
            translate:['0 5px',0],
        },{
            duration:250,
            fill: 'forwards',
        });

        $question.textContent = quiz[quizNumber].question;
        $question.animate({
        opacity:[0,1],
        translate:['0 5px',0],
    },{
        duration:250,
        fill: 'forwards',
    });
    }

    setTimeout(questionAnimate,600);
    
    
    
    $finish.classList.add('hidden');
    

    //選択問題と記述問題とで条件分岐
    if(quiz[quizNumber].hasOwnProperty('options')){
        
        //一問一答
        questiontype = '【一問一答】';
        

        //アニメーション
        const optionsAnimate = ()=>{
            $input.classList.add('hidden');
            $optionsbox.classList.remove('hidden');
            for(let i =0; i < $button.length; i++){
                $button[i].textContent = quiz[quizNumber].options[i];
            }

            for(let i =0; i < $button.length; i++){
                $button[i].animate({
                    opacity:[0,1],
                    translate: ['0 -15px',0],
                    },{
                        duration:300,
                        delay:300*i,
                        fill: 'forwards',
                    });
            }
            for(let i = 0; i < $button.length; i++){
                let orderElement = document.createElement('div');
                $button[i].insertBefore(orderElement,$button[i].firstChild);               
        }

        };
            
        setTimeout(optionsAnimate ,600);
        
        
        if(Array.isArray(quiz[quizNumber].correct)){
            //一問多答
            questiontype = '【一問多答】';
            if(quiz[quizNumber].questiontype === '並べ替え'){
                //並び替え
                questiontype = '【並び替え】';
                
            
        answerorder = [];
            
        }}
    
    }else{
        //記述
        
        questiontype = '【記述】';
        

        //アニメーション
        const inputAnimate = ()=>{
            $optionsbox.classList.add('hidden');
            $input.classList.remove('hidden');
            $input.value = '';
            $input.animate({
                opacity:[0,1],
                translate: ['0 -10px',0],
                },{
                    duration:300,
                    fill: 'forwards',
                });
            };
            
        setTimeout(inputAnimate,500);
    }
    
    //高難易度表示
    if(quiz[quizNumber].hasOwnProperty('highlevel')){
        $level.textContent = '高難度';
        $body.classList.add('body_highlevel');
        $questionframe.classList.add('questionframe_highlevel');
    }else{
        $level.textContent = null;
        $body.classList.remove('body_highlevel');
        $questionframe.classList.remove('questionframe_highlevel');

    }
    
    //エクストラで制限時間表示
    if(quiz === extraquiz){
        clearTimeout(countdown);
        if(quiz[quizNumber].hasOwnProperty('options')){
            timer(30);
        }else{
            timer(60);
        }        
    }

    $decide.disabled = true;


   
    };


//選択肢を選ぶ
const selectanswer = ()=>{
    for(let i = 0; i < $button.length; i++){
        $button[i].addEventListener('click', (e)=>{

         //一問一答かどうか
        if(!Array.isArray(quiz[quizNumber].correct)){
            //一問一答押したボタン一つだけ色変わる
            if(e.target.classList.contains('clicked')){
                e.target.classList.remove('clicked');
            }
            else{
                for(let i = 0; i < $button.length; i++){
                    if($button[i].classList.contains('clicked')){
                        $button[i].classList.remove('clicked');
                    }
                }
                e.target.classList.add('clicked');
            }
            //ボタン選んだら決定ボタン使えるようになる
            if(e.target.classList.contains('clicked')){
                $decide.disabled = false;
            }else{
                for(let i = 0; i < $button.length; i++){
                    if($button[i].classList.contains('clicked')){
                        $decide.disabled = false;
                    }else{
                        $decide.disabled = true;
                    }
                }
            }
            
        }else {
            //並べ替え問題
            if(quiz[quizNumber].questiontype === '並べ替え'){
                e.currentTarget.classList.toggle('clicked');
                e.currentTarget.firstChild.classList.add('order');

                if(e.currentTarget.classList.contains('clicked')){
                    answerorder.push(e.currentTarget.textContent);
                    e.currentTarget.firstChild.textContent = answerorder.length;                                                        
                }else{
                    //並べ替え番号変わる
                    for(let i = 0; i < $button.length; i++){
                        if($button[i].firstChild.textContent > e.currentTarget.firstChild.textContent){
                            $button[i].firstChild.textContent = Number($button[i].firstChild.textContent) - 1;
                     }}
                    e.currentTarget.firstChild.textContent = null;                   
                   //indexofとsplice組み合わせる
                   answerorder.splice(answerorder.indexOf(e.currentTarget.textContent),1);                  
                }
                //全てのボタン選択したら決定ボタン押せるようになる
                    if(answerorder.length === quiz[quizNumber].correct.length){
                        $decide.disabled = false;
                    }else{
                        $decide.disabled = true;
                    }
            }else{ //一問多答
                e.target.classList.toggle('clicked');
                //ボタン選んだら決定ボタン使えるようになる
                if(e.target.classList.contains('clicked')){
                    $decide.disabled = false;
                }else{
                    $decide.disabled = true;
                    for(let i = 0; i < $button.length; i++){
                        if($button[i].classList.contains('clicked')){
                            $decide.disabled = false;
                        }
                    }
                }
            }
        }       
        });        
    };
};

//記述答え入力
//半角を全角に変換
function zenkaku2Hankaku(str) {
    return str.replace(/[A-Za-z0-9]/g, function(s) {
        return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
    });
}



const inputanswer =()=>{
    $input.addEventListener('change',()=>{        
       $input.value = zenkaku2Hankaku($input.value);  
    });

    $input.addEventListener('input',()=>{
        if($input.value){
            $decide.disabled = false;
        } else{
            $decide.disabled = true;
        }    
    });

    
};


//答え決定、正誤判定 
const judge = ()=>{
    $decide.addEventListener('click',()=>{
        if(quiz[quizNumber].hasOwnProperty('options')){
            //選択問題
            if(Array.isArray(quiz[quizNumber].correct)){

                if(quiz[quizNumber].questiontype === '並べ替え'){
                    //並び替え
                    if(answerorder.toString() === quiz[quizNumber].correct.toString()){
                        score++;
                    }
                    answers.push(answerorder);
                    console.log(answerorder.join('→'));
                }else{
                    //一問多答
                    let answer = document.querySelectorAll('.clicked');
                    multiplexanswerbox = [];
                    for(let i = 0; i < answer.length; i++){
                        multiplexanswerbox.push(answer[i].textContent);
                    }
                    if(multiplexanswerbox.toString() === quiz[quizNumber].correct.toString()){
                        score++;
                    }   
                    answers.push(multiplexanswerbox);
                    console.log(multiplexanswerbox.toString());
                }                
            }else{
                //一問一答
                let answer = document.querySelector('.clicked');
                console.log(answer.textContent);
                    if(answer.textContent === quiz[quizNumber].correct){
                score++;
                }   
                answers.push(answer.textContent);             
            }
            console.log('score ' + score);
            gotonext ();
        }else{
            //記述問題
            console.log($input.value)
            if($input.value === quiz[quizNumber].correct){
                score++;
            }
            answers.push($input.value);
            console.log('score ' + score);
            gotonext ();
        }  
        
        
    });
};

//パスする
const $modal = document.querySelector('.modal');
const $modalcontainer = document.querySelector('.modal-container');
const $passdecide = document.querySelectorAll('.passdecide');
const pass = ()=>{
    $pass.addEventListener('click', ()=>{
        $modal.classList.remove('hidden')
    });

    $modal.addEventListener('click', (e)=>{
        if(!(e.target === $modalcontainer ) && !(e.target === $modalcontainer.firstElementChild) ){
            $modal.classList.add('hidden')
        }        
    });

    $passdecide[0].addEventListener('click', ()=>{
        answers.push('');
        console.log('pass');
        console.log('score ' + score);
        gotonext();
    });
};


//次の問題表示か終了
const gotonext = () =>{
    //アニメーション 要素非表示
    $questiontype.animate({
        opacity:[1,0],
        translate:[0,'0 5px'],
    },{
        duration:200,
        fill: 'forwards',
    });
    $question.animate({
        opacity:[1,0],
        translate:[0,'0 5px'],
    },{
        duration:200,
        fill: 'forwards',
    });

    if(quiz[quizNumber].hasOwnProperty('options')){
        for(let i =0; i < $button.length; i++){
            $button[i].animate({
                opacity:[1,0],
                },{
                    duration:200,
                    fill: 'forwards',
                });
        }
    } else{
        $input.animate({
            opacity:[1,0],
            },{
                duration:200,
                fill: 'forwards',
            });

    }




    for(let i = 0; i < $button.length; i++){
        $button[i].classList.remove('clicked');
        }
        
    quizNumber++;


    if(quiz === normalquiz){
        if(quizNumber < quiz.length){
            setupquiz();
        }else{
            //高難度非表示
            $level.textContent = null;
            $body.classList.remove('body_highlevel');
            $questionframe.classList.remove('questionframe_highlevel');
            finish();
        }
    }else{
        //エクストラ3問誤答で終了      
        if(quizNumber - score === 3){
            clearTimeout(countdown);
            finish();
        }else if(quizNumber < quiz.length){
            setupquiz();
        }else{
            finish();
        }
    }    
};

//制限時間
let countdown;
const timer = (settime)=>{
    settime--;
    let min = Math.floor(settime / 60).toString().padStart(2,'0');
    let sec = (settime % 60).toString().padStart(2,'0');
    $timer.textContent = min + ':'+ sec;
        
    if(quiz === normalquiz){
        //ノーマル
        if(settime === 0){
            finish();
            
        }else if(quizNumber < quiz.length){
            setTimeout(timer,1000,settime);
        }    
    }else{
        //エクストラ
        if(settime === 0){
            answers.push('');
            gotonext();
            
        }else if(quizNumber < quiz.length){
           countdown = setTimeout(timer,1000,settime);
        }   
    }
    
};


let quiz = normalquiz;
timer(3600);
setupquiz ();
selectanswer();
inputanswer();
judge();
pass();


//結果画面表示
const finish = ()=>{
    $body.classList.add('resultbody');
    $main.classList.add('hidden');
    $finish.classList.remove('hidden');
    $result.textContent = quiz.length + '問中 ' + score +  '問正解!!';
    console.log('result ' + score);
    creattable();
    if(quiz === normalquiz){
        if(score >= quiz.length*0.9){
            $resultbox.classList.add('hidden');
            $extra.addEventListener('click',()=>{
                $main.classList.remove('hidden');
                $finish.classList.add('hidden');
                $body.classList.remove('resultbody');
                $body.classList.add('extrabody');
                $relative.classList.add('textshadow');
                quizNumber = 0;
                score = 0;
                quiz = extraquiz;
                answers = [];
                setupquiz();            
            });
        } else{
            $extrabox.classList.add('hidden');
        }
    }else{
        $resultbox.classList.remove('hidden');
        $extrabox.classList.add('hidden');
        $body.classList.add('extraresult');
    }
};


const creattable = ()=>{
//表作成
    for(let i = 0; i < answers.length; i++){
        let $divbox = document.createElement('div');
        $resultgrid.appendChild($divbox);
        $div = document.createElement('div');
        if(quiz === normalquiz){
            $div.textContent = i + 1;
        } else{
            $div.textContent = 'EX' + (i + 1);
        }
        
        $divbox.appendChild($div);
        
        if(!Array.isArray(answers[i])){
            $divbox = document.createElement('div');
            $resultgrid.appendChild($divbox);
            $div = document.createElement('div');
            if(answers[i] === quiz[i].correct){
                $div.textContent = '◯';
            }else{
                $div.textContent = '×';
            }
            $divbox.appendChild($div);

            
            $div = document.createElement('div');
            $div.textContent = answers[i];
            $resultgrid.appendChild($div);

            $div = document.createElement('div');
            $div.textContent = quiz[i].correct;
            $resultgrid.appendChild($div);
        }else if(quiz[i].questiontype === '一問多答'){
            $divbox = document.createElement('div');
            $resultgrid.appendChild($divbox);
            $div = document.createElement('div');
            if(answers[i].toString() === quiz[i].correct.toString()){
                $div.textContent = '◯';
            }else{
                $div.textContent = '×';
            }
            $divbox.appendChild($div);

            $div = document.createElement('div');
            $div.textContent = answers[i].toString();
            $resultgrid.appendChild($div);

            $div = document.createElement('div');
            $div.textContent = quiz[i].correct.toString() ;
            $resultgrid.appendChild($div);
        }else{
            $divbox = document.createElement('div');
            $resultgrid.appendChild($divbox);
            $div = document.createElement('div');
            if(answers[i].toString() === quiz[i].correct.toString()){
                $div.textContent = '◯';
            }else{
                $div.textContent = '×';
            }
            $divbox.appendChild($div);

            $div = document.createElement('div');
            $div.textContent = answers[i].join('→');
            $resultgrid.appendChild($div);

            $div = document.createElement('div');
            $div.textContent = quiz[i].correct.join('→');
            $resultgrid.appendChild($div);

        }
    }


};

