const svg =
    document.getElementById("wheel");

const spinBtn =
    document.getElementById("spinBtn");

const toggleEditor =
    document.getElementById("toggleEditor");

const editor =
    document.getElementById("editor");

const inputsContainer =
    document.getElementById("inputs");

const saveBtn =
    document.getElementById("saveLabels");

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
            "transform",
            `rotate(${angle} ${pos.x} ${pos.y})`
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

function renderInputs(){

    inputsContainer.innerHTML = "";

    labels.forEach(
        (label,index) => {

            const input =
                document.createElement(
                    "input"
                );

            input.className =
                "label-input";

            input.value =
                label;

            input.dataset.index =
                index;

            inputsContainer.appendChild(
                input
            );
        }
    );
}

toggleEditor.addEventListener(
    "click",
    () => {

        editor.classList.toggle(
            "hidden"
        );

        renderInputs();
    }
);

saveBtn.addEventListener(
    "click",
    () => {

        const inputs =
            document.querySelectorAll(
                ".label-input"
            );

        labels =
            [...inputs].map(
                input =>
                    input.value.trim()
                    || "Label"
            );

        saveLabels();

        render();
    }
);

function spin(){

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
}

spinBtn.addEventListener(
    "click",
    spin
);

render();
