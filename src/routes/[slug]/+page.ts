import type { PageLoad } from './$types';
import { error } from "@sveltejs/kit";
import { base } from "$app/paths";

const allPosts = import.meta.glob("/src/posts/*.md");

export const load: PageLoad = async ({params, parent, data}) => {
  const { metadata } = data
  const component = (await allPosts[`/${metadata.path}`]()).default;
  return { component, metadata };
}
