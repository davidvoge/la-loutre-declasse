export default {
  name: 'artist',
  type: 'document',
  title: 'Artiste',
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
      name: 'day',
      type: 'string',
      title: 'Jour',
      options: {
        list: [
          { title: 'Vendredi', value: 'ven' },
          { title: 'Samedi', value: 'sam' },
          { title: 'Dimanche', value: 'dim' },
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    { name: 'time', type: 'string', title: 'Horaire', description: 'Ex : 19h30' },
    { name: 'stage', type: 'string', title: 'Scène / lieu' },
    { name: 'genre', type: 'string', title: 'Genre / style' },
    {
      name: 'size',
      type: 'string',
      title: 'Taille affiche',
      options: {
        list: [
          { title: 'XL', value: 'xl' },
          { title: 'L', value: 'l' },
          { title: 'M', value: 'm' },
        ],
      },
      initialValue: 'l',
    },
    { name: 'shortDescription', type: 'text', title: 'Description courte', rows: 3 },
    { name: 'description', type: 'text', title: 'Description longue (modale)', rows: 6 },
    { name: 'photo', type: 'image', title: 'Photo', options: { hotspot: true } },
    {
      name: 'photoUrl',
      type: 'string',
      title: 'Photo URL (fallback)',
      description: 'Utilisée si aucune photo uploadée dans Sanity',
    },
    { name: 'externalUrl', type: 'url', title: 'Lien site / écoute' },
    { name: 'urlLabel', type: 'string', title: 'Libellé du lien', initialValue: 'Site' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'day', media: 'photo' },
  },
};
