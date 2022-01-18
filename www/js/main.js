const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

const numberCoords = [
    [360, 90],
    [430, 160],
    [465, 265],
    [430, 370],
    [360, 440],
    [255, 470],
    [150, 440],
    [80, 370],
    [45, 265],
    [85, 160],
    [150, 90],
    [255, 60]
]

const themes = {
    dark: {
        white: "#FFFFFF",
        brown: "#966400",
        black: "#000000"
    },
    light: {
        white: "#000000",
        brown: "#FF0000",
        black: "#FFFFFF"
    }
}

const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

function formatDate(date, options = { noDate: false, utc: false }) {
    let hours = options.utc ? date.getUTCHours() : date.getHours();

    return (options.noDate ? "" : weekdays[options.utc ? date.getUTCDay() : date.getDay()] + ", " +
    months[options.utc ? date.getUTCMonth() : date.getMonth()] + " " +
    (options.utc ? date.getUTCDate() : date.getDate()) + ", " +
    (options.utc ? date.getUTCFullYear() : date.getFullYear()) + ", ") +
    (hours % 12 == 0 ? 12 : hours % 12) + ":" +
    (options.utc ? date.getUTCMinutes() : date.getMinutes()).toString().padStart(2, "0") +
    (options.noDate ? "" : ":" + (options.utc ? date.getUTCSeconds() : date.getSeconds()).toString().padStart(2, "0")) + " " +
    (hours > 11 ? "PM" : "AM") +
    (options.noDate ? "" : " (" + (options.utc ? "UTC" : moment().tz(new Intl.DateTimeFormat().resolvedOptions().timeZone).zoneAbbr()) + ")");
}

function onCheck(index, date) {
    let checkboxes = document.getElementsByTagName("input");
    let checkbox = checkboxes.item(index);
    (index == 0 ? checkboxes.item(1) : checkboxes.item(0)).checked = !checkbox.checked;

    if (checkbox.checked)
        reloadTheme(checkbox.id, date);
}

function reloadCanvas(date) {
    let hours = date.getHours() % 12 == 0 ? 12 : date.getHours() % 12;
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let ctx = document.getElementsByTagName("canvas").item(0).getContext("2d");
    ctx.clearRect(0, 0, 510, 510);

    // Time indicator lines
    for (let i = 1; i < 61; i++) {
        ctx.beginPath();
        ctx.lineWidth = i % 5 == 0 ? 8 : 2;
        ctx.translate(255, 255);
        ctx.rotate(Math.PI * i / 30);
        ctx.translate(-255, -255);
        ctx.moveTo(255, 5);
        ctx.lineTo(255, i % 5 == 0 ? 30 : 25);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.strokeStyle = themes[theme].white;
        ctx.stroke();
    }

    // Hour indicators
    for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.font = "30px Tahoma, Verdana, Segoe, sans-serif";
        ctx.textAlign = "center";
        ctx.fillStyle = themes[theme].white;
        ctx.fillText(i + 1, numberCoords[i][0], numberCoords[i][1]);
        ctx.stroke();
    }

    // Hour handle
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.translate(255, 255);
    ctx.rotate(Math.PI * (hours * 30 + Math.floor(minutes / 2)) / 180);
    ctx.translate(-255, -255);
    ctx.moveTo(255, 255);
    ctx.lineTo(255, 133);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.stroke();

    // Minute handle
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.translate(255, 255);
    ctx.rotate(Math.PI * (minutes * 6 + Math.floor(seconds / 10)) / 180);
    ctx.translate(-255, -255);
    ctx.moveTo(255, 255);
    ctx.lineTo(255, 5);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.stroke();

    // Second handle
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.translate(255, 255);
    ctx.rotate(Math.PI * seconds / 30);
    ctx.translate(-255, -255);
    ctx.moveTo(255, 255);
    ctx.lineTo(255, 5);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = themes[theme].brown;
    ctx.stroke();

    // Clock base
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.arc(255, 255, 250, 0, 2 * Math.PI);
    ctx.strokeStyle = themes[theme].white;
    ctx.stroke();

    // Handle connector
    ctx.beginPath();
    ctx.strokeStyle = themes[theme].white;
    ctx.arc(255, 255, 10, 0, 2 * Math.PI);
    ctx.fillStyle = themes[theme].white;
    ctx.fill();
    ctx.stroke();
}

function reloadTheme(newTheme, date) {
    theme = newTheme;
    localStorage.setItem("com.time-viewer.theme", theme);
    document.body.style.backgroundColor = themes[theme].black;

    let paragraphs = document.getElementsByTagName("p");
    for (let i = 0; i < paragraphs.length; i++)
        paragraphs.item(i).style.color = themes[theme].white;

    let headings = document.getElementsByTagName("h1");
    for (let i = 0; i < headings.length; i++)
        headings.item(i).style.color = themes[theme].white;

    document.getElementsByTagName("img").item(0).src = "img/logo-" + theme + ".png";

    reloadCanvas(date);
}

function reloadTime(date) {
    document.getElementById("time").innerHTML =
    formatDate(date) + "<br>" +
    formatDate(date, { utc: true }) + "<br>" +
    "Unix Time: " + Math.floor(date.getTime() / 1000);

    document.getElementsByTagName("title").item(0).innerHTML = "time-viewer.com | " + formatDate(date, { noDate: true });
}