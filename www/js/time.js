document.getElementById("root").style.display = "block";

let ctx = document.getElementsByTagName("canvas").item(0).getContext("2d");
let date = new Date(parseInt(location.pathname.slice(1)) * 1000);
let theme = localStorage.getItem("com.time-viewer.theme");
if (theme != "light" && theme != "dark") {
    localStorage.setItem("com.time-viewer.theme", "dark");
    theme = localStorage.getItem("com.time-viewer.theme");
}
document.getElementById(theme).checked = true;

reloadTime(date);
reloadTheme(theme, date);