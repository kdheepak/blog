export async function load({ fetch }) {
  try {
    await fetch("/sitemap.xml");
    return;
  } catch (error) {
    console.error(error);
  }
}
