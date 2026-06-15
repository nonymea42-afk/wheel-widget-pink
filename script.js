const svg =
    document.getElementById("wheel");

const spinBtn =
    document.getElementById("spinBtn");

const result =
    document.getElementById("result");
const editBtn =
    document.getElementById(
        "editBtn"
    );

const overlay =
    document.getElementById(
        "overlay"
    );

const labelInput =
    document.getElementById(
        "labelInput"
    );

const saveLabel =
    document.getElementById(
        "saveLabel"
    );

const cancelLabel =
    document.getElementById(
        "cancelLabel"
    );

let editMode = false;

let currentSlice = null;

const COUNT = 8;

let rotation = 0;
let spinning = false;

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
    ) || defaults;

function saveLabels(){

    localStorage.setItem(
        "pinkWheelLabels",
        JSON.stringify(labels)
    );
}

function polar(r, angle){

    const rad =
        (angle - 90)
        * Math.PI
        / 180;

    return {
        x: r * Math.cos(rad),
        y: r * Math.sin(rad)
    };
}

function createDefs(){

    const defs =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "defs"
        );

    for(let i = 0; i < COUNT; i++){

        const grad =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "linearGradient"
            );

        grad.id = `grad${i}`;

        grad.setAttribute("x1","0%");
        grad.setAttribute("y1","0%");
        grad.setAttribute("x2","100%");
        grad.setAttribute("y2","100%");

        const stop1 =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "stop"
            );

        stop1.setAttribute(
            "offset",
            "0%"
        );

        stop1.setAttribute(
            "stop-color",
            i % 2
                ? "#f2caca"
                : "#f9e2e2"
        );

        const stop2 =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "stop"
            );

        stop2.setAttribute(
            "offset",
            "100%"
        );

        stop2.setAttribute(
            "stop-color",
            i % 2
                ? "#edbebe"
                : "#f7d7d7"
        );

        grad.appendChild(stop1);
        grad.appendChild(stop2);

        defs.appendChild(grad);
    }

    svg.appendChild(defs);
}

function openEditor(i){

    if(!editMode)
        return;

    currentSlice = i;

    labelInput.value =
        labels[i];

    overlay.classList.add(
        "show"
    );

    document.body.classList.add(
        "popup-open"
    );

    labelInput.focus();

    labelInput.select();
}

function closeEditor(){

    overlay.classList.remove(
        "show"
    );

    document.body.classList.remove(
        "popup-open"
    );

    currentSlice = null;
}

saveLabel.addEventListener(
    "click",
    () => {

        if(
            currentSlice === null
        ) return;

        const value =
            labelInput.value.trim();

        if(value){

            labels[
                currentSlice
            ] = value;

            saveLabels();

            render();
        }

        closeEditor();
    }
);

cancelLabel.addEventListener(
    "click",
    closeEditor
);

function render(){

    svg.innerHTML = "";

    createDefs();

    const radius = 280;
    const step = 360 / COUNT;

    const outer =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    outer.setAttribute("cx","0");
    outer.setAttribute("cy","0");
    outer.setAttribute("r",radius);
    outer.setAttribute("fill","#fdf5f5");

    svg.appendChild(outer);

    for(
        let i = 0;
        i < COUNT;
        i++
    ){

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
            `url(#grad${i})`
        );

        svg.appendChild(path);

        const angle =
            start + step / 2;

        const pos =
            polar(
                radius * 0.70,
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
            "#8c6b6b"
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
            "class",
            "slice-label"
        );

        text.setAttribute(
            "transform",
            `rotate(${angle} ${pos.x} ${pos.y})`
        );

        text.addEventListener(
    "click",
    () => openEditor(i)
);

        svg.appendChild(text);
    }

    const center =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    center.setAttribute(
        "cx",
        "0"
    );

    center.setAttribute(
        "cy",
        "0"
    );

    center.setAttribute(
        "r",
        "55"
    );

    center.setAttribute(
        "fill",
        "#ffffff"
    );

    svg.appendChild(center);
}

function spin(){

    if(spinning) return;

    spinning = true;

    result.textContent = "";

    const step =
        360 / COUNT;

    const winner =
        Math.floor(
            Math.random() * COUNT
        );

    // Prevent stopping near slice dividers
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

        result.textContent =
            labels[winner];

        spinning = false;

    }, 6000);
}

spinBtn.addEventListener(
    "click",
    spin
);

render();

editBtn.addEventListener(
    "click",
    () => {

        editMode = !editMode;

        document.body.classList.toggle(
            "editing"
        );

        editBtn.textContent =
            editMode
            ? "Done Editing"
            : "Edit Labels";
    }
);
