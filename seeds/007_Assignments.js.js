
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('Assignments').del()
    .then(function () {
      // Inserts seed entries
      return knex('Assignments').insert([
        {
          title: 'Music Database',
          isFinished: true,
          studentsId: 1
        },
        {
          title: 'Music Database',
          isFinished: true,
          studentsId: 2
        },
        {
          title: 'Music Database',
          isFinished: true,
          studentsId: 3
        },
        {
          title: 'Music Database',
          isFinished: true,
          studentsId: 4
        }
      ]);
    });
};
