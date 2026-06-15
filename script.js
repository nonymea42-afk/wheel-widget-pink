const wheel =
document.getElementById("wheel");

const spinBtn =
document.getElementById("spinBtn");

const toggleEditor =
document.getElementById("toggleEditor");

const labelEditor =
document.getElementById("labelEditor");

const COLORS = [
"#f9e2e2",
"#f2caca"
];

const STORAGE_KEY =
"pink-wheel-labels";

let labels =
JSON.parse(
localStorage.getItem(
STORAGE_KEY
)
) || [
"One",
"Two",
"Three",
"Four",
"Five",
"Six",
"Seven",
"Eight"
];

let rotation = 0;

let spinning = false;

let editMode = false;

let selectedSlice = null;

function saveLabels(){

```
localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(labels)
);
```

}

function polarToCartesian(
r,
angle
){

```
return {

    x:
        r *
        Math.cos(angle),

    y:
        r *
        Math.sin(angle)
};
```

}

function describeSlice(
start,
end,
radius
){

```
const p1 =
    polarToCartesian(
        radius,
        start
    );

const p2 =
    polarToCartesian(
        radius,
        end
    );

return `
    M 0 0
    L ${p1.x} ${p1.y}
    A ${radius} ${radius}
      0 0 1
      ${p2.x} ${p2.y}
    Z
`;
```

}

function openEditor(i){

```
selectedSlice = i;

labelEditor.value =
    labels[i];

labelEditor.style.display =
    "block";

labelEditor.focus();

labelEditor.select();
```

}

function render(){

```
wheel.innerHTML = "";

const count =
    labels.length;

const step =
    (Math.PI * 2) /
    count;

labels.forEach(
    (
        label,
        i
    ) => {

        const start =
            i * step;

        const end =
            start + step;

        const path =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );

        path.setAttribute(
            "d",
            describeSlice(
                start,
                end,
                280
            )
        );

        path.setAttribute(
            "fill",
            COLORS[
                i %
                COLORS.length
            ]
        );

        if(editMode){

            path.style.cursor =
                "pointer";

            path.addEventListener(
                "click",
                () =>
                    openEditor(i)
            );
        }

        wheel.appendChild(
            path
        );

        const angle =
            start +
            step / 2;

        const pos =
            polarToCartesian(
                180,
                angle
            );

        const text =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "text"
            );

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
            "#876767"
        );

        text.setAttribute(
            "font-size",
            "24"
        );

        text.setAttribute(
            "class",
            "slice-label"
        );

        text.textContent =
            label;

        wheel.appendChild(
            text
        );
    }
);
```

}

spinBtn.addEventListener(
"click",
() => {

```
    if(
        spinning ||
        editMode
    ){
        return;
    }

    spinning = true;

    const count =
        labels.length;

    const slice =
        Math.floor(
            Math.random() *
            count
        );

    const sliceAngle =
        360 / count;

    const centerOffset =
        sliceAngle / 2;

    const target =
        360 -
        (
            slice *
            sliceAngle +
            centerOffset
        );

    rotation +=
        360 * 6 +
        target;

    wheel.style.transform =
        `rotate(${rotation}deg)`;

    setTimeout(
        () => {
            spinning =
                false;
        },
        6000
    );
}
```

);

toggleEditor.addEventListener(
"click",
() => {

```
    editMode =
        !editMode;

    if(!editMode){

        labelEditor.style.display =
            "none";

        selectedSlice =
            null;
    }

    toggleEditor.textContent =
        editMode
            ? "✓ Done"
            : "⚙ Edit Labels";

    toggleEditor.style.background =
        editMode
            ? "linear-gradient(135deg,#efd4a3,#d8a86c)"
            : "linear-gradient(135deg,#f8e8eb,#f3d9df)";

    render();
}
```

);

labelEditor.addEventListener(
"keydown",
e => {

```
    if(
        e.key === "Enter" &&
        selectedSlice !== null
    ){

        labels[
            selectedSlice
        ] =
            labelEditor.value.trim()
            || labels[
                selectedSlice
            ];

        saveLabels();

        labelEditor.style.display =
            "none";

        selectedSlice =
            null;

        render();
    }
}
```

);

render();
