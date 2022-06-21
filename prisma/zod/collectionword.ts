import * as z from "zod"
import { CompleteCollection, RelatedCollectionModel } from "./index"

export const CollectionWordModel = z.object({
  id: z.number().int(),
  en: z.string(),
  ru: z.string(),
  image: z.string(),
  collectionId: z.number().int(),
  category: z.string(),
})

export interface CompleteCollectionWord extends z.infer<typeof CollectionWordModel> {
  collection: CompleteCollection
}

/**
 * RelatedCollectionWordModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCollectionWordModel: z.ZodSchema<CompleteCollectionWord> = z.lazy(() => CollectionWordModel.extend({
  collection: RelatedCollectionModel,
}))
