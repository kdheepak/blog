import { error } from "@sveltejs/kit";
import { base } from "$app/paths";

const allPosts = import.meta.glob("/src/posts/*.md");

export async function load({ params, fetch }) {
  const url = `${base}/${params.slug}.json`;
  const res = await fetch(url);
  if (res.ok) {
    const { metadata } = await res.json();
    const component = (await allPosts[`/${metadata.path}`]()).default;
    return { component, metadata };
  }
  throw error(404, `Could not load ${url}`);
}
