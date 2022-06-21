import * as z from "zod"
import { CompleteCollectionWord, RelatedCollectionWordModel } from "./index"

export const CollectionModel = z.object({
  id: z.number().int(),
  title: z.string(),
  cover: z.string(),
})

export interface CompleteCollection extends z.infer<typeof CollectionModel> {
  words: CompleteCollectionWord[]
}

/**
 * RelatedCollectionModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedCollectionModel: z.ZodSchema<CompleteCollection> = z.lazy(() => CollectionModel.extend({
  words: RelatedCollectionWordModel.array(),
}))
