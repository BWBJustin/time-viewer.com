document.getElementById("root").style.display = "block";

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

const dt = new Intl.DateTimeFormat().resolvedOptions();

let urlParts = location.pathname.split("/").filter(x => x != "");

let hasTime = location.pathname.includes("/time/");
let time = hasTime ? decodeURIComponent(urlParts[urlParts.findIndex(x => x == "time") + 1]) : null;
time = hasTime && typeof time == "undefined" ? null : time;
hasTime = time != null;
let hasZone = location.pathname.includes("/zone/");
let zone = hasZone ? decodeURIComponent(urlParts[urlParts.findIndex(x => x == "zone") + 1]) : null;
zone = hasZone && typeof zone == "undefined" ? null : zone;
hasZone = zone != null;

let localDate = new Date(hasTime && validTimestamp(time) ? parseInt(time) * 1000 : Date.now());
let accurateDate = hasZone && validTimezone(zone) ? new Date(localDate.toLocaleString(dt.locale, { timeZone: zone })) : localDate;

let theme = localStorage.getItem("com.time-viewer.theme");
if (theme == null) {
    try {
        localStorage.setItem("com.time-viewer.theme", "dark");
        theme = localStorage.getItem("com.time-viewer.theme");
    } catch {
        theme = "dark";
    }
} else {
    theme = theme.toLowerCase();
    if (theme != "light" && theme != "dark") {
        localStorage.setItem("com.time-viewer.theme", "dark");
        theme = localStorage.getItem("com.time-viewer.theme");
    }
}

document.getElementById(theme).checked = true;

reloadTime(localDate, zone);
reloadTheme(theme, accurateDate);
if (!hasTime || !validTimestamp(time)) {
    let stamp = Math.floor(Date.now() / 1000);
    setInterval(() => {
        let previousStamp = stamp;
        stamp = Math.floor(Date.now() / 1000);

        if (previousStamp != stamp) {
            localDate = new Date();
            accurateDate = new Date(localDate.toLocaleString(dt.locale, { timeZone: hasZone && validTimezone(zone) ? zone : dt.timeZone }));
            reloadTime(localDate, zone);
            reloadCanvas(accurateDate);
        }
    }, 1);
}

function changeTheme(name, date) {
    let inputs = document.getElementsByTagName("input");
    let checkbox = inputs.namedItem(name);
    let opposite = name == "light" ? "dark" : "light";
    inputs.namedItem(opposite).checked = !checkbox.checked;

    reloadTheme(checkbox.checked ? name : opposite, date);
}

function formatDate(date, options = { timeZone: "" }) {
    let defaultOpts = options.timeZone ? { timeZone: options.timeZone } : {};

    return date.toLocaleString(dt.locale, { ...defaultOpts, dateStyle: "full" }) + ", " +
    date.toLocaleString(dt.locale, { ...defaultOpts, timeStyle: "medium" }) + " (" +
    new Intl.DateTimeFormat(dt.locale, { ...defaultOpts, timeZoneName: "short" })
    .formatToParts(date).find(x => x.type == "timeZoneName").value + ")";
}

function processUserInput() {
    let inputs = document.getElementsByTagName("input");
    let timestamp = inputs.namedItem("timestamp").value;
    let timestampValid = timestamp != "" ? validTimestamp(timestamp) : false;
    let timezone = inputs.namedItem("timezone").value;
    let timezoneValid = timezone != "" ? validTimezone(timezone) : false;

    if (!timestampValid && !timezoneValid)
        return;

    location.assign((timestampValid ? "/time/" + timestamp : "") + (timezoneValid ? "/zone/" + timezone : ""));
}

function reloadCanvas(date) {
    let hours = date.getHours() % 12;
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

    // Handle connector
    ctx.beginPath();
    ctx.strokeStyle = themes[theme].white;
    ctx.arc(255, 255, 10, 0, 2 * Math.PI);
    ctx.fillStyle = themes[theme].white;
    ctx.fill();
    ctx.stroke();

    // Clock base
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.arc(255, 255, 250, 0, 2 * Math.PI);
    ctx.strokeStyle = themes[theme].white;
    ctx.stroke();
}

function reloadTheme(newTheme, date) {
    document.body.style.backgroundColor = themes[newTheme].black;

    let buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
        let button = buttons.item(i);
        button.style.backgroundColor = themes[newTheme].black;
        button.style.borderColor = themes[newTheme].white;
        button.style.color = themes[newTheme].white;
    }

    let headings = document.getElementsByTagName("h1");
    for (let i = 0; i < headings.length; i++)
        headings.item(i).style.color = themes[newTheme].white;

    let inputs = document.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
        let input = inputs.item(i);
        input.classList.remove(theme);
        input.classList.add(newTheme);
        input.style.backgroundColor = themes[newTheme].black;
        input.style.borderColor = themes[newTheme].white;
        input.style.color = themes[newTheme].white;
    }

    let paragraphs = document.getElementsByTagName("p");
    for (let i = 0; i < paragraphs.length; i++)
        paragraphs.item(i).style.color = themes[newTheme].white;

    localStorage.setItem("com.time-viewer.theme", newTheme);
    theme = newTheme;

    reloadCanvas(date);
}

function reloadTime(date, timeZone) {
    let zoneExists = timeZone && validTimezone(timeZone);
    let defaultOpts = zoneExists ? { timeZone: zoneExists ? timeZone : dt.timeZone } : {};
    let formattedTime = formatDate(date, defaultOpts);

    document.getElementById("time").innerHTML =
    (!formattedTime.endsWith("(UTC)") ? formattedTime + "<br>" : "") +
    (zoneExists ? formatDate(date) + "<br>" : "") +
    formatDate(date, { timeZone: "UTC" }) + "<br>" +
    "Unix Time: " + Math.floor(date.getTime() / 1000);

    document.title = "time-viewer.com | " + date.toLocaleString(dt.locale, { ...defaultOpts, timeStyle: "short" });
}

function validTimestamp(timestamp) {
    return !isNaN(new Date(parseInt(timestamp) * 1000).getTime());
}

function validTimezone(timeZone) {
    try {
        new Intl.DateTimeFormat(new Intl.DateTimeFormat().resolvedOptions().locale, { timeZone });
        return true;
    } catch {
        return false;
    }
}