import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { ProductSchema } from './types/schemas';

const productsCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.json', base: './src/content/products' }),
  schema: ProductSchema
});

export const collections = {
  'products': productsCollection
};
