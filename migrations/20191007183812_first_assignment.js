
exports.up = function(knex) {
    return knex.schema.createTable('Assignments', (table) => {
        table.increments('id')
        table.string('title')
        table.boolean('isFinished')
        table.integer('studentsId')
        table.foreign('studentsId').references('Students.id')
      })
};

exports.down = function(knex) {
    return knex.schema.raw('DROP TABLE Assignments')
};
