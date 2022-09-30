let lastRandom = -1;
const service = {

    'popOff': (values, element, timeout) => {
        return new Promise ((res, rej)=> {
            for (let i=0 ; i<values.length ; i++) {
                const elemenClone = element.cloneNode();
                setTimeout(()=>{
                    clearContent();
                    elemenClone.append(values[i]) 
                    console.log( elemenClone )
                    pushContent(elemenClone);
                }, timeout*(i+1))
            }
    
            setTimeout(()=>{
                clearContent();
                res();
            }, timeout*(values.length+1))
        })
    },
    
    'getRandomNumber':function( max ){
        let Number = Math.floor(Math.random() * max );
        while (Number == lastRandom) {
            Number = Math.floor(Math.random() * max );
        } 
        lastRandom = Number;
        return lastRandom;
    }
}

window.onload = () => {
    const startButton = document.getElementById('start').content.lastElementChild;
  


    startButton.addEventListener('click', ()=>{
        clearContent();
        MemoryGame.showInterface('calc-content');
        
    })

    pushContent(startButton)
}






function pushContent ( content ) {
    const root = document.getElementById("root");
    root.appendChild(content);
}

function clearContent () {
    const root = document.getElementById("root");
    while (root.firstChild) {
        root.removeChild(root.lastChild)
    }
}





const memoryGame = function(){
    let lvl=1;
    let arrayNumbers = [];

    nextLevel = () => {
        lvl++;
        setNumbersLvl();
    }

    setNumbersLvl = () => {
        arrayNumbers.splice(0);
        for (let i=0 ; i<lvl ; i++) {
            arrayNumbers.push(service.getRandomNumber(10));
        }
    } 
    setNumbersLvl();

    return {
        'checkAnswer': ( numbers ) => {
            return new Promise ((res, rej)=>{
                if (compareArray(numbers, arrayNumbers)) {
                    nextLevel();
                    res({message: 'Correcto!'});
                } else {
                    rej({maxLvl: lvl});
                }
            })
        },

        'getNumbers': () => {
            return arrayNumbers;
        },

        'showInterface': function( Idinterface ){
            service.popOff(this.getNumbers(), 
            document.getElementById('number').content.lastElementChild, 
            1000
            ).then(_=>
                {
                    const interface = document.getElementById(Idinterface);
                    const cloneInterface = interface.cloneNode(true)
                    pushContent(cloneInterface.content);


                   

                    
                }
               
            )
        }
    }
}

const MemoryGame = new memoryGame();




function compareArray (arr_1, arr_2){
    return arr_1.length === arr_2.length && 
    arr_1.every((value, index) => value === arr_2[index])
}




function setCalcContent() {
    const calcHandler = new Vue({
        el: '#calc-display',
        data: {
            numbers: []
        },
        methods: {
            addNumber( n ){
                this.numbers.push(n);
            },

            clearNumbers () {
                this.numbers.splice(0);
            },

            getFullNumbers () {
                return this.numbers;
            }
        }
    })


    const numbersFragment = document.createDocumentFragment();
    const numberButton = document.createElement('button');
    numberButton.classList.add('number-button')

    for (let i=0 ; i<10 ; i++) {
        const cloneButton = numberButton.cloneNode();
        cloneButton.textContent = i;
        cloneButton.addEventListener('click', (event)=>{
            calcHandler.addNumber(i)
        })

        numbersFragment.appendChild(cloneButton)
    }



    document.getElementById('calc-numbers').appendChild(numbersFragment)    
    
    const buttonRef = document.getElementById('dashboard');
    const buttonRefClone = buttonRef.cloneNode(true)
    pushContent(buttonRefClone.content);
    

    
    document.getElementById('delete').addEventListener('click', ()=>{
        calcHandler.clearNumbers()
    })

    document.getElementById('send').addEventListener('click', ()=>{
        const Numbers = calcHandler.getFullNumbers();
        MemoryGame.checkAnswer(Numbers)
        .then(({message}) => {
            alert(message);
            MemoryGame.showInterface('calc-content')
        }).catch(({maxLvl}) => {
            alert(`Fallaste, pero tu puntuación maxima fueron ${maxLvl-1} consecutivos`);
            this.location.reload();
        })

    });
}
