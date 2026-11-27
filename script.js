const canvas = document.getElementById('canvas');
const colorOfPenc = document.getElementById('color');
const sizeOfPenc = document.getElementById('sizeOfPencil');
const btnToDraw = document.getElementById('btnToDraw');
const btnToUndo = document.getElementById('btnToUndo');
const btnToErase = document.getElementById('btnToErase');
const btnToClear = document.getElementById('btnToClear');
const btnToStamp = document.getElementById('btnToStamp');

canvas.width = 500;
canvas.height = 500;
const ctx = canvas.getContext('2d');

const imgToStamp = new Image();
imgToStamp.src = 'heart.png';

const stampTool = {
    stamp: 1,
    notStamp: 0
}
let curStateOfStamp = stampTool.notStamp;

let prevX = null;
let prevY = null;

let hist = [];

function saveHist(){
    const lastImg = ctx.getImageData(0,0,canvas.width, canvas.height);
    hist.push(lastImg);
}

function* canvasState(onDraw, onIdle){
    let drawing = false;
    while(true){
        const event = yield;
        if(event.type === 'mousedown'){
            drawing = true;
            saveHist();
            onDraw(event.offsetX, event.offsetY);
        }
        else if(event.type === 'mousemove' && drawing && curStateOfStamp === stampTool.notStamp){
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
        if(curStateOfStamp === stampTool.stamp){
            ctx.drawImage(imgToStamp,x,y,50,50);
            return;
        }
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
    curStateOfStamp = stampTool.notStamp;
    curColor = colorOfPenc.value;
});

btnToErase.addEventListener('click', ()=>{
    curStateOfStamp = stampTool.notStamp;
    curColor = 'rgb(255, 250, 240)';
});

colorOfPenc.addEventListener('input', ()=>{
    curColor = colorOfPenc.value;
});

btnToClear.addEventListener('click',()=>{
    ctx.clearRect(0,0,canvas.width, canvas.height);
});

btnToStamp.addEventListener('click',()=>{
    curStateOfStamp = stampTool.stamp;
})

btnToUndo.addEventListener('click', ()=>{
    if(hist.length === 0){
        return;
    }
    const prevImg = hist.pop();
    ctx.putImageData(prevImg, 0,0);
})
