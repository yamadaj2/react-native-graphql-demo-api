const {User, Vote} = require('../../models');
const {getUserId} = require('../utils');

const vote = {
  async addVote(_, {movieId}, context, info) {
    const userId = getUserId(context);
    if (userId) {
      const user = await User.findOne({
        where: {id: userId},
        include: [
          {
            model: Vote,
            as: 'votes',
          }
        ]
      });
      if (user && user.votes.find(vote => vote?.movieId == movieId)) throw new Error('Cannot vote twice');

      const newVote = await Vote.create({userId, movieId});
      return newVote.id
    }
  },

  async removeVote(_, {movieId}, context) {
    const userId = getUserId(context);
    const vote = await Vote.findOne({where: {userId, movieId}});
    if (userId && vote && (vote.userId == userId)) {
      const deleted = await vote.destroy();
      if (deleted) return vote.id
      throw new Error('Not Authorized')
    }
    throw new Error('Vote not found');
  }
}

module.exports = {vote}