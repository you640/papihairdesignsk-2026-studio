import 'server-only'

const dictionaries = {
  sk: () => import('./dictionaries/sk.json').then(module => module.default),
}

export const getDictionary = async () => {
    // Always return the slovak dictionary
    return dictionaries.sk();
}
