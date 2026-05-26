export default {
  name: 'partner',
  type: 'document',
  title: 'Partenaire',
  fields: [
    { name: 'name', type: 'string', title: 'Nom', validation: (Rule) => Rule.required() },
    {
      name: 'slug',
      type: 'slug',
      title: 'Identifiant',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      type: 'image',
      title: 'Logo',
      options: { hotspot: true },
      description: 'Logo affiché sur le site. Format PNG ou SVG de préférence, fond transparent.',
    },
    {
      name: 'logoUrl',
      type: 'string',
      title: 'Logo URL (fallback)',
      description: 'Utilisée si aucun logo uploadé dans Sanity.',
    },
    { name: 'url', type: 'url', title: 'Site web' },
    {
      name: 'order',
      type: 'number',
      title: 'Ordre d\'affichage',
      description: 'Plus petit = affiché en premier.',
      initialValue: 0,
    },
  ],
  orderings: [
    {
      title: 'Ordre d\'affichage',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
};
