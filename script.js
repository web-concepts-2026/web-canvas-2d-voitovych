const canvas = document.getElementById('canvas');
const colorOfPenc = document.getElementById('color');
const sizeOfPenc = document.getElementById('sizeOfPencil');
const btnToDraw = document.getElementById('btnToDraw');
const btnToUndo = document.getElementById('btnToUndo');
const btnToErase = document.getElementById('btnToErase');
const btnToClear = document.getElementById('btnToClear');

canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext('2d');


let prevX = null;
let prevY = null;

function* canvasState(onDraw, onIdle){
    let drawing = false;
    while(true){
        const event = yield;
        if(event.type === 'mousedown'){
            drawing = true;
            onDraw(event.offsetX, event.offsetY);
        }
        else if(event.type === 'mousemove' && drawing){
            onDraw(event.offsetX, event.offsetY);
        }
        else if(event.type === 'mouseleave' || event.type === 'mouseup'){
            drawing=false;
            onIdle();
        }
    }
}
let curColor = colorOfPenc.value;
const state = canvasState(
    (x,y)=>{
        ctx.beginPath();
        if(prevX === null && prevY === null){
            ctx.moveTo(x,y);   
        }
        else{
            ctx.moveTo(prevX,prevY);
        }
        ctx.lineTo(x,y);
        prevX = x;
        prevY = y;
        ctx.strokeStyle = curColor;
        ctx.lineWidth = sizeOfPenc.value;
        ctx.lineCap = 'round';
        ctx.stroke();
    },
    ()=>{
        prevX = null;
        prevY = null;
    }
);
state.next();

canvas.addEventListener('mousedown',(e) => {
    state.next(e);
});
canvas.addEventListener('mousemove',(e)=>{
    state.next(e);
});
canvas.addEventListener('mouseleave',(e)=>{
    state.next(e);
});
canvas.addEventListener('mouseup', (e)=>{
    state.next(e);
});


btnToDraw.addEventListener('click', ()=>{
    curColor = colorOfPenc.value;
});

btnToErase.addEventListener('click', ()=>{
    curColor = 'rgb(255, 250, 240)';
});

colorOfPenc.addEventListener('input', ()=>{
    curColor = colorOfPenc.value;
});

btnToClear.addEventListener('click',()=>{
    ctx.clearRect(0,0,canvas.width, canvas.height);
})
