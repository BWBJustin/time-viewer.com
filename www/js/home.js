document.getElementById("root").style.display = "block";

let date = new Date();
let time = Math.floor(Date.now() / 1000);
let theme = localStorage.getItem("com.time-viewer.theme");
if (theme != "light" && theme != "dark") {
    localStorage.setItem("com.time-viewer.theme", "dark");
    theme = localStorage.getItem("com.time-viewer.theme");
}
document.getElementById(theme).checked = true;

reloadTime(date);
reloadTheme(theme, date);
setInterval(() => {
    let oldTime = time;
    time = Math.floor(Date.now() / 1000);

    if (oldTime != time) {
        date = new Date();
        hours = date.getHours() % 12 == 0 ? 12 : date.getHours() % 12;
        minutes = date.getMinutes();
        seconds = date.getSeconds();
        
        reloadTime(date);
        reloadCanvas(date);
    }
}, 1);