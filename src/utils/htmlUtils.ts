
/**
 * Strips HTML tags from a string
 */
export const stripHtml = (html: string) => html.replace(/<[^>]*>?/gm, "");
