const {User, Category, Movie, Vote} = require('../models');
const {getUserId, mapAttributes} = require('./utils');

const feed = async (_, args, context, info) => {
  const {categoryId} = args;
  const movies = await Movie.findAll({
    where: categoryId ? {categoryId} : {},
    include: [
      {
        model: Vote,
        as: 'votes',
        attributes: mapAttributes(Vote, info),
        include: [{
          model: User,
          as: 'user',
          attributes: mapAttributes(User, info)
        }]
      },
      {
        model: Category,
        as: 'category',
      }
    ]
  });

  return movies
}

const categories = async (_, args, context, info) => {
  const categories = await Category.findAll({
    where: {},
  });
  return categories
}

const currentUser = async (_, args, context, info) => {
  const userId = getUserId(context);
  if (userId) {
    const user = await User.findOne({
      where: {id: userId},
      include: [
        {
          model: Vote,
          as: 'votes',
          attributes: mapAttributes(Vote, info),
          include: [
            {
              model: Movie,
              as: 'movie',
              attributes: mapAttributes(Movie, info),
              include: [
                {
                  model: Category,
                  as: 'category',
                  attributes: mapAttributes(Category, info),
                }
              ]
            }
          ]
        }
      ]
    });

    return user;
  }
  throw new Error('User not found')
}

module.exports = {
  categories,
  currentUser,
  feed,
}