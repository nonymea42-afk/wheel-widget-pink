const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinBtn = document.getElementById("spinBtn");
const editBtn = document.getElementById("editBtn");

const SIZE = canvas.width;
const CENTER = SIZE / 2;
const RADIUS = 440;

let spinning = false;
let editMode = false;
let currentRotation = 0;

let labels = [
    "Label 1",
    "Label 2",
    "Label 3",
    "Label 4",
    "Label 5",
    "Label 6"
];

const colors = [
    "#F8DADB",
    "#F4C6CB",
    "#F8DADB",
    "#F1B6BD",
    "#F8DADB",
    "#EDA5AF"
];

function drawWheel() {

    ctx.clearRect(0, 0, SIZE, SIZE);

    const sliceCount = labels.length;
    const sliceAngle = (Math.PI * 2) / sliceCount;

    for (let i = 0; i < sliceCount; i++) {

        const start = i * sliceAngle;
        const end = start + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(CENTER, CENTER);
        ctx.arc(CENTER, CENTER, RADIUS, start, end);
        ctx.closePath();

        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 4;
        ctx.stroke();

        drawLabel(labels[i], start + sliceAngle / 2);
    }

    ctx.beginPath();
    ctx.arc(CENTER, CENTER, RADIUS, 0, Math.PI * 2);
    ctx.lineWidth = 10;
    ctx.strokeStyle = "#F7E4E6";
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(CENTER, CENTER, 14, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
}

function drawLabel(text, angle) {

    ctx.save();

    ctx.translate(CENTER, CENTER);
    ctx.rotate(angle);

    ctx.fillStyle = "#B35A6E";
    ctx.font = "34px Inter";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, RADIUS * 0.62, 0);

    ctx.restore();
}

function spinWheel() {

    if (spinning) return;

    spinning = true;

    const sliceCount = labels.length;
    const sliceAngle = 360 / sliceCount;

    const chosenSlice =
        Math.floor(Math.random() * sliceCount);

    /*
       Keep result away from boundaries.
       Minimum margin of 5 degrees.
    */
    const offsetInsideSlice =
        5 + Math.random() * (sliceAngle - 10);

    const landingAngle =
        chosenSlice * sliceAngle + offsetInsideSlice;

    const extraSpins = 2160;

    currentRotation +=
        extraSpins +
        (360 - landingAngle);

    canvas.style.transform =
        `rotate(${currentRotation}deg)`;

    setTimeout(() => {

        spinning = false;

        alert(
            `Result: ${labels[chosenSlice]}`
        );

    }, 5000);
}

spinBtn.addEventListener("click", spinWheel);

editBtn.addEventListener("click", () => {

    editMode = !editMode;

    editBtn.classList.toggle("active");

    editBtn.textContent =
        editMode
            ? "Editing Enabled"
            : "Edit Labels";
});

canvas.addEventListener("click", (event) => {

    if (!editMode || spinning) return;

    const rect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x =
        (event.clientX - rect.left) * scaleX;

    const y =
        (event.clientY - rect.top) * scaleY;

    const dx = x - CENTER;
    const dy = y - CENTER;

    const distance =
        Math.sqrt(dx * dx + dy * dy);

    if (distance > RADIUS) return;

    let angle = Math.atan2(dy, dx);

    if (angle < 0) {
        angle += Math.PI * 2;
    }

    const sliceAngle =
        (Math.PI * 2) / labels.length;

    const sliceIndex =
        Math.floor(angle / sliceAngle);

    const newLabel = prompt(
        "Change label:",
        labels[sliceIndex]
    );

    if (
        newLabel &&
        newLabel.trim() !== ""
    ) {
        labels[sliceIndex] =
            newLabel.trim();

        drawWheel();
    }
});

drawWheel();
