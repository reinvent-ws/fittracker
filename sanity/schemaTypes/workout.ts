import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'workout',
  title: 'Workout',
  type: 'document',
  fields: [
    defineField({
      name: 'userId',
      title: 'User ID (Clerk)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (seconds)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).integer(),
    }),
    defineField({
      name: 'exercises',
      title: 'Exercises',
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
                      title: 'Reps',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(0).integer(),
                    }),
                    defineField({
                      name: 'weight',
                      title: 'Weight',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(0),
                    }),
                    defineField({
                      name: 'weightUnit',
                      title: 'Weight Unit',
                      type: 'string',
                      options: {
                        list: [
                          {title: 'kg', value: 'kg'},
                          {title: 'lbs', value: 'lbs'},
                        ],
                        layout: 'radio',
                      },
                      initialValue: 'kg',
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      reps: 'reps',
                      weight: 'weight',
                      weightUnit: 'weightUnit',
                    },
                    prepare({reps, weight, weightUnit}) {
                      return {
                        title: `${reps} reps @ ${weight} ${weightUnit ?? ''}`,
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
              exerciseImage: 'exercise.image',
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
      userId: 'userId',
      date: 'date',
      duration: 'duration',
      exercises: 'exercises',
    },
    prepare({userId, date, duration, exercises}) {
      const exerciseCount = exercises?.length ?? 0
      const formattedDate = date ? new Date(date).toLocaleDateString() : 'No date'
      const minutes = duration ? Math.floor(duration / 60) : 0
      return {
        title: `Workout — ${formattedDate}`,
        subtitle: `${userId ?? 'Unknown user'} · ${exerciseCount} exercise${exerciseCount !== 1 ? 's' : ''} · ${minutes} min`,
      }
    },
  },
})
