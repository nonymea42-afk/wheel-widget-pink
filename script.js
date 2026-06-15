const svg =
document.getElementById("wheel");

const spinBtn =
document.getElementById("spinBtn");

const labelEditor =
document.getElementById("labelEditor");

const toggleEditor =
document.getElementById("toggleEditor");

const COUNT = 8;

let rotation = 0;
let spinning = false;

let editMode = false;
let editingIndex = null;

const defaults = [
"Label 1",
"Label 2",
"Label 3",
"Label 4",
"Label 5",
"Label 6",
"Label 7",
"Label 8"
];

let labels =
JSON.parse(
localStorage.getItem(
"pinkWheelLabels"
)
) || [...defaults];

function saveLabels(){

```
localStorage.setItem(
    "pinkWheelLabels",
    JSON.stringify(labels)
);
```

}

function polar(r, angle){

```
const rad =
    (angle - 90)
    * Math.PI
    / 180;

return {
    x: r * Math.cos(rad),
    y: r * Math.sin(rad)
};
```

}

function beginEdit(index){

```
if(!editMode) return;

editingIndex = index;

labelEditor.style.display =
    "block";

labelEditor.value =
    labels[index];

labelEditor.focus();
labelEditor.select();
```

}

function saveCurrentLabel(){

```
if(editingIndex === null)
    return;

const value =
    labelEditor.value.trim();

if(value){

    labels[editingIndex] =
        value;

    saveLabels();

    render();
}
```

}

function render(){

```
svg.innerHTML = "";

const radius = 280;
const step = 360 / COUNT;

for(let i = 0; i < COUNT; i++){

    const start =
        i * step;

    const end =
        (i + 1) * step;

    const p1 =
        polar(radius,end);

    const p2 =
        polar(radius,start);

    const path =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

    path.setAttribute(
        "d",
        `
        M 0 0
        L ${p1.x} ${p1.y}
        A ${radius} ${radius}
        0 0 0
        ${p2.x} ${p2.y}
        Z
        `
    );

    path.setAttribute(
        "fill",
        i % 2
            ? "#e9cfcf"
            : "#f1dddd"
    );

    svg.appendChild(path);

    const angle =
        start + step / 2;

    const pos =
        polar(
            radius * 0.72,
            angle
        );

    const text =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

    text.textContent =
        labels[i];

    text.setAttribute(
        "x",
        pos.x
    );

    text.setAttribute(
        "y",
        pos.y
    );

    text.setAttribute(
        "text-anchor",
        "middle"
    );

    text.setAttribute(
        "dominant-baseline",
        "middle"
    );

    text.setAttribute(
        "fill",
        "#856d6d"
    );

    text.setAttribute(
        "font-size",
        "22"
    );

    text.setAttribute(
        "font-family",
        "Cormorant Garamond"
    );

    text.setAttribute(
        "transform",
        `rotate(${angle} ${pos.x} ${pos.y})`
    );

    text.style.cursor =
        editMode
            ? "pointer"
            : "default";

    text.addEventListener(
        "click",
        () => beginEdit(i)
    );

    svg.appendChild(text);
}
```

}

function spin(){

```
if(spinning) return;

spinning = true;

const step =
    360 / COUNT;

const winner =
    Math.floor(
        Math.random() * COUNT
    );

const safetyMargin = 10;

const stopAngle =
    winner * step +
    safetyMargin +
    Math.random() *
    (step - safetyMargin * 2);

const extraSpins =
    360 *
    (
        8 +
        Math.floor(
            Math.random() * 3
        )
    );

rotation +=
    extraSpins +
    (360 - stopAngle);

svg.style.transform =
    `rotate(${rotation}deg)`;

setTimeout(() => {

    spinning = false;

}, 6000);
```

}

toggleEditor.addEventListener(
"click",
() => {

```
    editMode = !editMode;

    if(editMode){

        toggleEditor.textContent =
            "✓ Done";

    }else{

        saveCurrentLabel();

        editingIndex = null;

        labelEditor.style.display =
            "none";

        toggleEditor.textContent =
            "⚙ Edit Labels";
    }

    render();
}
```

);

labelEditor.addEventListener(
"keydown",
e => {

```
    if(e.key === "Enter"){

        saveCurrentLabel();
    }
}
```

);

spinBtn.addEventListener(
"click",
spin
);

render();
