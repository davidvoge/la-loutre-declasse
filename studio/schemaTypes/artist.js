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
    {
      name: 'showOnPoster',
      type: 'boolean',
      title: "Afficher sur l'affiche",
      description: "Décoche pour masquer cet acte dans la section « à l'affiche » (il reste dans la programmation).",
      initialValue: true,
    },
    { name: 'shortDescription', type: 'text', title: 'Description courte', rows: 3 },
    { name: 'description', type: 'text', title: 'Description longue (modale)', rows: 6 },
    { name: 'photo', type: 'image', title: 'Photo', options: { hotspot: true }, description: 'Image affichée dans la fiche artiste. Prioritaire sur l’URL de secours.' },
    {
      name: 'photoUrl',
      type: 'string',
      title: 'Photo URL (fallback)',
      description: 'Utilisée seulement si aucune photo n’est uploadée ci-dessus.',
    },
    { name: 'externalUrl', type: 'url', title: 'Lien site / écoute' },
    { name: 'urlLabel', type: 'string', title: 'Libellé du lien', initialValue: 'Site' },
  ],
  preview: {
    select: { title: 'name', subtitle: 'day', media: 'photo' },
  },
};
