import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID (Clerk)',
      description: 'The Clerk user ID of the person who performed this workout',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'userName',
      title: 'User Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      description: 'The date when this workout was performed',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      description: 'The total duration of the workout in seconds',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).integer(),
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
      description: 'The exercises performed in this workout with sets, reps and weights',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'workoutExercise',
          title: 'Exercise',
          fields: [
            defineField({
              name: 'exercise',
              title: 'Exercise',
              description: 'The exercise that was performed',
              type: 'reference',
              to: [{type: 'exercise'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sets',
              title: 'Sets',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'set',
                  title: 'Set',
                  fields: [
                    defineField({
                      name: 'reps',
                      title: 'Repetitions',
                      description: 'How many repetitions were completed',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(0).integer(),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      type: 'number',
                      description: 'Amount of weight used for this set',
                      validation: (Rule) => Rule.required().min(0),
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      description: 'The unit of measurement for the weight',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'Pounds (lbs)', value: 'lbs'},
                          {title: 'Kilograms (kg)', value: 'kg'},
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'kg',
                    }),
                  ],
                  preview: {
                    select: {
                      title: 'exercise.name',
                      subtitle: 'reps',
                      weight: 'weight',
                      weightUnit: 'weightUnit',
                    },
                    prepare({title, subtitle, weight, weightUnit}) {
                      return {
                        title: title || 'Exercise',
                        subtitle: `${subtitle} reps ${weight ? weight + weightUnit : ''}`,
                      }
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              exerciseName: 'exercise.name',
              exerciseImage: 'exercise.imageUrl',
              sets: 'sets',
            },
            prepare({exerciseName, exerciseImage, sets}) {
              const setCount = sets?.length ?? 0
              return {
                title: exerciseName ?? 'Unknown Exercise',
                subtitle: `${setCount} set${setCount !== 1 ? 's' : ''}`,
                media: exerciseImage,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      date: 'date',
      duration: 'duration',
      exercises: 'exercises',
    },
    prepare({date, duration, exercises}) {
      const exerciseCount = exercises?.length ?? 0
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date'
      const minutes = duration ? Math.floor(duration / 60) : 0
      return {
        title: `Workout — ${formattedDate}`,
        subtitle: `${minutes} min · ${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''}`,
      }
    },
  },
})
