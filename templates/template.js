<script>
var figures =
  Array.prototype.slice.call(document.getElementsByClassName("figure"),0)
  .concat(
    Array.prototype.slice.call(document.getElementsByTagName("figure"),0));

for (var i = 0; i < figures.length; i++) {
  var figure = figures[i];
  var imgs = figure.getElementsByTagName("img");
  if (imgs.length > 0) {
    classes = imgs[0].classList;
    for (var j = 0; j < classes.length; j++) {
        if (classes[j] === "fullwidth") {
            figure.classList.add(classes[j]);
        }
    }
  }
}
</script>
