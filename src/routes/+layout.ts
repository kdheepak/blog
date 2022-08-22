import "../../static/css/app.css";
import "../../static/css/latex.css";
import "../../static/css/pandoc.css";
import "../../static/css/tufte-extra.css";
import "../../static/css/tufte.css";
import "../../static/css/stork.css";

export async function load({ fetch }) {
  try {
    await fetch("/rss.xml");
    await fetch("/sitemap.xml");
    return;
  } catch (error) {
    console.error(error);
  }
}
