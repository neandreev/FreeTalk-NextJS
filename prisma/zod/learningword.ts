import * as z from "zod"
import { CompleteUser, RelatedUserModel } from "./index"

export const LearningWordModel = z.object({
  id: z.number().int(),
  en: z.string(),
  ru: z.string(),
  category: z.string(),
  learned: z.boolean(),
  timeToTrain: z.number().int(),
  completedTrains: z.number().int(),
  image: z.string(),
  userEmail: z.string(),
})

export interface CompleteLearningWord extends z.infer<typeof LearningWordModel> {
  user: CompleteUser
}

/**
 * RelatedLearningWordModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedLearningWordModel: z.ZodSchema<CompleteLearningWord> = z.lazy(() => LearningWordModel.extend({
  user: RelatedUserModel,
}))
