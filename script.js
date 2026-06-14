const canvas =
    document.getElementById("wheel");

const ctx =
    canvas.getContext("2d");

const spinBtn =
    document.getElementById("spinBtn");

const editBtn =
    document.getElementById("editBtn");

const labelEditor =
    document.getElementById("labelEditor");

const labelInput =
    document.getElementById("labelInput");

const saveLabel =
    document.getElementById("saveLabel");

const SIZE = 1000;
const CENTER = SIZE / 2;
const RADIUS = 440;

let spinning = false;
let editMode = false;
let currentRotation = 0;
let selectedSlice = null;

let labels = [
    "Label 1",
    "Label 2",
    "Label 3",
    "Label 4",
    "Label 5",
    "Label 6",
    "Label 7",
    "Label 8"
];

const colors = [
    "#F9E6E5",
    "#F7DEDD",
    "#F5D6D5",
    "#F3CECD",
    "#F8E2E1",
    "#F6DADA",
    "#F4D2D1",
    "#F8E4E3"
];

function lighten(hex, amount){

    let num =
        parseInt(
            hex.replace("#",""),
            16
        );

    let r =
        Math.min(
            255,
            (num>>16)+amount
        );

    let g =
        Math.min(
            255,
            ((num>>8)&255)+amount
        );

    let b =
        Math.min(
            255,
            (num&255)+amount
        );

    return `rgb(${r},${g},${b})`;
}

function drawWheel(){

    ctx.clearRect(
        0,
        0,
        SIZE,
        SIZE
    );

    const count =
        labels.length;

    const arc =
        (Math.PI*2)/count;

    for(let i=0;i<count;i++){

        const start =
            i*arc;

        const end =
            start+arc;

        const grad =
            ctx.createRadialGradient(
                CENTER,
                CENTER,
                40,
                CENTER,
                CENTER,
                RADIUS
            );

        grad.addColorStop(
            0,
            lighten(
                colors[i],
                12
            )
        );

        grad.addColorStop(
            1,
            colors[i]
        );

        ctx.beginPath();

        ctx.moveTo(
            CENTER,
            CENTER
        );

        ctx.arc(
            CENTER,
            CENTER,
            RADIUS,
            start,
            end
        );

        ctx.closePath();

        ctx.fillStyle =
            grad;

        ctx.fill();

        ctx.strokeStyle =
            "rgba(255,255,255,.7)";

        ctx.lineWidth =
            1.5;

        ctx.stroke();

        drawLabel(
            labels[i],
            start + arc/2
        );
    }

    drawOuterRing();
    drawGloss();
}

function drawLabel(
    text,
    angle
){

    ctx.save();

    ctx.translate(
        CENTER,
        CENTER
    );

    ctx.rotate(angle);

    ctx.fillStyle =
        "#A86673";

    ctx.font =
        "500 20px Inter";

    ctx.textAlign =
        "center";

    ctx.textBaseline =
        "middle";

    ctx.fillText(
        text,
        RADIUS*.63,
        0
    );

    ctx.restore();
}

function drawOuterRing(){

    ctx.beginPath();

    ctx.arc(
        CENTER,
        CENTER,
        RADIUS+6,
        0,
        Math.PI*2
    );

    ctx.lineWidth =
        12;

    ctx.strokeStyle =
        "#ead0d1";

    ctx.stroke();

    ctx.beginPath();

    ctx.arc(
        CENTER,
        CENTER,
        RADIUS+2,
        0,
        Math.PI*2
    );

    ctx.lineWidth =
        2;

    ctx.strokeStyle =
        "#fff8f8";

    ctx.stroke();
}

function drawGloss(){

    const grad =
        ctx.createLinearGradient(
            0,
            0,
            CENTER,
            CENTER
        );

    grad.addColorStop(
        0,
        "rgba(255,255,255,.35)"
    );

    grad.addColorStop(
        .4,
        "rgba(255,255,255,.12)"
    );

    grad.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );

    ctx.save();

    ctx.beginPath();

    ctx.arc(
        CENTER,
        CENTER,
        RADIUS,
        0,
        Math.PI*2
    );

    ctx.clip();

    ctx.fillStyle =
        grad;

    ctx.fillRect(
        0,
        0,
        SIZE,
        SIZE
    );

    ctx.restore();
}

function spinWheel(){

    if(spinning)
        return;

    spinning = true;

    const count =
        labels.length;

    const sliceAngle =
        360/count;

    const chosen =
        Math.floor(
            Math.random()*count
        );

    const offset =
        5 +
        Math.random()*
        (sliceAngle-10);

    const landing =
        chosen*sliceAngle+
        offset;

    currentRotation +=
        2160 +
        (360-landing);

    canvas.style.transform =
        `rotate(${currentRotation}deg)`;

    setTimeout(() => {

        spinning = false;

    },5000);
}

spinBtn.addEventListener(
    "click",
    spinWheel
);

editBtn.addEventListener(
    "click",
    () => {

        editMode =
            !editMode;

        editBtn.classList.toggle(
            "active"
        );

        labelEditor.classList.add(
            "hidden"
        );
    }
);

canvas.addEventListener(
    "click",
    (event) => {

        if(!editMode)
            return;

        const rect =
            canvas.getBoundingClientRect();

        const x =
            ((event.clientX -
            rect.left) /
            rect.width) *
            SIZE;

        const y =
            ((event.clientY -
            rect.top) /
            rect.height) *
            SIZE;

        const dx =
            x - CENTER;

        const dy =
            y - CENTER;

        const dist =
            Math.sqrt(
                dx*dx +
                dy*dy
            );

        if(dist > RADIUS)
            return;

        let angle =
            Math.atan2(
                dy,
                dx
            );

        if(angle < 0)
            angle +=
                Math.PI*2;

        const arc =
            (Math.PI*2)/
            labels.length;

        selectedSlice =
            Math.floor(
                angle/arc
            );

        labelInput.value =
            labels[
                selectedSlice
            ];

        labelEditor.classList.remove(
            "hidden"
        );

        labelInput.focus();
    }
);

function saveCurrentLabel(){

    if(selectedSlice===null)
        return;

    const value =
        labelInput.value.trim();

    if(value){

        labels[
            selectedSlice
        ] = value;

        drawWheel();
    }

    labelEditor.classList.add(
        "hidden"
    );
}

saveLabel.addEventListener(
    "click",
    saveCurrentLabel
);

labelInput.addEventListener(
    "keydown",
    e => {

        if(e.key==="Enter")
            saveCurrentLabel();
    }
);

drawWheel();
